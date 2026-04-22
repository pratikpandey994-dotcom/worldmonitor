import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { MobileLayout } from '@/layouts/MobileLayout'
import { LoginPage } from '@/pages/Login'
import { HomePage } from '@/pages/Home'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AddAssetModal } from '@/components/Portfolio/AddAssetModal'
import { useUiStore } from '@/store/uiStore'

function AuthenticatedShell() {
  const { addAssetOpen } = useUiStore()

  return (
    <>
      <div className="block lg:hidden">
        <MobileLayout>
          <HomePage />
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <AppLayout>
          <HomePage />
        </AppLayout>
      </div>
      {addAssetOpen ? <AddAssetModal /> : null}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AuthenticatedShell />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
