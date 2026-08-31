/**
 * JWT reading — payload and expiry only.
 *
 * Nothing here validates a signature: a browser can't, and shouldn't try. A
 * token is a hint about what to render; the server decides what is true. Shared
 * by the survey module (respondent session) and the admin module (LOS token).
 */

/** Treat a token as expired slightly early so one doesn't die mid-request. */
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
