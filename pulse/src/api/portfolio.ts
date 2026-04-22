import { hasSupabaseEnv, supabase } from '@/services/supabase'
import type {
  AddAssetInput,
  PortfolioAsset,
  UpdateAssetInput,
  UserProfile,
  WatchlistAsset,
} from '@/types'
import { DEMO_PORTFOLIO_ASSETS, DEMO_WATCHLIST } from '@/utils/demoData'

const PORTFOLIO_STORAGE_KEY = 'pulse-portfolio-assets'
const WATCHLIST_STORAGE_KEY = 'pulse-watchlist-assets'

function readLocal<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeLocal<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function localPortfolio(userId: string): PortfolioAsset[] {
  const stored = readLocal<PortfolioAsset[]>(PORTFOLIO_STORAGE_KEY, [])
  if (stored.length > 0) return stored
  const seeded = DEMO_PORTFOLIO_ASSETS.map((asset) => ({ ...asset, userId }))
  writeLocal(PORTFOLIO_STORAGE_KEY, seeded)
  return seeded
}

function localWatchlist(userId: string): WatchlistAsset[] {
  const stored = readLocal<WatchlistAsset[]>(WATCHLIST_STORAGE_KEY, [])
  if (stored.length > 0) return stored
  const seeded = DEMO_WATCHLIST.map((asset) => ({ ...asset, userId }))
  writeLocal(WATCHLIST_STORAGE_KEY, seeded)
  return seeded
}

function toPortfolioRecord(input: AddAssetInput, user: UserProfile): PortfolioAsset {
  return {
    id: crypto.randomUUID(),
    userId: user.id,
    ticker: input.ticker.toUpperCase(),
    assetName: input.assetName,
    assetType: input.assetType,
    exchange: input.exchange ?? null,
    quantity: input.quantity ?? null,
    avgBuyPrice: input.avgBuyPrice ?? null,
    currency: input.currency ?? 'INR',
    addedAt: new Date().toISOString(),
    isActive: true,
  }
}

export async function listPortfolioAssets(user: UserProfile): Promise<PortfolioAsset[]> {
  if (!hasSupabaseEnv || user.id === 'guest-user' || !supabase) {
    return localPortfolio(user.id)
  }

  const { data, error } = await supabase
    .from('portfolio_assets')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('added_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    ticker: row.ticker,
    assetName: row.asset_name,
    assetType: row.asset_type,
    exchange: row.exchange,
    quantity: row.quantity,
    avgBuyPrice: row.avg_buy_price,
    currency: row.currency,
    addedAt: row.added_at,
    isActive: row.is_active,
  }))
}

export async function addPortfolioAsset(user: UserProfile, input: AddAssetInput): Promise<PortfolioAsset> {
  const record = toPortfolioRecord(input, user)

  if (!hasSupabaseEnv || user.id === 'guest-user' || !supabase) {
    const next = [record, ...localPortfolio(user.id).filter((asset) => asset.ticker !== record.ticker)]
    writeLocal(PORTFOLIO_STORAGE_KEY, next)
    return record
  }

  const { data, error } = await supabase
    .from('portfolio_assets')
    .insert({
      user_id: user.id,
      ticker: record.ticker,
      asset_name: record.assetName,
      asset_type: record.assetType,
      exchange: record.exchange,
      quantity: record.quantity,
      avg_buy_price: record.avgBuyPrice,
      currency: record.currency,
    })
    .select('*')
    .single()

  if (error) throw error

  return {
    id: data.id,
    userId: data.user_id,
    ticker: data.ticker,
    assetName: data.asset_name,
    assetType: data.asset_type,
    exchange: data.exchange,
    quantity: data.quantity,
    avgBuyPrice: data.avg_buy_price,
    currency: data.currency,
    addedAt: data.added_at,
    isActive: data.is_active,
  }
}

export async function removePortfolioAsset(user: UserProfile, ticker: string): Promise<void> {
  if (!hasSupabaseEnv || user.id === 'guest-user' || !supabase) {
    writeLocal(PORTFOLIO_STORAGE_KEY, localPortfolio(user.id).filter((asset) => asset.ticker !== ticker))
    return
  }

  const { error } = await supabase
    .from('portfolio_assets')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('ticker', ticker)

  if (error) throw error
}

export async function updatePortfolioAsset(
  user: UserProfile,
  ticker: string,
  updates: UpdateAssetInput,
): Promise<void> {
  if (!hasSupabaseEnv || user.id === 'guest-user' || !supabase) {
    const next = localPortfolio(user.id).map((asset) => (
      asset.ticker === ticker
        ? { ...asset, quantity: updates.quantity ?? asset.quantity, avgBuyPrice: updates.avgBuyPrice ?? asset.avgBuyPrice }
        : asset
    ))
    writeLocal(PORTFOLIO_STORAGE_KEY, next)
    return
  }

  const { error } = await supabase
    .from('portfolio_assets')
    .update({
      quantity: updates.quantity,
      avg_buy_price: updates.avgBuyPrice,
    })
    .eq('user_id', user.id)
    .eq('ticker', ticker)

  if (error) throw error
}

export async function listWatchlistAssets(user: UserProfile): Promise<WatchlistAsset[]> {
  if (!hasSupabaseEnv || user.id === 'guest-user' || !supabase) {
    return localWatchlist(user.id)
  }

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    ticker: row.ticker,
    assetName: row.asset_name,
    assetType: row.asset_type,
    exchange: row.exchange,
    addedAt: row.added_at,
  }))
}
