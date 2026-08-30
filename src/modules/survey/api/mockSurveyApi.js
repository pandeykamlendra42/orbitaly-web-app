/**
 * Mock survey backend.
 *
 * Every function here stands in for an HTTP endpoint that does not exist yet.
 * The signatures and the resolved/rejected shapes are the contract — swapping
 * in the real API should mean replacing the bodies and nothing else.
 *
 * See BACKEND.md in this module for the endpoints these stand for.
 */

import { decodeJwt, isTokenExpired } from '../lib/session'
import { ApiError } from './ApiError'
import { isValidIndianMobile } from '../lib/validation'

export { ApiError } from './ApiError'
export { isValidEmail, isValidIndianMobile } from '../lib/validation'

/** Any OTP other than this is rejected, so the failure path is demoable. */
export const MOCK_OTP = '123456'

/** Token lifetime. Long enough to finish a 10-minute survey with room to spare. */
export const SESSION_TTL_MINUTES = 30

const OTP_TTL_SECONDS = 60
const RESEND_COOLDOWN_SECONDS = 30

const latency = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/* ------------------------------------------------------------------ *
 * Mock persistence
 *
 * Stands in for the server's responses table. It lives in localStorage
 * purely so "has this mobile already submitted?" survives a reload and can
 * be demoed on one machine — the real lookup is a server-side query keyed
 * on the mobile in the token, and must NOT be trusted to the client.
 * ------------------------------------------------------------------ */

const SUBMISSIONS_KEY = 'orbitaly.mock.submissions'
const DRAFTS_KEY = 'orbitaly.mock.drafts'

function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? {}
  } catch {
    return {}
  }
}

function writeStore(key, all) {
  try {
    localStorage.setItem(key, JSON.stringify(all))
  } catch {
    /* mock-only bookkeeping; failing to persist just means no dedupe */
  }
}

const readSubmissions = () => readStore(SUBMISSIONS_KEY)
const writeSubmissions = (all) => writeStore(SUBMISSIONS_KEY, all)
const readDrafts = () => readStore(DRAFTS_KEY)
const writeDrafts = (all) => writeStore(DRAFTS_KEY, all)

/** The submission-status block returned by both verifyOtp and verifySession. */
function submissionStatus(mobile) {
  const record = readSubmissions()[mobile]
  return record
    ? { hasSubmitted: true, submissionId: record.submissionId, submittedAt: record.submittedAt }
    : { hasSubmitted: false }
}

/**
 * Builds a structurally real JWT: base64url header, payload with `sub`/`iat`/
 * `exp`, and a placeholder signature. Unsigned — the point is that the client's
 * expiry check exercises the same code path it will against real tokens.
 *
 * Only the mobile goes in the payload. Keeping it ASCII sidesteps btoa's
 * unicode limitation, and there's no reason to put an email address in a token.
 */
function issueMockJwt(mobile) {
  const base64Url = (obj) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const nowSeconds = Math.floor(Date.now() / 1000)
  const header = base64Url({ alg: 'none', typ: 'JWT' })
  const payload = base64Url({
    sub: mobile,
    surveyId: 'student-survey-v1',
    iat: nowSeconds,
    exp: nowSeconds + SESSION_TTL_MINUTES * 60,
  })
  return `${header}.${payload}.mock-signature-not-verified`
}

/** Shared guard for endpoints that require a live token. */
function requireSession(token) {
  if (!token) {
    throw new ApiError('UNAUTHENTICATED', 'Please verify your number to continue.')
  }
  const payload = decodeJwt(token)
  if (!payload?.sub) {
    throw new ApiError('INVALID_TOKEN', 'Please verify your number again.')
  }
  if (isTokenExpired(token)) {
    throw new ApiError('SESSION_EXPIRED', 'Your session expired. Please verify your number again.')
  }
  return payload
}

/* ------------------------------------------------------------------ *
 * Endpoints
 * ------------------------------------------------------------------ */

/**
 * POST /auth/otp/request
 * Sends an OTP to the mobile number. Mock: always succeeds for a well-formed
 * Indian mobile number.
 */
export async function requestOtp(mobile) {
  await latency(700)
  if (!isValidIndianMobile(mobile)) {
    throw new ApiError('INVALID_MOBILE', 'Enter a valid 10-digit mobile number.')
  }
  return {
    requestId: `mock-otp-${Date.now()}`,
    expiresInSeconds: OTP_TTL_SECONDS,
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    // The real endpoint must never return the code. Dev-only affordance so the
    // team can run through the flow without an SMS gateway.
    devHint: MOCK_OTP,
  }
}

/**
 * POST /auth/otp/verify
 * Exchanges a correct OTP for a session token, and reports whether this mobile
 * has already completed the survey — so a returning student goes straight back
 * to their thank-you page instead of filling it in twice.
 */
