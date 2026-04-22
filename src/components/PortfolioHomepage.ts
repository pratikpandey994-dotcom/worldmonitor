import type { MarketData } from '@/types';
import { COMMODITIES } from '@/config/markets';
import {
  getMarketWatchlistEntries,
  parseMarketWatchlistInput,
  setMarketWatchlistEntries,
  subscribeMarketWatchlistChange,
  type MarketWatchlistEntry,
} from '@/services/market-watchlist';
import { fetchCommodityQuotes } from '@/services/market';
import { fetchTradeImpactFeed, type TradeImpactItem } from '@/services/trade-impact-feed';

const DEFAULT_PORTFOLIO_WATCHLIST: MarketWatchlistEntry[] = [
  { symbol: 'EURUSD=X', name: 'EUR/USD', display: 'EUR/USD' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD', display: 'GBP/USD' },
  { symbol: 'USDJPY=X', name: 'USD/JPY', display: 'USD/JPY' },
  { symbol: 'AUDUSD=X', name: 'AUD/USD', display: 'AUD/USD' },
  { symbol: 'GC=F', name: 'Gold', display: 'XAU/USD' },
  { symbol: 'SI=F', name: 'Silver', display: 'XAG/USD' },
  { symbol: 'PL=F', name: 'Platinum', display: 'Platinum' },
];

function ensurePortfolioWatchlist(): MarketWatchlistEntry[] {
  const existing = getMarketWatchlistEntries();
  if (existing.length > 0) return existing;
  setMarketWatchlistEntries(DEFAULT_PORTFOLIO_WATCHLIST);
  return DEFAULT_PORTFOLIO_WATCHLIST;
}

function formatPrice(value: number | null, symbol: string): string {
  if (value == null || !Number.isFinite(value)) return 'Unavailable';
  const digits = symbol.endsWith('=X') ? 4 : value >= 100 ? 2 : 3;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatChange(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCommodityRequest(entries: MarketWatchlistEntry[]): Array<{ symbol: string; name: string; display: string }> {
  const configBySymbol = new Map(COMMODITIES.map((commodity) => [commodity.symbol, commodity]));

  return entries.map((entry) => {
    const config = configBySymbol.get(entry.symbol);
    return {
      symbol: entry.symbol,
      name: entry.name || config?.name || entry.symbol,
      display: entry.display || config?.display || entry.symbol,
    };
  });
}

export class PortfolioHomepage {
  private container: HTMLElement;
  private watchlist: MarketWatchlistEntry[];
  private quotes = new Map<string, MarketData>();
  private impactItems: TradeImpactItem[] = [];
  private unsubscribeWatchlist: (() => void) | null = null;
  private refreshHandle: number | null = null;
  private loadSeq = 0;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container ${containerId} not found`);
    this.container = container;
    this.watchlist = ensurePortfolioWatchlist();
  }

  public async mount(): Promise<void> {
    document.title = 'TradeTerminal Portfolio';
    this.renderShell();
    this.attachEvents();
    this.unsubscribeWatchlist = subscribeMarketWatchlistChange((entries) => {
      this.watchlist = entries.length > 0 ? entries : DEFAULT_PORTFOLIO_WATCHLIST;
      this.renderWatchlist();
      void this.refreshData();
    });
    await this.refreshData();
    this.refreshHandle = window.setInterval(() => {
      void this.refreshData();
    }, 5 * 60 * 1000);
  }

  public destroy(): void {
    this.unsubscribeWatchlist?.();
    this.unsubscribeWatchlist = null;
    if (this.refreshHandle !== null) {
      window.clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }
  }

  private renderShell(): void {
    this.container.innerHTML = `
      <main class="portfolio-homepage">
        <section class="portfolio-homepage__hero">
          <div class="portfolio-homepage__hero-copy">
            <p class="portfolio-homepage__eyebrow">TradeTerminal</p>
            <h1>Personal Portfolio</h1>
            <p class="portfolio-homepage__lede">
              A reworked trading homepage focused on forex, metals, and macro-sensitive headlines.
            </p>
          </div>
          <div class="portfolio-homepage__hero-meta">
            <span class="portfolio-homepage__meta-label">Mode</span>
            <strong>Personalized B2B Terminal</strong>
          </div>
        </section>

        <section class="portfolio-grid" aria-label="TradeTerminal portfolio layout">
          <section class="portfolio-card portfolio-card--watchlist" aria-labelledby="portfolio-watchlist-title">
            <div class="portfolio-card__header">
              <div>
                <p class="portfolio-card__eyebrow">Custom Watchlist</p>
                <h2 id="portfolio-watchlist-title">Forex pairs and metals</h2>
              </div>
            </div>
            <form class="portfolio-watchlist__composer" id="portfolioWatchlistForm">
              <label class="portfolio-watchlist__label" for="portfolioWatchlistInput">Add symbols</label>
              <div class="portfolio-watchlist__composer-row">
                <input
                  id="portfolioWatchlistInput"
                  class="portfolio-watchlist__input"
                  type="text"
                  placeholder="EURUSD=X, GBPUSD=X, GC=F|XAU/USD"
                />
                <button class="portfolio-watchlist__add" type="submit">Update</button>
              </div>
            </form>
            <div class="portfolio-watchlist__list" id="portfolioWatchlistList"></div>
          </section>

          <section class="portfolio-card portfolio-card--heatmap" aria-labelledby="portfolio-heatmap-title">
            <div class="portfolio-card__header">
              <div>
                <p class="portfolio-card__eyebrow">Financial Heatmap</p>
                <h2 id="portfolio-heatmap-title">Market movement matrix</h2>
              </div>
            </div>
            <div class="portfolio-heatmap" id="portfolioHeatmap"></div>
          </section>

          <aside class="portfolio-card portfolio-card--feed" aria-labelledby="portfolio-feed-title">
            <div class="portfolio-card__header">
              <div>
                <p class="portfolio-card__eyebrow">Geopolitical Impact Feed</p>
                <h2 id="portfolio-feed-title">AI-analyzed market headlines</h2>
              </div>
            </div>
            <div class="portfolio-feed" id="portfolioImpactFeed"></div>
          </aside>
        </section>
      </main>
    `;

    this.renderWatchlist();
    this.renderHeatmap(true);
    this.renderImpactFeed(true);
  }

  private attachEvents(): void {
    const form = this.container.querySelector<HTMLFormElement>('#portfolioWatchlistForm');
    const input = this.container.querySelector<HTMLInputElement>('#portfolioWatchlistInput');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const next = parseMarketWatchlistInput(input?.value || '');
      if (next.length === 0) return;
      setMarketWatchlistEntries(next);
      if (input) input.value = '';
    });

    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      const removeButton = target?.closest<HTMLButtonElement>('[data-remove-symbol]');
      if (!removeButton) return;
      const symbol = removeButton.dataset.removeSymbol;
      if (!symbol) return;
      const next = this.watchlist.filter((entry) => entry.symbol !== symbol);
      setMarketWatchlistEntries(next.length > 0 ? next : DEFAULT_PORTFOLIO_WATCHLIST);
    });
  }

  private async refreshData(): Promise<void> {
    const seq = ++this.loadSeq;
    this.renderHeatmap(true);
    this.renderImpactFeed(true);

    const quoteRequest = buildCommodityRequest(this.watchlist);
    const [quoteResult, impactResult] = await Promise.allSettled([
      fetchCommodityQuotes(quoteRequest),
      fetchTradeImpactFeed(this.watchlist),
    ]);

    if (seq !== this.loadSeq) return;

    if (quoteResult.status === 'fulfilled') {
      this.quotes = new Map(quoteResult.value.data.map((quote) => [quote.symbol, quote]));
    }

    if (impactResult.status === 'fulfilled') {
      this.impactItems = impactResult.value.items;
    } else {
      this.impactItems = [];
    }

    this.renderHeatmap(false);
    this.renderImpactFeed(false);
  }

  private renderWatchlist(): void {
    const mount = this.container.querySelector<HTMLElement>('#portfolioWatchlistList');
    if (!mount) return;

    mount.innerHTML = this.watchlist.map((entry) => {
      const quote = this.quotes.get(entry.symbol);
      const tone = quote?.change == null
        ? 'neutral'
        : quote.change > 0
          ? 'bullish'
          : quote.change < 0
            ? 'bearish'
            : 'neutral';

      return `
        <article class="portfolio-watchlist__item">
          <div>
            <div class="portfolio-watchlist__name">${escapeHtml(entry.display || entry.name || entry.symbol)}</div>
            <div class="portfolio-watchlist__symbol">${escapeHtml(entry.symbol)}</div>
          </div>
          <div class="portfolio-watchlist__metrics">
            <span class="portfolio-watchlist__price">${escapeHtml(formatPrice(quote?.price ?? null, entry.symbol))}</span>
            <span class="portfolio-watchlist__change portfolio-watchlist__change--${tone}">${escapeHtml(formatChange(quote?.change ?? null))}</span>
          </div>
          <button class="portfolio-watchlist__remove" type="button" data-remove-symbol="${escapeHtml(entry.symbol)}" aria-label="Remove ${escapeHtml(entry.symbol)}">Remove</button>
        </article>
      `;
    }).join('');
  }

  private renderHeatmap(loading: boolean): void {
    const mount = this.container.querySelector<HTMLElement>('#portfolioHeatmap');
    if (!mount) return;

    if (loading) {
      mount.innerHTML = '<div class="portfolio-heatmap__empty">Refreshing market matrix...</div>';
      return;
    }

    if (this.watchlist.length === 0) {
      mount.innerHTML = '<div class="portfolio-heatmap__empty">No instruments in the watchlist.</div>';
      return;
    }

    mount.innerHTML = this.watchlist.map((entry) => {
      const quote = this.quotes.get(entry.symbol);
      const change = quote?.change ?? 0;
      const intensity = Math.min(100, Math.round(Math.abs(change) * 12));
      const tone = change > 0 ? 'bullish' : change < 0 ? 'bearish' : 'neutral';
      return `
        <article class="portfolio-heatmap__tile portfolio-heatmap__tile--${tone}" style="--heat-intensity:${intensity}%">
          <div class="portfolio-heatmap__symbol">${escapeHtml(entry.display || entry.symbol)}</div>
          <div class="portfolio-heatmap__price">${escapeHtml(formatPrice(quote?.price ?? null, entry.symbol))}</div>
          <div class="portfolio-heatmap__change">${escapeHtml(formatChange(quote?.change ?? null))}</div>
        </article>
      `;
    }).join('');

    this.renderWatchlist();
  }

  private renderImpactFeed(loading: boolean): void {
    const mount = this.container.querySelector<HTMLElement>('#portfolioImpactFeed');
    if (!mount) return;

    if (loading) {
      mount.innerHTML = '<div class="portfolio-feed__empty">Filtering finance headlines and running AI impact analysis...</div>';
      return;
    }

    if (this.impactItems.length === 0) {
      mount.innerHTML = '<div class="portfolio-feed__empty">No relevant macro or watchlist-linked headlines were found.</div>';
      return;
    }

    mount.innerHTML = this.impactItems.map((item) => `
      <article class="portfolio-feed__item">
        <div class="portfolio-feed__topline">
          <span class="portfolio-feed__sentiment portfolio-feed__sentiment--${item.sentiment.toLowerCase()}">${escapeHtml(item.sentiment)}</span>
          <span class="portfolio-feed__source">${escapeHtml(item.source)}</span>
        </div>
        <h3>${escapeHtml(item.headline)}</h3>
        <p>${escapeHtml(item.impact_analysis)}</p>
      </article>
    `).join('');
  }
}
