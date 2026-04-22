import { FeedContainer } from '@/components/Feed/FeedContainer'
import { AssetList } from '@/components/Portfolio/AssetList'
import { EconomicCalendar } from '@/components/Market/EconomicCalendar'
import { IndicesPanel } from '@/components/Market/IndicesPanel'
import { NotificationCenter } from '@/components/Alerts/NotificationCenter'
import { useUiStore } from '@/store/uiStore'

export function HomePage() {
  const { mobileTab } = useUiStore()

  if (mobileTab === 'portfolio') return <AssetList />
  if (mobileTab === 'markets') {
    return (
      <div className="grid gap-4">
        <IndicesPanel />
        <EconomicCalendar />
      </div>
    )
  }
  if (mobileTab === 'alerts') return <NotificationCenter />
  if (mobileTab === 'profile') {
    return (
      <section className="border border-[var(--border)] bg-[var(--bg-surface)] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Profile</p>
        <h1 className="mt-2 font-[var(--font-editorial)] text-3xl text-[var(--text-primary)]">Pulse Settings</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          Profile, alerting, and display preferences expand in later phases. Phase 1 keeps the shell in place.
        </p>
      </section>
    )
  }

  return <FeedContainer />
}
