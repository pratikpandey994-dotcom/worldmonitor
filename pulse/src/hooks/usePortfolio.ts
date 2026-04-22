import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addPortfolioAsset,
  listPortfolioAssets,
  listWatchlistAssets,
  removePortfolioAsset,
  updatePortfolioAsset,
} from '@/api/portfolio'
import { listPriceQuotes } from '@/api/prices'
import { useAuth } from './useAuth'
import type { AddAssetInput, PortfolioAsset, WatchlistAsset } from '@/types'

export function usePortfolio() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const portfolioQuery = useQuery<PortfolioAsset[]>({
    queryKey: ['portfolio', user?.id],
    queryFn: () => listPortfolioAssets(user!),
    enabled: Boolean(user),
    staleTime: 30_000,
  })

  const watchlistQuery = useQuery<WatchlistAsset[]>({
    queryKey: ['watchlist', user?.id],
    queryFn: () => listWatchlistAssets(user!),
    enabled: Boolean(user),
    staleTime: 30_000,
  })

  const quotesQuery = useQuery({
    queryKey: ['quotes', user?.id, portfolioQuery.data?.map((asset) => asset.ticker).join(',')],
    queryFn: () => listPriceQuotes(portfolioQuery.data ?? []),
    enabled: Boolean(user),
    staleTime: 15_000,
    refetchInterval: 15_000,
  })

  const addMutation = useMutation({
    mutationFn: (input: AddAssetInput) => addPortfolioAsset(user!, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] })
      await queryClient.invalidateQueries({ queryKey: ['quotes', user?.id] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (ticker: string) => removePortfolioAsset(user!, ticker),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] })
      await queryClient.invalidateQueries({ queryKey: ['quotes', user?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ ticker, quantity, avgBuyPrice }: { ticker: string; quantity?: number | null; avgBuyPrice?: number | null }) =>
      updatePortfolioAsset(user!, ticker, { quantity, avgBuyPrice }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] })
    },
  })

  const overview = useMemo(() => {
    const assets = portfolioQuery.data ?? []
    const quotes = quotesQuery.data ?? {}
    const totalValue = assets.reduce((sum, asset) => {
      const quote = quotes[asset.ticker]
      if (!quote || !asset.quantity) return sum
      return sum + quote.currentPrice * asset.quantity
    }, 0)
    const costBasis = assets.reduce((sum, asset) => {
      if (!asset.quantity || !asset.avgBuyPrice) return sum
      return sum + asset.avgBuyPrice * asset.quantity
    }, 0)
    return {
      assetCount: assets.length,
      totalValue,
      pnl: totalValue - costBasis,
      hasCostBasis: costBasis > 0,
    }
  }, [portfolioQuery.data, quotesQuery.data])

  return {
    assets: portfolioQuery.data ?? [],
    watchlist: watchlistQuery.data ?? [],
    quotes: quotesQuery.data ?? {},
    overview,
    isLoading: portfolioQuery.isLoading || watchlistQuery.isLoading,
    isQuotesLoading: quotesQuery.isLoading,
    addAsset: addMutation.mutateAsync,
    removeAsset: removeMutation.mutateAsync,
    updateAsset: updateMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
