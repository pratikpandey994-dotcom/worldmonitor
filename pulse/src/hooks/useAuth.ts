import { useAuthContext } from '@/services/auth-context'

export function useAuth() {
  return useAuthContext()
}
