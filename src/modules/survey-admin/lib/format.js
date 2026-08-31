/**
 * Formatting helpers. The date ones matter more than they look — see the note
 * on `dayLabel`.
 */

const numberFormat = new Intl.NumberFormat('en-IN')

export const formatCount = (n) => (typeof n === 'number' ? numberFormat.format(n) : '—')

/** One decimal, but only when there is one. 43.39% stays, 100.0% becomes 100%. */
export function formatPercent(value, { digits = 1 } = {}) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  const rounded = Number(value.toFixed(digits))
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(digits)}%`
}

export function formatDecimal(value, digits = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  return value.toFixed(digits)
}

/** 623.4s → "10m 23s". Durations here are respondent time-on-survey. */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '—'
  const whole = Math.round(seconds)
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return minutes > 0 ? `${minutes}m ${String(rest).padStart(2, '0')}s` : `${rest}s`
}

/**
 * Day-bucket label for `summary.dailyVolume[].day`.
 *
 * The API truncates to a day boundary in the DB session timezone and then
 * serialises as UTC, so on an IST server a bucket arrives as `18:30:00Z` — the
 * *previous* calendar day in UTC terms. Printing the raw string, or slicing the
 * first ten characters off it, shifts every bar back a day.
 *
 * Formatting the parsed instant in the viewer's local timezone lands on the
 * right day for anyone in IST, which is everyone reading this dashboard.
 */
export function dayLabel(iso, { withYear = false } = {}) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

/** Same reasoning as dayLabel: parse the instant, render it locally. */
export function dateTimeLabel(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function relativeTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/**
 * PII masking. Mobile and email are shown masked by default; the UI offers a
 * per-row reveal so nobody scrolls a screen-share full of student numbers.
 */
export function maskMobile(mobile) {
  if (!mobile) return '—'
  const digits = String(mobile).replace(/\D/g, '')
  if (digits.length < 4) return '••••'
  return `${String(mobile).startsWith('+') ? '+' : ''}${'•'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`
}

export function maskEmail(email) {
  if (!email) return '—'
  const [user, domain] = String(email).split('@')
  if (!domain) return '••••'
  const head = user.slice(0, 1)
  return `${head}${'•'.repeat(Math.max(1, user.length - 1))}@${domain}`
}
