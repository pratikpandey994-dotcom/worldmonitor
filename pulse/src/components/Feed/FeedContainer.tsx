import { FeedCard } from './FeedCard'
import { FeedCardSkeleton } from './FeedCardSkeleton'
import { FeedFilters } from './FeedFilters'
import { useFeed } from '@/hooks/useFeed'

export function FeedContainer() {
  const { data, isLoading } = useFeed()

  return (
    <section className="flex min-h-[60vh] flex-col gap-5">
      <header className="border-b border-[var(--border)] pb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">AI Feed</p>
        <h1 className="mt-2 font-[var(--font-editorial)] text-4xl leading-none text-[var(--text-primary)]">
          Your portfolio, thinking for you.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Pulse ranks every headline by how much it matters to the assets you actually own.
        </p>
      </header>

      <FeedFilters />

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => <FeedCardSkeleton key={index} />)
          : data?.map((article) => <FeedCard key={article.id} article={article} />)}
      </div>
    </section>
  )
}
