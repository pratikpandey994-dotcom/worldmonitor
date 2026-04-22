export function FeedCardSkeleton() {
  return (
    <article className="grid gap-4 border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4">
      <div className="h-4 w-40 animate-pulse bg-[var(--bg-elevated)]" />
      <div className="h-8 w-4/5 animate-pulse bg-[var(--bg-elevated)]" />
      <div className="h-4 w-full animate-pulse bg-[var(--bg-elevated)]" />
      <div className="h-4 w-3/4 animate-pulse bg-[var(--bg-elevated)]" />
    </article>
  )
}
