/**
 * Lead capture for the marketing site.
 *
 * Same shape as the survey's api/http.js: a relative base URL by default so the
 * Vite dev proxy keeps the browser same-origin and the backend needs no CORS
 * configuration. See LEADS-BACKEND.md for the contract.
 *
 * `LEADS_ENABLED` gates whether the forms are live. It is off until the
 * endpoint is deployed — a form that posts into a 404 is worse than an honest
 * "not open yet", so the sections fall back to the survey while it is false.
 *
 *   VITE_LEADS_ENABLED=true      once /api/leads/v1 is up
 *   VITE_LEADS_API_BASE_URL=…    for a deployed build on another origin
 */
export const LEADS_ENABLED = import.meta.env.VITE_LEADS_ENABLED === 'true'

const BASE_URL =
  import.meta.env.VITE_LEADS_API_BASE_URL?.replace(/\/$/, '') ?? '/api/leads/v1'

const TIMEOUT_MS = 15000

export class LeadError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'LeadError'
    this.code = code
  }
}

function messageFor(code) {
  switch (code) {
    case 'VALIDATION_FAILED':
      return 'Some of those details need another look.'
    case 'DUPLICATE':
      return "You're already on the list — we'll be in touch."
    case 'RATE_LIMITED':
      return 'That was a lot of attempts. Try again in a few minutes.'
    case 'TIMEOUT':
    case 'NETWORK':
      return "We couldn't reach the server. Check your connection and try again."
    default:
      return 'Something went wrong at our end. Please try again.'
  }
}

/**
 * @param {'counsellor'|'partner'|'student'} kind
 * @param {object} payload  see LEADS-BACKEND.md
 */
export async function submitLead(kind, payload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, ...payload, source: 'web', path: window.location.pathname }),
      signal: controller.signal,
    })
  } catch (err) {
    throw new LeadError(
      err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK',
      messageFor(err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK'),
    )
  } finally {
    clearTimeout(timer)
  }

  if (res.ok) return res.json().catch(() => ({}))

  let code = 'REQUEST_FAILED'
  if (res.status === 409) code = 'DUPLICATE'
  else if (res.status === 422 || res.status === 400) code = 'VALIDATION_FAILED'
  else if (res.status === 429) code = 'RATE_LIMITED'

  const body = await res.json().catch(() => null)
  throw new LeadError(body?.code ?? code, body?.message ?? messageFor(body?.code ?? code))
}
