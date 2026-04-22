import clsx from 'clsx'
import type { FeedSentiment } from '@/types'
import { sentimentDisplay } from '@/utils/sentimentHelpers'

export function Badge({ sentiment }: { sentiment: FeedSentiment }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 border px-2 py-1 text-[11px] uppercase tracking-[0.16em]',
        sentiment === 'bullish' && 'border-[color:rgba(0,214,143,0.28)] text-[var(--accent-green)]',
        sentiment === 'bearish' && 'border-[color:rgba(255,77,106,0.28)] text-[var(--accent-red)]',
        sentiment === 'neutral' && 'border-[color:rgba(255,181,71,0.28)] text-[var(--accent-amber)]',
      )}
    >
      {sentiment === 'bullish' ? '●' : sentiment === 'bearish' ? '●' : '○'}
      {sentimentDisplay(sentiment)}
    </span>
  )
}
