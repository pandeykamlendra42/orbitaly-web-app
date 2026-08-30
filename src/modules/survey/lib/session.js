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

const STORAGE_KEY = 'orbitaly.survey.session'

/**
 * Treat a token as expired slightly early, so one that dies mid-flight doesn't
 * come back as a confusing 401 on submit.
 */
const CLOCK_SKEW_SECONDS = 30

function base64UrlDecode(segment) {
  const padded = segment.padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
}

/** Returns the JWT payload, or null if the token is missing or malformed. */
export function decodeJwt(token) {
  if (typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }
}

/** Milliseconds until the token expires; 0 once it has (or if it's unreadable). */
export function millisUntilExpiry(token) {
  const exp = decodeJwt(token)?.exp
  if (typeof exp !== 'number') return 0
  return Math.max(0, exp * 1000 - CLOCK_SKEW_SECONDS * 1000 - Date.now())
}

export function isTokenExpired(token) {
  return millisUntilExpiry(token) <= 0
}

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
