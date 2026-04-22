import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function LoginPage() {
  const { continueAsGuest, signIn, signInWithGoogle, signInWithMagicLink, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleAuthSubmit(): Promise<void> {
    setError(null)
    setMessage(null)
    try {
      if (mode === 'signin') {
        await signIn({ email, password })
      } else {
        await signUp({ email, password })
        setMessage('Account created. Check your inbox if email confirmation is enabled.')
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Authentication failed.')
    }
  }

  async function handleMagicLink(): Promise<void> {
    setError(null)
    setMessage(null)
    try {
      await signInWithMagicLink(email)
      setMessage('Magic link sent. Check your email to continue.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not send magic link.')
    }
  }

  async function handleGoogle(): Promise<void> {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Google sign-in failed.')
    }
  }

  return (
    <div className="grid min-h-screen bg-[var(--bg-base)] lg:grid-cols-[1.05fr,0.95fr]">
      <section className="flex flex-col justify-between border-b border-[var(--border)] p-6 md:p-10 lg:border-b-0 lg:border-r">
        <div>
          <p className="font-[var(--font-data)] text-xs uppercase tracking-[0.3em] text-[var(--accent-blue)]">Pulse</p>
          <h1 className="mt-4 max-w-xl font-[var(--font-editorial)] text-5xl leading-none text-[var(--text-primary)] md:text-6xl">
            Your portfolio, thinking for you.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            A personalized financial intelligence terminal for investors tracking equities, crypto, forex, and commodities across one focused workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:max-w-xl md:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Portfolio-first</p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Every headline and signal is filtered through what you own, not through a generic market lens.
            </p>
          </div>
          <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Phase 1</p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Auth, portfolio CRUD, responsive shell, and a static intelligence feed are live in this foundation build.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md border border-[var(--border)] bg-[var(--bg-surface)] p-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] ${mode === 'signin' ? 'border-[var(--accent-blue)] text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] ${mode === 'signup' ? 'border-[var(--accent-blue)] text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm normal-case tracking-normal text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm normal-case tracking-normal text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
                placeholder="••••••••"
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-[var(--accent-red)]">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-[var(--accent-green)]">{message}</p> : null}

          <div className="mt-6 grid gap-3">
            <Button onClick={() => void handleAuthSubmit()}>
              {mode === 'signin' ? 'Continue to Pulse' : 'Create Pulse Account'}
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="secondary" onClick={() => void handleGoogle()}>
              Continue with Google
            </Button>
            <Button variant="secondary" onClick={() => void handleMagicLink()} disabled={!email}>
              Email me a magic link
            </Button>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              No account yet or no Supabase credentials configured locally? Explore Pulse with a demo portfolio.
            </p>
            <Button variant="ghost" className="mt-3 px-0" onClick={continueAsGuest}>
              Explore demo mode
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
