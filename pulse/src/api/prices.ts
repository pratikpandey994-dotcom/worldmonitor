import type { PortfolioAsset, PriceQuote } from '@/types'
import { DEMO_QUOTES } from '@/utils/demoData'

export async function listPriceQuotes(assets: PortfolioAsset[]): Promise<Record<string, PriceQuote>> {
  await new Promise((resolve) => window.setTimeout(resolve, 180))
  return assets.reduce<Record<string, PriceQuote>>((acc, asset) => {
    acc[asset.ticker] = DEMO_QUOTES[asset.ticker] ?? {
      ticker: asset.ticker,
      currentPrice: 0,
      changePercent: 0,
      currency: asset.currency,
      unreadNewsCount: 0,
      sentiment: 'neutral',
    }
    return acc
  }, {})
}
