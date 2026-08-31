/**
 * Survey admin API client.
 *
 * Base path /api/survey/v1/admin. Every endpoint is a read-only GET requiring
 * `Authorization: Bearer <LOS admin JWT>` with the ADMIN authority.
 *
 * Kept independent of the respondent-facing survey module: the two share
 * src/lib/jwt.js and nothing else, so either can move without the other.
 */

export const ADMIN_BASE_URL =
  import.meta.env.VITE_SURVEY_ADMIN_API_BASE_URL?.replace(/\/$/, '') ?? '/api/survey/v1/admin'

const TIMEOUT_MS = 30000 // the CSV export streams; give it room

export class AdminApiError extends Error {
  constructor(code, message, status) {
    super(message)
    this.name = 'AdminApiError'
    this.code = code
    this.status = status
  }
}

/** True for the codes that mean "this token can't be used" — sends us to the gate. */
export function isAuthError(error) {
  return error?.code === 'UNAUTHENTICATED' || error?.code === 'FORBIDDEN'
}

const STATUS_CODE = {
  400: 'VALIDATION_FAILED',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  410: 'SURVEY_CLOSED',
}

const FALLBACK_MESSAGE = {
  VALIDATION_FAILED: 'That combination of questions is not supported.',
  UNAUTHENTICATED: 'Your admin session has expired. Paste a fresh token to continue.',
  FORBIDDEN: 'That token is valid but lacks the ADMIN authority.',
  NOT_FOUND: 'Not found.',
  SURVEY_CLOSED: 'This survey has no published version.',
  NETWORK_ERROR: "Couldn't reach the API. Check your connection or the proxy target.",
  SERVER_ERROR: 'The API failed on that request. Try again shortly.',
  REQUEST_FAILED: 'That request failed.',
}

function buildUrl(path, params) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  }
  const suffix = query.toString()
  return `${ADMIN_BASE_URL}${path}${suffix ? `?${suffix}` : ''}`
}

async function get(path, { token, params, raw = false } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(buildUrl(path, params), {
      headers: {
        Accept: raw ? 'text/csv' : 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    })
  } catch {
    throw new AdminApiError('NETWORK_ERROR', FALLBACK_MESSAGE.NETWORK_ERROR)
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    // Documented error body is { code, message }; fall back to the status when
    // something upstream (a proxy, a gateway) answers instead of the API.
    let body = null
    try {
      body = JSON.parse(await response.text())
    } catch {
      /* not JSON */
    }
    const code =
      body?.code ?? STATUS_CODE[response.status] ?? (response.status >= 500 ? 'SERVER_ERROR' : 'REQUEST_FAILED')
    throw new AdminApiError(
      code,
      body?.message ?? FALLBACK_MESSAGE[code] ?? FALLBACK_MESSAGE.REQUEST_FAILED,
      response.status,
    )
  }

  if (raw) return response
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

/* ---------------------------------------------------------------- *
 * Endpoints
 * ---------------------------------------------------------------- */

/** 1 — every survey, with its version history. */
export const fetchSurveys = (token) => get('/surveys', { token })

/** 2 — headline numbers + daily volume. */
export const fetchSummary = (surveyKey, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/summary`, { token })

/** 3 — funnel stages + section retention. `from`/`to` are optional ISO strings. */
export const fetchFunnel = (surveyKey, { from, to } = {}, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/funnel`, { token, params: { from, to } })

/** 4 — one question's breakdown. Returns `options` OR `numeric`, never both. */
export const fetchQuestionStats = (surveyKey, questionKey, token) =>
  get(
    `/surveys/${encodeURIComponent(surveyKey)}/questions/${encodeURIComponent(questionKey)}/stats`,
    { token },
  )

/** 5 — cross-tab. Choice questions only; a scale/text pair returns VALIDATION_FAILED. */
export const fetchCrosstab = (surveyKey, rowQuestion, columnQuestion, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/crosstab`, {
    token,
    params: { rowQuestion, columnQuestion },
  })

/** 6 — paged respondent list. `page` is 0-indexed; `size` is clamped to 200 server-side. */
export const fetchResponses = (surveyKey, { page = 0, size = 50 } = {}, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/responses`, { token, params: { page, size } })

/** 7 — one respondent's full answer sheet. */
export const fetchResponseDetail = (surveyKey, submissionId, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/responses/${encodeURIComponent(submissionId)}`, {
    token,
  })

/** 9 — OTP abuse. NOTE: the API ignores surveyKey here; results are global. */
export const fetchAbuse = (surveyKey, { hours = 24, minRequests = 3, limit = 50 } = {}, token) =>
  get(`/surveys/${encodeURIComponent(surveyKey)}/abuse`, {
    token,
    params: { hours, minRequests, limit },
  })

/**
 * 8 — CSV export.
 *
 * The endpoint needs an Authorization header, so a plain <a download> can't
 * fetch it. Pull it as a blob and hand that to a synthetic link instead.
 */
export async function downloadResponsesCsv(surveyKey, token) {
  const response = await get(`/surveys/${encodeURIComponent(surveyKey)}/responses.csv`, {
    token,
    raw: true,
  })

  const disposition = response.headers.get('Content-Disposition') ?? ''
  const named = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)?.[1]
  const filename = named ?? `${surveyKey}-responses-${new Date().toISOString().slice(0, 10)}.csv`

  const url = URL.createObjectURL(await response.blob())
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = decodeURIComponent(filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    // Revoking immediately can race the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  return filename
}
