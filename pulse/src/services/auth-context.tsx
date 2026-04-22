import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import type { AuthCredentials, AuthState, UserProfile } from '@/types'
import { hasSupabaseEnv, supabase } from './supabase'

const GUEST_SESSION_KEY = 'pulse-guest-session'

interface AuthContextValue extends AuthState {
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: AuthCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  continueAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function profileFromSession(session: Session): UserProfile {
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    displayName:
      session.user.user_metadata?.display_name
      ?? session.user.user_metadata?.full_name
      ?? session.user.email?.split('@')[0]
      ?? 'Pulse User',
    avatarUrl: session.user.user_metadata?.avatar_url ?? null,
    subscriptionTier: 'free',
  }
}

function readGuestSession(): UserProfile | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(GUEST_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function persistGuestSession(profile: UserProfile | null): void {
  if (typeof window === 'undefined') return
  if (!profile) {
    window.localStorage.removeItem(GUEST_SESSION_KEY)
    return
  }
  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(profile))
}

export function AuthProvider({ children }: PropsWithChildren) {
  const guest = readGuestSession()
  const [state, setState] = useState<AuthState>({
    status: hasSupabaseEnv ? 'loading' : guest ? 'authenticated' : 'unauthenticated',
    user: guest,
    isGuest: Boolean(guest),
  })

  useEffect(() => {
    if (!supabase) {
      const localGuest = readGuestSession()
      setState({
        status: localGuest ? 'authenticated' : 'unauthenticated',
        user: localGuest,
        isGuest: Boolean(localGuest),
      })
      return
    }

    let mounted = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) {
        setState({ status: 'authenticated', user: profileFromSession(data.session), isGuest: false })
        return
      }
      const localGuest = readGuestSession()
      setState({
        status: localGuest ? 'authenticated' : 'unauthenticated',
        user: localGuest,
        isGuest: Boolean(localGuest),
      })
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        persistGuestSession(null)
        setState({ status: 'authenticated', user: profileFromSession(session), isGuest: false })
        return
      }
      const localGuest = readGuestSession()
      setState({
        status: localGuest ? 'authenticated' : 'unauthenticated',
        user: localGuest,
        isGuest: Boolean(localGuest),
      })
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    if (!supabase) throw new Error('Supabase credentials are not configured for this environment.')
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
  }, [])

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    if (!supabase) throw new Error('Supabase credentials are not configured for this environment.')
    const { error } = await supabase.auth.signUp(credentials)
    if (error) throw error
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase credentials are not configured for this environment.')
    const redirectTo = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT || window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) throw error
  }, [])

  const signInWithMagicLink = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Supabase credentials are not configured for this environment.')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const continueAsGuest = useCallback(() => {
    const guestProfile: UserProfile = {
      id: 'guest-user',
      email: null,
      displayName: 'Guest Investor',
      subscriptionTier: 'free',
    }
    persistGuestSession(guestProfile)
    setState({ status: 'authenticated', user: guestProfile, isGuest: true })
  }, [])

  const signOut = useCallback(async () => {
    persistGuestSession(null)
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
    setState({ status: 'unauthenticated', user: null, isGuest: false })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMagicLink,
    continueAsGuest,
    signOut,
  }), [continueAsGuest, signIn, signInWithGoogle, signInWithMagicLink, signOut, signUp, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuthContext must be used within AuthProvider')
  return value
}
