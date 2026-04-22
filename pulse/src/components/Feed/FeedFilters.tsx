import { Funnel } from 'lucide-react'

export function FeedFilters() {
  const pillClass =
    'border border-[var(--border)] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-active)] hover:text-[var(--text-primary)]'

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <Funnel className="size-4" />
        Feed
      </div>
      <button type="button" className={pillClass}>Smart</button>
      <button type="button" className={pillClass}>24H</button>
      <button type="button" className={pillClass}>All Assets</button>
      <button type="button" className={pillClass}>All Sentiment</button>
    </div>
  )
}
