import { toApiUrl } from '@/services/runtime';
import type { MarketWatchlistEntry } from '@/services/market-watchlist';

export interface TradeImpactItem {
  headline: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact_analysis: string;
  source: string;
}

const WATCHLIST_KEYWORD_MAP: Record<string, string[]> = {
  'EURUSD=X': ['EUR/USD', 'euro dollar', 'ECB', 'Fed', 'eurozone inflation', 'dollar index'],
  'GBPUSD=X': ['GBP/USD', 'pound sterling', 'Bank of England', 'BoE', 'UK inflation', 'gilts'],
  'USDJPY=X': ['USD/JPY', 'yen', 'Bank of Japan', 'BoJ', 'yield control', 'Treasury yields'],
  'AUDUSD=X': ['AUD/USD', 'aussie dollar', 'RBA', 'Reserve Bank of Australia', 'China demand', 'iron ore'],
  'GC=F': ['XAU/USD', 'gold', 'bullion', 'real yields', 'safe haven', 'COMEX gold'],
  'SI=F': ['XAG/USD', 'silver', 'precious metals', 'industrial metals', 'COMEX silver'],
  'PL=F': ['platinum', 'PGM', 'auto catalysts', 'South Africa mining'],
  'PA=F': ['palladium', 'PGM', 'auto demand', 'Russian metals'],
};

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function buildTradeImpactKeywords(watchlist: MarketWatchlistEntry[]): string[] {
  const keywords = watchlist.flatMap((entry) => [
    entry.symbol,
    entry.display || '',
    entry.name || '',
    ...(WATCHLIST_KEYWORD_MAP[entry.symbol] ?? []),
  ]);

  keywords.push(
    'central bank',
    'rate decision',
    'inflation',
    'tariffs',
    'nonfarm payrolls',
    'CPI',
    'PPI',
    'Treasury yields',
    'macro',
    'FX market',
  );

  return unique(keywords);
}

export async function fetchTradeImpactFeed(watchlist: MarketWatchlistEntry[]): Promise<{ items: TradeImpactItem[] }> {
  const keywords = buildTradeImpactKeywords(watchlist);
  const url = new URL(toApiUrl('/api/trade-impact-feed'), window.location.href);
  url.searchParams.set('symbols', watchlist.map((entry) => entry.symbol).join(','));
  url.searchParams.set('keywords', keywords.join(','));

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`trade-impact-feed ${response.status}`);
  }

  const raw = await response.json() as { items?: TradeImpactItem[] };
  return { items: Array.isArray(raw.items) ? raw.items : [] };
}
