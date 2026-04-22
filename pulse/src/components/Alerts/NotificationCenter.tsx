export function NotificationCenter() {
  return (
    <section className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Alerts</p>
      <div className="mt-4 border border-dashed border-[var(--border)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
        Phase 1 keeps alerts as a shell only. Portfolio-triggered notifications land in Phase 5.
      </div>
    </section>
  )
}
