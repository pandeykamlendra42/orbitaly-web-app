# Survey module — backend integration

**The client now talks to the real backend.** `api/httpSurveyApi.js` is live;
`api/mockSurveyApi.js` is kept as an offline fallback and is only used when
`VITE_SURVEY_USE_MOCK=true`. Which one runs is decided in `api/surveyApi.js` —
both export the same names with the same signatures, so nothing above the API
layer knows the difference.

## Base URL

| | |
|---|---|
| **Default** | `/api/survey/v1` (relative) |
| **Dev** | Vite proxies `/api` → `http://localhost:8080` (see `vite.config.js`), so the browser stays same-origin and **no CORS config is needed on the backend** |
| **Deployed** | set `VITE_SURVEY_API_BASE_URL=https://…/api/survey/v1` |
| **Proxy target** | override with `VITE_SURVEY_API_PROXY_TARGET` |

Verified reachable through the proxy: `GET /api/survey/v1/health` → 200.

## Paths, as the server actually mounts them

Everything below is relative to `/api/survey/v1`. Note the server uses
`surveyKey` where this doc originally said `surveyId`; the client passes the
survey's `id` (`student-survey-v1`) for it.

| This doc | Server |
|---|---|
| `POST /auth/otp/request` | `POST /api/survey/v1/auth/otp/request` |
| `POST /auth/otp/verify` | `POST /api/survey/v1/auth/otp/verify` |
| `GET /auth/session` | `GET /api/survey/v1/auth/session` |
| `PUT /surveys/:id/responses/draft` | `PUT /api/survey/v1/surveys/{surveyKey}/responses/draft` |
| `GET /surveys/:id/responses/draft` | `GET /api/survey/v1/surveys/{surveyKey}/responses/draft` |
| `GET /surveys/:id` | `GET /api/survey/v1/surveys/{surveyKey}` |
| `POST /surveys/:id/responses` | `POST /api/survey/v1/surveys/{surveyKey}/responses` |

The server also exposes, and the client does **not** yet use:

- `POST /auth/logout` — wired to "Start a new response" (best effort).
- `POST /surveys/{surveyKey}/events` — the abandonment telemetry listed as a gap
  below. It exists; nothing calls it yet.
- `/admin/**` — `responses.csv`, `summary`, `crosstab`, `funnel`, `abuse`,
  `blocklist`, version publish/import. The export and analysis gaps below are
  already solved server-side.

Fields the server accepts that the client leaves empty: `captchaToken` and
`clientUid` on OTP request, `clientUid` on verify. Worth wiring `clientUid` if
you want to correlate a student's events across the funnel.

---

## 1. `POST /auth/otp/request` — blocking

Sends a 6-digit OTP over SMS.

**Request**
```json
{ "mobile": "9876543210", "purpose": "survey", "surveyId": "student-survey-v1" }
```

**200**
```json
{
  "requestId": "otp_01H...",
  "expiresInSeconds": 60,
  "resendAfterSeconds": 30
}
```

**Errors** — reject with a `code` the UI can branch on:
`INVALID_MOBILE`, `RATE_LIMITED` (include `retryAfterSeconds`), `SMS_FAILED`.

**Notes**
- The mock returns `devHint: "123456"`. **The real endpoint must never return
  the code** — delete that field when wiring it up.
- Needs an SMS provider (MSG91 / Twilio / AWS SNS) and a DLT-registered template
  for India.
- Rate limit per mobile *and* per IP. A public survey link handed to a college
  cohort is an open SMS-cost surface.

---

## 2. `POST /auth/otp/verify` — blocking

Exchanges a correct OTP for a short-lived session token, **and reports whether
this mobile has already completed the survey**.

**Request**
```json
{ "mobile": "9876543210", "otp": "123456", "requestId": "otp_01H..." }
```

**200**
```json
{
  "token": "eyJhbGciOi...",
  "mobile": "9876543210",
  "verifiedAt": "2026-08-30T09:12:44.000Z",
  "expiresAt": "2026-08-30T09:42:44.000Z",
  "survey": {
    "hasSubmitted": true,
    "submissionId": "sub_01H...",
    "submittedAt": "2026-08-29T14:02:10.000Z"
  }
}
```

