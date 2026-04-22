export type AssetType = 'stock' | 'crypto' | 'forex' | 'commodity'
export type SubscriptionTier = 'free' | 'pro'
export type FeedSentiment = 'bullish' | 'bearish' | 'neutral'
export type PortfolioView = 'portfolio' | 'watchlist'
export type MobileTab = 'feed' | 'portfolio' | 'markets' | 'alerts' | 'profile'

export interface UserProfile {
  id: string
  email: string | null
  displayName: string
  avatarUrl?: string | null
  subscriptionTier: SubscriptionTier
}

export interface PortfolioAsset {
  id: string
  userId: string
  ticker: string
  assetName: string
  assetType: AssetType
  exchange?: string | null
  quantity?: number | null
  avgBuyPrice?: number | null
  currency: string
  addedAt: string
  isActive: boolean
}

export interface WatchlistAsset {
  id: string
  userId: string
  ticker: string
  assetName: string
  assetType: AssetType
  exchange?: string | null
  addedAt: string
}

export interface PriceQuote {
  ticker: string
  currentPrice: number
  changePercent: number
  currency: string
  unreadNewsCount: number
  sentiment: FeedSentiment
}

export interface FeedArticle {
  id: string
  headline: string
  source: string
  publishedAt: string
  tickers: string[]
  sentimentLabel: FeedSentiment
  sentimentScore: number
  impactSummary: string
  fullAnalysis: string
  sparkline: number[]
  relevanceScore: number
  category: 'macro' | 'company' | 'regulatory' | 'global'
}

export interface MarketIndex {
  symbol: string
  label: string
  value: string
  changePercent: number
}

export interface EconomicEvent {
  id: string
  title: string
  dateLabel: string
  impact: 'high' | 'medium' | 'low'
}

export interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  user: UserProfile | null
  isGuest: boolean
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AddAssetInput {
  ticker: string
  assetName: string
  assetType: AssetType
  exchange?: string | null
  quantity?: number | null
  avgBuyPrice?: number | null
  currency?: string
}

export interface UpdateAssetInput {
  quantity?: number | null
  avgBuyPrice?: number | null
}

export interface AssetSuggestion {
  ticker: string
  assetName: string
  assetType: AssetType
  exchange?: string | null
  currency: string
}
