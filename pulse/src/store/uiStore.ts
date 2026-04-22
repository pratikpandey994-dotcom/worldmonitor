import { create } from 'zustand'
import type { MobileTab } from '@/types'

interface UiState {
  addAssetOpen: boolean
  mobileTab: MobileTab
  toggleAddAsset: (open?: boolean) => void
  setMobileTab: (tab: MobileTab) => void
}

export const useUiStore = create<UiState>((set) => ({
  addAssetOpen: false,
  mobileTab: 'feed',
  toggleAddAsset: (open) => set((state) => ({ addAssetOpen: open ?? !state.addAssetOpen })),
  setMobileTab: (tab) => set({ mobileTab: tab }),
}))