`survey.hasSubmitted` drives real behaviour, so it is **required**: when it is
true the UI skips the email step and returns the student straight to their
thank-you page instead of letting them fill the survey a second time. When false
send `{ "hasSubmitted": false }` and omit the rest.

**Errors** — `INVALID_OTP`, `OTP_EXPIRED`, `TOO_MANY_ATTEMPTS` (lock after ~5).

**Notes**
- Token needs to outlive the survey — **30 minutes minimum**, since the survey
  takes 8–10 and a student may pause. `SESSION_TTL_MINUTES` in the mock is 30;
  keep the real TTL at least that.
- The token **must** be a JWT with a numeric `exp` claim (seconds since epoch)
  and the verified mobile in `sub`. The client reads `exp` directly to decide
  whether to bother calling `/auth/session`, and to warn the student before a
  session lapses mid-survey. A token without a readable `exp` is treated as
  already expired.
- `sub` binds the response to the number, so a submission can't be replayed
  under a different one.

---

## 3. `GET /auth/session` — blocking, on every page load with a stored token

Verifies a token the browser already holds and reports what its holder has done.
`Authorization: Bearer <token>`.

**200**
```json
{
  "valid": true,
  "mobile": "9876543210",
  "issuedAt": "2026-08-30T09:12:44.000Z",
  "expiresAt": "2026-08-30T09:42:44.000Z",
  "survey": { "hasSubmitted": true, "submissionId": "sub_01H...", "submittedAt": "..." }
}
```

**Errors** — `SESSION_EXPIRED`, `INVALID_TOKEN`, `UNAUTHENTICATED`. Any rejection
makes the client discard the stored session and show the login screen.

**Notes**
- This is what keeps a student on their thank-you page across a reload without
  logging in again. The client checks `exp` locally first and skips the call
  entirely for a token it can already prove is dead — but the server is the
  authority and its answer always wins.
- The client stores the token in `localStorage` under
  `orbitaly.survey.session`. Answers live server-side as a draft (§4).
- A `200` carrying `valid: false` is treated as a dead session, same as a 401.

---

## 4. Draft save/restore — blocking, called constantly

This is what makes the survey survivable. Answers are saved on **every section
advance** (awaited — the student is held on the section if it fails) and on a
**1.2s debounce while answering**, so a refresh mid-section costs nothing.

Drafts are keyed server-side on the mobile in the token, never on a client id —
that is what lets a student sign in on another device and carry on.

### `PUT /surveys/:surveyId/responses/draft`

```json
{
  "surveyId": "student-survey-v1",
  "surveyVersion": 1,
  "identity": { "email": "student@college.edu", "consentedAt": "..." },
  "answers": { "q1_age": "19_21", "q6_hardest": ["choosing_career", "cost_of_education"] },
  "texts": { "q35_signup_trigger:other": "a proper internship board" },
  "lastSectionIndex": 3
}
```

**200** — `{ "savedAt": "2026-08-30T09:18:02.000Z" }`

**Errors** — `SESSION_EXPIRED` (client re-verifies, then retries),
`ALREADY_SUBMITTED`.

**Notes**
- **Idempotent, full-document PUT.** The client sends the entire draft every
  time rather than a delta, so a dropped save is harmless and out-of-order
  arrivals can't corrupt anything. Last write wins — keep it that way.
- `identity.email` is stored so `/auth/otp/verify` can hand it back as `profile`
  and a second device skips the email step. If you'd rather hold email on a
  proper student record, that's strictly better — just keep returning it.
- `lastSectionIndex` is where to drop the student back in.
- Called ~10–15 times per response. Cheap upsert on `(survey_id, mobile)`.

### `GET /surveys/:surveyId/responses/draft`

Returns the same document, or `null` when there's no draft.

**Notes**
- The client discards a draft whose `surveyVersion` doesn't match the current
  questionnaire — answers keyed to questions that have since changed can't be
  trusted. Keep the version stamped on the row.
- Delete the draft when the final response lands (the mock does).

---

## 5. `GET /surveys/:surveyId` — non-blocking (currently bundled)

Returns the questionnaire definition — the exact shape of
`data/student-survey-v1.json`.

The page already fetches through `fetchSurvey()`, so moving the definition
server-side needs no component changes. Worth doing once you want to edit
questions without a redeploy, or run more than one survey.

