import type { PropsWithChildren } from 'react'
import { Bell, BriefcaseBusiness, ChartNoAxesColumn, Home, UserRound } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import type { MobileTab } from '@/types'

const tabs: Array<{ id: MobileTab; label: string; icon: typeof Home }> = [
  { id: 'feed', label: 'Feed', icon: Home },
  { id: 'portfolio', label: 'Portfolio', icon: BriefcaseBusiness },
  { id: 'markets', label: 'Markets', icon: ChartNoAxesColumn },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

export function MobileLayout({ children }: PropsWithChildren) {
  const { mobileTab, setMobileTab } = useUiStore()

  return (
    <div className="min-h-screen pb-20">
      <main className="px-4 pb-6 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[rgba(8,10,15,0.96)] backdrop-blur-sm">
        <div className="mx-auto grid max-w-screen-sm grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = mobileTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-2 py-3 text-[10px] uppercase tracking-[0.14em] ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
