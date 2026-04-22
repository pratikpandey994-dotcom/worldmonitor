import type { PropsWithChildren } from 'react'
import { Bell, Command, Search, UserRound } from 'lucide-react'
import { AssetList } from '@/components/Portfolio/AssetList'
import { EconomicCalendar } from '@/components/Market/EconomicCalendar'
import { IndicesPanel } from '@/components/Market/IndicesPanel'
import { NotificationCenter } from '@/components/Alerts/NotificationCenter'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function AppLayout({ children }: PropsWithChildren) {
  const { user, isGuest, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[rgba(8,10,15,0.94)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="grid gap-1">
            <p className="font-[var(--font-data)] text-xs uppercase tracking-[0.28em] text-[var(--accent-blue)]">Pulse</p>
            <p className="text-xs text-[var(--text-secondary)]">Your portfolio, thinking for you.</p>
          </div>

          <div className="hidden min-w-[320px] flex-1 items-center justify-center md:flex">
            <button
              type="button"
              className="flex w-full max-w-xl items-center justify-between border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-secondary)]"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="size-4" />
                Search assets, feeds, insights
              </span>
              <span className="inline-flex items-center gap-1 border border-[var(--border)] px-2 py-1 text-[10px] uppercase tracking-[0.16em]">
                <Command className="size-3" />
                K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative border border-[var(--border)] p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 h-2 w-2 bg-[var(--accent-red)]" />
            </button>
            <div className="hidden border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-secondary)] md:block">
              {isGuest ? 'Guest Mode' : user?.displayName}
            </div>
            <button type="button" className="border border-[var(--border)] p-3 text-[var(--text-secondary)]">
              <UserRound className="size-4" />
            </button>
            <Button variant="ghost" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[300px,minmax(0,1fr),320px] lg:px-6">
        <aside className="hidden lg:block">
          <AssetList />
        </aside>
        <main>{children}</main>
        <aside className="hidden lg:flex lg:flex-col lg:gap-4">
          <IndicesPanel />
          <EconomicCalendar />
          <NotificationCenter />
        </aside>
      </div>
    </div>
  )
}
