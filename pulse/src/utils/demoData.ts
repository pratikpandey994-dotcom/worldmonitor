import type {
  AssetSuggestion,
  EconomicEvent,
  FeedArticle,
  MarketIndex,
  PortfolioAsset,
  PriceQuote,
  WatchlistAsset,
} from '@/types'
import { sentimentLabelFromScore } from './sentimentHelpers'

export const ASSET_SUGGESTIONS: AssetSuggestion[] = [
  { ticker: 'RELIANCE.NS', assetName: 'Reliance Industries', assetType: 'stock', exchange: 'NSE', currency: 'INR' },
  { ticker: 'TCS.NS', assetName: 'Tata Consultancy Services', assetType: 'stock', exchange: 'NSE', currency: 'INR' },
  { ticker: 'HDFCBANK.NS', assetName: 'HDFC Bank', assetType: 'stock', exchange: 'NSE', currency: 'INR' },
  { ticker: 'BTC', assetName: 'Bitcoin', assetType: 'crypto', exchange: 'CoinGecko', currency: 'USD' },
  { ticker: 'USDINR', assetName: 'US Dollar / Indian Rupee', assetType: 'forex', exchange: 'FX', currency: 'INR' },
  { ticker: 'GOLD', assetName: 'Gold Spot', assetType: 'commodity', exchange: 'Metals', currency: 'USD' },
]

export const DEMO_PORTFOLIO_ASSETS: PortfolioAsset[] = [
  {
    id: 'asset-reliance',
    userId: 'guest-user',
    ticker: 'RELIANCE.NS',
    assetName: 'Reliance Industries',
    assetType: 'stock',
    exchange: 'NSE',
    quantity: 12,
    avgBuyPrice: 2810,
    currency: 'INR',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'asset-btc',
    userId: 'guest-user',
    ticker: 'BTC',
    assetName: 'Bitcoin',
    assetType: 'crypto',
    exchange: 'CoinGecko',
    quantity: 0.15,
    avgBuyPrice: 62800,
    currency: 'USD',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
]

export const DEMO_WATCHLIST: WatchlistAsset[] = [
  {
    id: 'watchlist-gold',
    userId: 'guest-user',
    ticker: 'GOLD',
    assetName: 'Gold Spot',
    assetType: 'commodity',
    exchange: 'Metals',
    addedAt: new Date().toISOString(),
  },
]

export const DEMO_QUOTES: Record<string, PriceQuote> = {
  'RELIANCE.NS': { ticker: 'RELIANCE.NS', currentPrice: 2847.3, changePercent: 1.2, currency: 'INR', unreadNewsCount: 3, sentiment: 'bullish' },
  BTC: { ticker: 'BTC', currentPrice: 69120.42, changePercent: 2.1, currency: 'USD', unreadNewsCount: 4, sentiment: 'bullish' },
  GOLD: { ticker: 'GOLD', currentPrice: 2334.6, changePercent: -0.3, currency: 'USD', unreadNewsCount: 2, sentiment: 'neutral' },
}

const NOW = Date.now()

function article(
  id: string,
  headline: string,
  source: string,
  minutesAgo: number,
  tickers: string[],
  score: number,
  impactSummary: string,
  fullAnalysis: string,
  sparkline: number[],
  category: FeedArticle['category'],
): FeedArticle {
  return {
    id,
    headline,
    source,
    publishedAt: new Date(NOW - minutesAgo * 60_000).toISOString(),
    tickers,
    sentimentLabel: sentimentLabelFromScore(score),
    sentimentScore: score,
    impactSummary,
    fullAnalysis,
    sparkline,
    relevanceScore: Math.min(0.99, 0.55 + Math.abs(score) / 200),
    category,
  }
}

export const MOCK_FEED: FeedArticle[] = [
  article(
    'feed-1',
    'RBI holds rates steady and keeps liquidity stance supportive for lenders',
    'Reuters',
    14,
    ['HDFCBANK.NS', 'RELIANCE.NS'],
    72,
    'Positive for rate-sensitive financials and broader domestic demand proxies in Indian equities.',
    'A stable rates backdrop preserves loan growth visibility for private banks while helping cap near-term funding stress across leveraged domestic sectors.',
    [1502, 1506, 1508, 1511, 1512],
    'macro',
  ),
  article(
    'feed-2',
    'Oil edges higher after Red Sea shipping concerns return to the market',
    'Financial Times',
    28,
    ['RELIANCE.NS', 'CRUDE_OIL', 'GOLD'],
    -41,
    'Higher crude can pressure refining and logistics margins while supporting defensive commodities.',
    'If the move persists, energy importers and downstream operators face margin pressure while gold and upstream exposure stay relatively supported.',
    [82, 83, 82.4, 84.1, 84.6],
    'global',
  ),
  article(
    'feed-3',
    'Bitcoin ETFs see fresh inflows as risk appetite improves',
    'CoinDesk',
    33,
    ['BTC'],
    68,
    'Renewed ETF demand is supportive for near-term crypto momentum and improves sentiment across majors.',
    'A steady bid from spot ETF vehicles often becomes a sentiment anchor for retail and institutional flows, especially when macro volatility is contained.',
    [67120, 67680, 68210, 68890, 69120],
    'company',
  ),
]

export const MARKET_INDICES: MarketIndex[] = [
  { symbol: 'NIFTY', label: 'NIFTY 50', value: '22,468', changePercent: 0.42 },
  { symbol: 'SENSEX', label: 'SENSEX', value: '73,914', changePercent: -0.11 },
  { symbol: 'SPX', label: 'S&P 500', value: '5,212', changePercent: 0.38 },
  { symbol: 'NASDAQ', label: 'NASDAQ', value: '16,398', changePercent: 0.76 },
  { symbol: 'BTC', label: 'Bitcoin', value: '$69,120', changePercent: 2.1 },
]

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  { id: 'event-rbi', title: 'RBI Policy Review', dateLabel: 'May 7 • 10:00 IST', impact: 'high' },
  { id: 'event-reliance', title: 'Reliance Q4 Earnings', dateLabel: 'Apr 28 • After close', impact: 'high' },
  { id: 'event-us-cpi', title: 'US CPI Print', dateLabel: 'May 10 • 18:00 IST', impact: 'medium' },
]
