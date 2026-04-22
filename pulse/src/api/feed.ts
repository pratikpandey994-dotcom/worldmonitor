import type { FeedArticle, PortfolioAsset } from '@/types'
import { MOCK_FEED } from '@/utils/demoData'

export async function listFeedArticles(assets: PortfolioAsset[]): Promise<FeedArticle[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 320))
  if (assets.length === 0) return MOCK_FEED
  const tickers = new Set(assets.map((asset) => asset.ticker))
  return MOCK_FEED.filter((article) => article.tickers.some((ticker) => tickers.has(ticker)))
}
