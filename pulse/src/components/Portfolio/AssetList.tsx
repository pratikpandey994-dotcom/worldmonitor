import { Plus } from 'lucide-react'
import { AssetListItem } from './AssetListItem'
import { PortfolioValue } from './PortfolioValue'
import { Button } from '@/components/ui/Button'
import { usePortfolio } from '@/hooks/usePortfolio'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useUiStore } from '@/store/uiStore'

export function AssetList() {
  const { assets, watchlist, quotes, removeAsset, isLoading } = usePortfolio()
  const { activeView, setActiveView } = usePortfolioStore()
  const { toggleAddAsset } = useUiStore()

  const items = activeView === 'portfolio' ? assets : watchlist

  return (
    <section className="flex flex-col gap-4">
      <PortfolioValue />

      <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveView('portfolio')}
              className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] ${activeView === 'portfolio' ? 'border-[var(--accent-blue)] text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
            >
              Portfolio
            </button>
            <button
              type="button"
              onClick={() => setActiveView('watchlist')}
              className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] ${activeView === 'watchlist' ? 'border-[var(--accent-blue)] text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
            >
              Watchlist
            </button>
          </div>
          <Button variant="secondary" onClick={() => toggleAddAsset(true)}>
            <Plus className="size-4" />
            Add Asset
          </Button>
        </div>

        <div className="mt-4 grid gap-3">
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-24 animate-pulse border border-[var(--border)] bg-[var(--bg-elevated)]" />
            ))
          ) : items.length > 0 ? (
            items.map((asset) => (
              <AssetListItem
                key={asset.ticker}
                asset={asset}
                quote={'quantity' in asset ? quotes[asset.ticker] : undefined}
                onRemove={removeAsset}
              />
            ))
          ) : (
            <div className="border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-secondary)]">
              No assets here yet. Add your first position to activate the feed.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
