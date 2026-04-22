import clsx from 'clsx'
import { Button } from '@/components/ui/Button'
import type { PriceQuote } from '@/types'
import { formatPercent, formatPrice } from '@/utils/formatters'

interface AssetListEntry {
  ticker: string
  assetName: string
}

interface AssetListItemProps {
  asset: AssetListEntry
  quote?: PriceQuote
  onRemove: (ticker: string) => void
}

export function AssetListItem({ asset, quote, onRemove }: AssetListItemProps) {
  const toneClass = clsx(
    quote?.changePercent && quote.changePercent > 0 && 'text-[var(--accent-green)]',
    quote?.changePercent && quote.changePercent < 0 && 'text-[var(--accent-red)]',
    (!quote || quote.changePercent === 0) && 'text-[var(--text-secondary)]',
  )

  return (
    <article className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-data)] text-sm uppercase tracking-[0.12em] text-[var(--text-primary)]">
              {asset.ticker}
            </span>
            {quote ? <span className="text-xs text-[var(--text-secondary)]">● {quote.unreadNewsCount} news</span> : null}
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{asset.assetName}</p>
        </div>
        <Button variant="ghost" className="px-0 py-0 text-xs uppercase tracking-[0.12em]" onClick={() => onRemove(asset.ticker)}>
          Remove
        </Button>
      </div>

      {quote ? (
        <div className="mt-4 flex items-end justify-between gap-3">
          <span className="font-[var(--font-data)] text-lg text-[var(--text-primary)]">
            {formatPrice(quote.currentPrice, quote.currency)}
          </span>
          <span className={clsx('font-[var(--font-data)] text-sm', toneClass)}>{formatPercent(quote.changePercent)}</span>
        </div>
      ) : (
        <div className="mt-4 h-6 animate-pulse bg-[var(--bg-elevated)]" />
      )}
    </article>
  )
}
