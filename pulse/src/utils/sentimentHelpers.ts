import type { FeedSentiment } from '@/types'

export function sentimentLabelFromScore(score: number): FeedSentiment {
  if (score >= 20) return 'bullish'
  if (score <= -20) return 'bearish'
  return 'neutral'
}

export function sentimentDisplay(sentiment: FeedSentiment): string {
  switch (sentiment) {
    case 'bullish':
      return 'Bullish'
    case 'bearish':
      return 'Bearish'
    default:
      return 'Neutral'
  }
}
