import { ECONOMIC_EVENTS } from '@/utils/demoData'

export function EconomicCalendar() {
  return (
    <section className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Economic Calendar</p>
      <div className="mt-4 grid gap-3">
        {ECONOMIC_EVENTS.map((event) => (
          <div key={event.id} className="border border-[var(--border)] bg-[var(--bg-base)] p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{event.impact} impact</p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">{event.title}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{event.dateLabel}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
