/**
 * Session storage and JWT expiry.
 *
 * The token is the only thing that survives a reload — answers deliberately do
 * not (see README). Expiry is checked twice: locally from the JWT's own `exp`
 * claim before we bother the network, and again server-side by the verify-token
 * endpoint, which is the only authority. The local check exists to avoid
 * flashing a "verifying" state for a token we can already prove is dead.
 *
 * Nothing here validates the signature — a browser can't, and shouldn't try.
 * The token is a hint about what to render; the server decides what's true.
 */

// JWT reading lives in src/lib/jwt.js — the admin dashboard reads the LOS token
// the same way, and neither module should own the other's copy.
import { isTokenExpired } from '../../../lib/jwt'

export { decodeJwt, isTokenExpired, millisUntilExpiry } from '../../../lib/jwt'

const STORAGE_KEY = 'orbitaly.survey.session'

/**
 * The stored session, or null when there isn't a usable one. An expired or
 * corrupt entry is cleared on the way out, so a dead token never lingers to be
 * retried on the next load.
 */
export function readStoredSession() {
  let raw
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // private mode, or storage disabled — behave as logged out
  }
  if (!raw) return null

  let session
  try {
    session = JSON.parse(raw)
  } catch {
    clearStoredSession()
    return null
  }

  if (!session?.token || isTokenExpired(session.token)) {
    clearStoredSession()
    return null
  }
  return session
}

export function writeStoredSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage is a convenience here, never a correctness requirement: without
    // it the student simply logs in again.
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to do */
  }
}
