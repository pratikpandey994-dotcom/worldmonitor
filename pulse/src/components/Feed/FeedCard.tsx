import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Sparkline } from '@/components/ui/Sparkline'
import type { FeedArticle } from '@/types'
import { formatRelativeTime } from '@/utils/formatters'

export function FeedCard({ article }: { article: FeedArticle }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--border-active)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge sentiment={article.sentimentLabel} />
          <span className="font-[var(--font-data)] text-sm text-[var(--text-secondary)]">
            {article.sentimentScore > 0 ? '+' : ''}
            {article.sentimentScore}
          </span>
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {article.source} • {formatRelativeTime(article.publishedAt)}
        </span>
      </div>

      <a href="#" className="mt-4 block font-[var(--font-editorial)] text-[1.6rem] leading-tight text-[var(--text-primary)] transition-colors hover:text-[var(--accent-blue)]">
        {article.headline}
      </a>

      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {article.tickers.map((ticker) => (
          <span key={ticker} className="border border-[var(--border)] px-2 py-1">
            {ticker}
          </span>
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-primary)]">{article.impactSummary}</p>

      {expanded ? (
        <p className="mt-3 border-l border-[var(--accent-purple)] pl-4 text-sm leading-6 text-[var(--text-secondary)]">
          {article.fullAnalysis}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ChevronDown className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Hide Analysis' : 'Full Analysis'}
        </button>
        <Sparkline data={article.sparkline} />
      </div>
    </article>
  )
}
