import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useUiStore } from '@/store/uiStore'
import type { AssetSuggestion } from '@/types'
import { ASSET_SUGGESTIONS } from '@/utils/demoData'

export function AddAssetModal() {
  const { addAsset, isAdding } = usePortfolio()
  const { addAssetOpen, toggleAddAsset } = useUiStore()
  const [query, setQuery] = useState('')
  const [quantity, setQuantity] = useState('')
  const [avgBuyPrice, setAvgBuyPrice] = useState('')
  const [selected, setSelected] = useState<AssetSuggestion | null>(null)

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return ASSET_SUGGESTIONS
    return ASSET_SUGGESTIONS.filter((asset) =>
      asset.ticker.toLowerCase().includes(normalized) || asset.assetName.toLowerCase().includes(normalized),
    )
  }, [query])

  if (!addAssetOpen) return null

  async function handleSubmit(): Promise<void> {
    if (!selected) return
    await addAsset({
      ticker: selected.ticker,
      assetName: selected.assetName,
      assetType: selected.assetType,
      exchange: selected.exchange,
      quantity: quantity ? Number(quantity) : null,
      avgBuyPrice: avgBuyPrice ? Number(avgBuyPrice) : null,
      currency: selected.currency,
    })
    setQuery('')
    setQuantity('')
    setAvgBuyPrice('')
    setSelected(null)
    toggleAddAsset(false)
  }

  return (
    <Modal title="Add Asset" onClose={() => toggleAddAsset(false)}>
      <div className="grid gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Search assets</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="RELIANCE.NS, BTC, USDINR, GOLD"
            className="mt-2 w-full border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
          />
        </div>

        <div className="grid max-h-60 gap-2 overflow-y-auto border border-[var(--border)] p-3">
          {suggestions.map((asset) => {
            const active = selected?.ticker === asset.ticker
            return (
              <button
                type="button"
                key={asset.ticker}
                onClick={() => setSelected(asset)}
                className={`grid gap-1 border px-4 py-3 text-left transition-colors ${active ? 'border-[var(--accent-blue)] bg-[var(--bg-base)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-active)]'}`}
              >
                <span className="font-[var(--font-data)] text-sm text-[var(--text-primary)]">{asset.ticker}</span>
                <span className="text-sm text-[var(--text-secondary)]">{asset.assetName}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {asset.assetType} {asset.exchange ? `• ${asset.exchange}` : ''}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Quantity</label>
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Avg buy price</label>
            <input
              value={avgBuyPrice}
              onChange={(event) => setAvgBuyPrice(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <div className="text-sm text-[var(--text-secondary)]">Quick add: RELIANCE.NS • TCS.NS • BTC • NIFTY 50</div>
          <Button onClick={() => void handleSubmit()} disabled={!selected || isAdding}>
            {isAdding ? 'Adding…' : 'Add to Portfolio'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
