import { create } from 'zustand'
import type { PortfolioView } from '@/types'

interface PortfolioState {
  activeView: PortfolioView
  selectedTicker: string | null
  setActiveView: (view: PortfolioView) => void
  setSelectedTicker: (ticker: string | null) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeView: 'portfolio',
  selectedTicker: null,
  setActiveView: (view) => set({ activeView: view }),
  setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
}))