export async function verifyOtp(mobile, otp) {
  await latency(800)
  if (String(otp).trim() !== MOCK_OTP) {
    throw new ApiError('INVALID_OTP', "That code doesn't match. Try again.")
  }

  const normalised = String(mobile).replace(/\D/g, '')
  const token = issueMockJwt(normalised)

  return {
    token,
    mobile: normalised,
    verifiedAt: new Date().toISOString(),
    expiresAt: new Date(decodeJwt(token).exp * 1000).toISOString(),
    survey: submissionStatus(normalised),
    // What the server already knows about this student, from an earlier draft.
    // Lets a sign-in on a second device skip straight past the email step.
    profile: readDrafts()[normalised]?.identity ?? null,
  }
}

/**
 * GET /auth/session   (Authorization: Bearer <token>)
 * Verifies a stored token and reports what the holder has already done. Called
 * on every page load that finds a session, so the UI can restore the right
 * screen without asking anyone to log in again.
 */
export async function verifySession(token) {
  await latency(400)
  const payload = requireSession(token)

  return {
    valid: true,
    mobile: payload.sub,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    survey: submissionStatus(payload.sub),
  }
}

/**
 * GET /surveys/:id
 * Fetches the questionnaire definition. Mock: resolves the bundled JSON, so the
 * page already treats the definition as remote data and swapping to a
 * server-driven survey needs no component changes.
 */
export async function fetchSurvey(surveyId, bundledDefinition) {
  await latency(250)
  if (bundledDefinition?.id !== surveyId) {
    throw new ApiError('SURVEY_NOT_FOUND', 'That survey could not be found.')
  }
  return bundledDefinition
}

/**
 * PUT /surveys/:id/responses/draft   (Authorization: Bearer <token>)
 * Saves work-in-progress, keyed server-side on the mobile in the token. Called
 * on every section advance and on a debounce while answering, so a refresh — or
 * signing in on another device — picks up where the student left off.
 *
 * Idempotent: the client sends the whole draft every time rather than a delta,
 * which makes a dropped save harmless and keeps ordering irrelevant.
 */
export async function saveDraft(draft, token) {
  await latency(350)
  const session = requireSession(token)

  if (readSubmissions()[session.sub]) {
    throw new ApiError('ALREADY_SUBMITTED', 'This survey has already been completed.')
  }

  const record = { ...draft, mobile: session.sub, updatedAt: new Date().toISOString() }
  writeDrafts({ ...readDrafts(), [session.sub]: record })
  return { savedAt: record.updatedAt }
}

/**
 * GET /surveys/:id/responses/draft   (Authorization: Bearer <token>)
 * Returns the saved draft for this student, or null if there isn't one.
 */
export async function fetchDraft(surveyId, token) {
  await latency(300)
  const session = requireSession(token)

  const record = readDrafts()[session.sub]
  if (!record || record.surveyId !== surveyId) return null
  return record
}

/**
 * POST /surveys/:id/responses   (Authorization: Bearer <token>)
 * Persists one completed response and discards the draft. Mock: logs the
 * payload, records the mobile so the dedupe path is demoable, echoes an id.
 */
export async function submitSurvey(payload, token) {
  await latency(1100)
  const session = requireSession(token)

  // One response per verified mobile. The UI routes returning students to their
  // thank-you page, so this is the backstop for a race or a stale tab — it
  // carries the original id, letting the caller treat it as success.
  const existing = readSubmissions()[session.sub]
  if (existing) {
    throw new ApiError('DUPLICATE_SUBMISSION', 'You have already completed this survey.', existing)
  }

  // The whole point of the mock: the team can open devtools during a session
  // and read exactly what the backend would have received.
  console.info('[mock submitSurvey] payload', payload)

  const record = {
    submissionId: `mock-sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  }
  writeSubmissions({ ...readSubmissions(), [session.sub]: record })

  // The response is final; the draft has served its purpose.
  const drafts = readDrafts()
  delete drafts[session.sub]
  writeDrafts(drafts)

  return { ...record, receivedAt: record.submittedAt }
}

/**
 * Mock-only escape hatch, wired to "Start a new response" on the thank-you
 * screen. A shared laptop in a college lab needs a way to hand over to the next
 * student. Against the real backend this is a sign-out and the submission stays
 * on the server; here it also releases the number so the flow can be re-demoed.
 */
export async function endSession({ mobile } = {}) {
  if (!mobile) return

  const submissions = readSubmissions()
  delete submissions[mobile]
  writeSubmissions(submissions)

  const drafts = readDrafts()
  delete drafts[mobile]
  writeDrafts(drafts)
}
