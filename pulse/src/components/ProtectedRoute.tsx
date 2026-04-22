import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg-base)]">
        <div className="border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-4 text-sm text-[var(--text-secondary)]">
          Loading Pulse…
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
