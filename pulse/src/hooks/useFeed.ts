import { useQuery } from '@tanstack/react-query'
import { listFeedArticles } from '@/api/feed'
import { usePortfolio } from './usePortfolio'

export function useFeed() {
  const { assets } = usePortfolio()

  return useQuery({
    queryKey: ['feed', assets.map((asset) => asset.ticker).join(',')],
    queryFn: () => listFeedArticles(assets),
    staleTime: 120_000,
  })
}
