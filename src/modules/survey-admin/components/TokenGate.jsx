import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import Logo from '../../../components/Logo'
import { decodeJwt, isTokenExpired } from '../../../lib/jwt'

/**
 * There is no admin login endpoint — the API expects an existing LOS admin JWT.
 * So the dashboard asks for one and checks what it can locally (shape, expiry,
 * ADMIN authority) before spending a round trip. The server still decides.
 */
export default function TokenGate({ notice, busy, error, onSubmit }) {
  const [token, setToken] = useState('')
  const [localError, setLocalError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    const trimmed = token.trim().replace(/^Bearer\s+/i, '')

    const claims = decodeJwt(trimmed)
    if (!claims) {
      setLocalError("That doesn't look like a JWT — expected three dot-separated parts.")
      return
    }
    if (isTokenExpired(trimmed)) {
      setLocalError('That token has already expired. Grab a fresh one from LOS.')
      return
    }

    // Advisory: the shape of `authorities` varies by issuer, so a miss here is a
    // warning in the console rather than a block — the API is the real gate.
    const authorities = JSON.stringify(claims.authorities ?? claims.roles ?? claims.scope ?? '')
    if (authorities && !authorities.includes('ADMIN')) {
      console.warn('[survey-admin] token has no ADMIN authority in its claims; the API may reject it')
    }

    setLocalError(null)
    onSubmit(trimmed)
  }

  const shown = localError ?? error?.message

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="h-9 w-auto" />
        </div>

        {notice && (
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            {notice}
          </p>
        )}

        <div className="mb-6 flex items-center gap-2 text-ink/45">
          <KeyRound className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Internal · admin only</span>
        </div>

        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink">
          Survey analytics
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/60">
          Paste an LOS admin token to continue. It needs the <code className="font-mono text-[13px]">ADMIN</code>{' '}
          authority — everything here is read-only.
        </p>

        <form onSubmit={submit} noValidate className="mt-8">
          <label htmlFor="admin-token" className="mb-2 block text-sm font-medium text-ink">
            Admin JWT
          </label>
          <textarea
            id="admin-token"
            rows={4}
            value={token}
            spellCheck={false}
            autoComplete="off"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
            onChange={(e) => {
              setToken(e.target.value)
              setLocalError(null)
            }}
            className={`w-full resize-none rounded-xl border bg-white px-4 py-3 font-mono text-xs leading-relaxed text-ink placeholder:text-ink/25 focus:outline-none ${
              shown ? 'border-red-400 focus:border-red-500' : 'border-ink/15 focus:border-ink'
            }`}
          />
          {shown && <p className="mt-2 text-sm text-red-600">{shown}</p>}

          <button
            type="submit"
            disabled={busy || !token.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-bold text-white transition-all hover:enabled:scale-[1.01] disabled:opacity-35"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Open dashboard
          </button>
        </form>

        <p className="mt-6 text-xs leading-relaxed text-ink/40">
          The token is kept in this browser's local storage so a refresh doesn't sign you out, and is
          cleared on sign-out or when it expires.
        </p>
      </div>
    </div>
  )
}
