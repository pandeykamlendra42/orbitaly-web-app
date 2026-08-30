/**
 * Real survey API client.
 *
 * Talks to the Spring backend mounted at /api/survey/v1 (see http.js for the
 * base URL and the dev proxy). Function names, arguments and resolved shapes
 * are identical to mockSurveyApi.js, so the two are interchangeable — which
 * implementation runs is decided in surveyApi.js.
 */

import { ApiError } from './ApiError'
import { request } from './http'
import { digitsOnly, isValidIndianMobile } from '../lib/validation'

export { isValidEmail, isValidIndianMobile } from '../lib/validation'
export { ApiError } from './ApiError'

/**
 * POST /auth/otp/request
 * `requestId` from the response must be carried into verifyOtp.
 */
export async function requestOtp(mobile, surveyKey) {
  // Cheap local check first: no reason to spend an SMS on a malformed number.
  if (!isValidIndianMobile(mobile)) {
    throw new ApiError('INVALID_MOBILE', 'Enter a valid 10-digit mobile number.')
  }

  return request('/auth/otp/request', {
    method: 'POST',
    body: {
      mobile: digitsOnly(mobile),
      purpose: 'survey',
      surveyId: surveyKey,
    },
  })
}

/** POST /auth/otp/verify — returns { token, mobile, expiresAt, survey, profile } */
export async function verifyOtp(mobile, otp, requestId) {
  return request('/auth/otp/verify', {
    method: 'POST',
    body: {
      mobile: digitsOnly(mobile),
      otp: String(otp).trim(),
      requestId,
    },
  })
}

/** GET /auth/session — the server is the authority on whether a token is live. */
export async function verifySession(token) {
  if (!token) {
    throw new ApiError('UNAUTHENTICATED', 'Please verify your number to continue.')
  }
  const session = await request('/auth/session', { token })

  // A 200 that says `valid: false` is still a dead session.
  if (session?.valid === false) {
    throw new ApiError('SESSION_EXPIRED', 'Your session expired. Please verify your number again.')
  }
  return session
}

/**
 * GET /surveys/:surveyKey — the questionnaire definition.
 *
 * Falls back to the bundled JSON when the server has nothing usable. The whole
 * page is driven by this document, so an unrecognised shape must not be allowed
 * to take the survey down; a definition without `sections` is not one.
 */
export async function fetchSurvey(surveyId, bundledDefinition) {
  try {
    const remote = await request(`/surveys/${encodeURIComponent(surveyId)}`)
    if (Array.isArray(remote?.sections) && remote.sections.length > 0) return remote
    console.warn(
      '[survey] server returned no usable definition for %s — using the bundled questionnaire',
      surveyId,
    )
  } catch (e) {
    console.warn('[survey] could not fetch the definition (%s) — using the bundled one', e.code)
  }

  if (!bundledDefinition) {
    throw new ApiError('SURVEY_NOT_FOUND', 'That survey could not be found.')
  }
  return bundledDefinition
}

/** PUT /surveys/:surveyKey/responses/draft — full document, idempotent. */
export async function saveDraft(draft, token) {
  return request(`/surveys/${encodeURIComponent(draft.surveyId)}/responses/draft`, {
    method: 'PUT',
    token,
    body: draft,
  })
}

/** GET /surveys/:surveyKey/responses/draft — null when there's nothing saved. */
export async function fetchDraft(surveyId, token) {
  const draft = await request(`/surveys/${encodeURIComponent(surveyId)}/responses/draft`, { token })

  // An empty body and an empty object both mean "no draft".
  if (!draft || Object.keys(draft).length === 0) return null
  return draft
}

/** POST /surveys/:surveyKey/responses — the final, immutable response. */
export async function submitSurvey(payload, token) {
  return request(`/surveys/${encodeURIComponent(payload.surveyId)}/responses`, {
    method: 'POST',
    token,
    body: { ...payload, source: 'web' },
  })
}

/**
 * POST /auth/logout — best effort.
 *
 * Used by "Start a new response" on a shared device. A failure here is not
 * worth blocking on: the client drops its own session either way, and the token
 * expires on its own.
 */
export async function endSession({ token } = {}) {
  if (!token) return
  try {
    await request('/auth/logout', { method: 'POST', token })
  } catch {
    /* the local session is cleared regardless */
  }
}
