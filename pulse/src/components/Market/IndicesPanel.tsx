import { MARKET_INDICES } from '@/utils/demoData'
import { formatPercent } from '@/utils/formatters'

export function IndicesPanel() {
  return (
    <section className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Market Pulse</p>
      <div className="mt-4 grid gap-3">
        {MARKET_INDICES.map((index) => (
          <div key={index.symbol} className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
            <div>
              <p className="font-[var(--font-data)] text-sm text-[var(--text-primary)]">{index.symbol}</p>
              <p className="text-sm text-[var(--text-secondary)]">{index.label}</p>
            </div>
            <div className="text-right">
              <p className="font-[var(--font-data)] text-sm text-[var(--text-primary)]">{index.value}</p>
              <p className={index.changePercent >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
                {formatPercent(index.changePercent)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
