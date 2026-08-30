import { ApiError } from './ApiError'

/**
 * Base URL for the survey API.
 *
 * Defaults to a relative path so the Vite dev proxy (see vite.config.js) can
 * forward it to the backend on :8080 — that keeps the browser same-origin and
 * sidesteps CORS entirely in development. Override for a deployed environment:
 *
 *   VITE_SURVEY_API_BASE_URL=https://api.orbitaly.example/api/survey/v1
 */
export const API_BASE_URL =
  import.meta.env.VITE_SURVEY_API_BASE_URL?.replace(/\/$/, '') ?? '/api/survey/v1'

/** How long any single call may take before we treat it as unreachable. */
const TIMEOUT_MS = 15000

function parseJson(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * Map an HTTP status to one of our codes. Only used when the server does not
 * name a code itself — its own code always wins, since it knows more than the
 * status line does (a 400 might be INVALID_OTP or VALIDATION_FAILED).
 */
function codeForStatus(status) {
  if (status === 401) return 'SESSION_EXPIRED'
  if (status === 403) return 'UNAUTHENTICATED'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'DUPLICATE_SUBMISSION'
  if (status === 429) return 'RATE_LIMITED'
  if (status >= 500) return 'SERVER_ERROR'
  return 'REQUEST_FAILED'
}

const FALLBACK_MESSAGE = {
  SESSION_EXPIRED: 'Your session expired. Please verify your number again.',
  UNAUTHENTICATED: 'Please verify your number to continue.',
  NOT_FOUND: 'That survey could not be found.',
  DUPLICATE_SUBMISSION: 'You have already completed this survey.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',
  SERVER_ERROR: 'Something went wrong on our side. Please try again.',
  REQUEST_FAILED: 'Something went wrong. Please try again.',
  NETWORK_ERROR: "We couldn't reach the server. Check your connection and try again.",
}

/**
 * Backends disagree about where the error code lives, and this one's OpenAPI
 * only declares "Bad Request" — so read the usual suspects rather than betting
 * on one. If none is present we fall back to the status mapping.
 */
function codeFromBody(body, status) {
  const named = body?.code ?? body?.errorCode ?? body?.error_code ?? body?.error
  return typeof named === 'string' && named ? named : codeForStatus(status)
}

export async function request(path, { method = 'GET', body, token } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch {
    // Offline, DNS failure, CORS rejection, or our own timeout — from the
    // student's point of view these are all "it didn't reach the server".
    throw new ApiError('NETWORK_ERROR', FALLBACK_MESSAGE.NETWORK_ERROR)
  } finally {
    clearTimeout(timer)
  }

  const payload = parseJson(await response.text())

  if (!response.ok) {
    const code = codeFromBody(payload, response.status)
    const message = payload?.message ?? FALLBACK_MESSAGE[code] ?? FALLBACK_MESSAGE.REQUEST_FAILED
    throw new ApiError(code, message, payload?.details ?? payload)
  }

  return payload
}
