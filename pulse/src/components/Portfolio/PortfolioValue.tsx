import { usePortfolio } from '@/hooks/usePortfolio'
import { formatPrice, sentimentTone } from '@/utils/formatters'

export function PortfolioValue() {
  const { overview } = usePortfolio()
  const tone = sentimentTone(overview.pnl)

  return (
    <section className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Portfolio Overview</p>
      <div className="mt-4">
        {overview.hasCostBasis ? (
          <>
            <div className="font-[var(--font-data)] text-3xl text-[var(--text-primary)]">
              {formatPrice(overview.totalValue, 'INR')}
            </div>
            <p className={`mt-2 text-sm ${tone === 'positive' ? 'text-[var(--accent-green)]' : tone === 'negative' ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'}`}>
              {overview.pnl >= 0 ? '+' : ''}
              {formatPrice(overview.pnl, 'INR')} total P&amp;L
            </p>
          </>
        ) : (
          <div className="font-[var(--font-data)] text-3xl text-[var(--text-primary)]">{overview.assetCount}</div>
        )}
      </div>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        {overview.assetCount} live positions monitored across your owned assets.
      </p>
    </section>
  )
}
