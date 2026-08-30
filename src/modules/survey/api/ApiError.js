/**
 * Every API rejection carries a `code` so the UI can branch on meaning rather
 * than on message text. The codes the app actually acts on:
 *
 *   SESSION_EXPIRED | UNAUTHENTICATED | INVALID_TOKEN  → re-verify, then retry
 *   DUPLICATE_SUBMISSION                               → treat as success
 *   INVALID_OTP | INVALID_MOBILE                       → inline field error
 *   NETWORK_ERROR                                      → "couldn't save" + retry
 *
 * Anything else falls through to its message being shown as-is.
 */
export class ApiError extends Error {
  constructor(code, message, details) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}