**Errors** — `SURVEY_NOT_FOUND`, `SURVEY_CLOSED`.

---

## 6. `POST /surveys/:surveyId/responses` — blocking

Persists one completed response. `Authorization: Bearer <token>` from step 2.

**Request** (produced verbatim by `buildSubmission()` in `lib/engine.js`)
```json
{
  "surveyId": "student-survey-v1",
  "surveyVersion": 1,
  "identity": {
    "token": "eyJhbGciOi...",
    "mobile": "9876543210",
    "email": "student@college.edu",
    "consentedAt": "2026-08-30T09:12:50.000Z"
  },
  "responses": [
    { "questionId": "q1_age", "number": 1, "type": "single", "value": "19_21" },
    { "questionId": "q6_hardest", "number": 6, "type": "multi",
      "value": ["choosing_career", "cost_of_education", "other"],
      "freeText": { "other": "no idea how to pick a specialisation" } },
    { "questionId": "q17_abroad_priorities", "number": 17, "skipped": true }
  ],
  "submittedAt": "2026-08-30T09:22:10.000Z"
}
```

**200**
```json
{ "submissionId": "sub_01H...", "receivedAt": "2026-08-30T09:22:11.000Z" }
```

**Errors**

| Code | What the UI does |
|---|---|
| `SESSION_EXPIRED` / `UNAUTHENTICATED` / `INVALID_TOKEN` | Keeps the answers in memory, sends the student to re-verify, then **resubmits automatically**. Nothing is retyped. |
| `DUPLICATE_SUBMISSION` | Treated as success and routed to the thank-you page. Must include the original `{ submissionId, submittedAt }` in the error body so the right reference is shown. |
| `VALIDATION_FAILED` | Message shown above the submit button. |

**Notes**
- `skipped: true` marks a question hidden by conditional logic. Store it —
  "not applicable to this student" and "we never asked" are different rows in a
  cross-tab, and collapsing them will skew the section D/F numbers.
- **One response per verified mobile — reject duplicates.** The UI already
  routes returning students away from the survey, so this endpoint is the
  backstop for a stale tab or a race. Return the original submission id in the
  error rather than a bare 409; the client shows it as a normal confirmation.
- Store `surveyVersion` alongside every response. Editing the JSON after the
  first responses land silently changes what the data means otherwise.

---

## Not built, worth deciding

| Gap | Impact |
|---|---|
| **Error-code shape is unconfirmed.** The client branches on `code` (`SESSION_EXPIRED`, `DUPLICATE_SUBMISSION`, `INVALID_OTP`…). The server's OpenAPI only declares "Bad Request", so `api/http.js` reads `code`/`errorCode`/`error` and otherwise falls back to mapping the HTTP status. | **Most likely thing to need adjusting.** If the backend names codes differently, fix the mapping in `codeFromBody`/`codeForStatus` — one function, no component changes. |
| **Mock storage is client-side.** Only relevant under `VITE_SURVEY_USE_MOCK=true`: `orbitaly.mock.*` in `localStorage` stands in for server tables, so "already submitted" and draft resume hold only within one browser profile. | Fine for a demo. The real backend does this properly. |
| **`profile.email` comes from the draft.** Once a response is submitted its draft is deleted, so the email is no longer available to `/auth/otp/verify`. Harmless today (a submitted student goes straight to the thank-you page and is never asked), but fragile. | Hold email on a student record rather than inferring it from a draft. |
| **No conflict handling across devices.** Two tabs open on the same number both save full documents; last write wins and the other tab's answers are silently replaced. | Unlikely in a supervised college session. If it matters, return `updatedAt` and reject a stale write. |
| **Email is unverified.** Collected, format-checked, never confirmed. | Agreed scope. Expect a few typo'd addresses; the verified mobile is the reliable contact. |
| **Telemetry not wired.** `POST /surveys/{surveyKey}/events` exists server-side; the client never calls it, so you still can't see *where* students abandon. | A fire-and-forget call on each section advance. Small change in `handleNext`. |
| **Admin/export not wired.** `responses.csv`, `summary`, `crosstab`, `funnel` all exist on the backend. | Nothing needed from this module — they're consumed elsewhere. |
