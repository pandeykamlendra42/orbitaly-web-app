# Survey module

Self-contained, schema-driven survey. Route: **`/student-survey-v1`**.

The app touches this module in exactly two places — a lazy import of
`SurveyPage` and `SURVEY_ROUTES` from `routes.js` (used to hide the marketing
nav/footer). Nothing here imports app state.

```
modules/survey/
  SurveyPage.jsx        orchestrator — auth → sections → done
  routes.js             route constants (leaf file, safe for App.jsx to import)
  index.js              public surface
  data/
    student-survey-v1.json    the questionnaire (see schema below)
  lib/engine.js         pure logic: visibility, validation, payload building
  lib/session.js        JWT expiry + localStorage session
  lib/validation.js     mobile/email format checks
  api/surveyApi.js      picks the implementation (real by default)
  api/httpSurveyApi.js  real client — see BACKEND.md
  api/http.js           fetch wrapper: base URL, bearer token, error codes
  api/mockSurveyApi.js  offline fallback, VITE_SURVEY_USE_MOCK=true
  components/           Progress, AuthGate, SectionStep, QuestionCard, controls
```

## Running it

Against the real backend (the default — needs the API up on :8080):

```bash
npm run dev
# open /student-survey-v1 — a real OTP is sent to the number you enter
```

Vite proxies `/api` → `http://localhost:8080`, so the browser stays same-origin
and the backend needs no CORS configuration. Point it elsewhere with
`VITE_SURVEY_API_PROXY_TARGET`, or set `VITE_SURVEY_API_BASE_URL` for a
deployed build.

With no backend at all:

```bash
VITE_SURVEY_USE_MOCK=true npm run dev
# OTP is 123456
```

## Flow

1. **Mobile → OTP → email.** Login gates the survey so every response ties to a
   verified number. Email is collected and format-checked but not verified.
2. **Seven sections, one per screen.** The 37 content questions are grouped A–G
   (~5 each). Progress rail up top, sticky Continue at the bottom.
3. **Submit.** `buildSubmission()` flattens everything into the payload in
   BACKEND.md and posts it to the mock API.

All questions are required.

## Saving and resuming

Answers are saved to the server continuously, so losing work takes real effort:

- **On every section advance** — awaited. If the save fails the student is held
  on the section with a retry rather than advancing over lost answers.
- **On a 1.2s debounce while answering** — the safety net between advances, so a
  refresh mid-section costs nothing.
- **On Back**, so edits to an earlier section stick.

Drafts are keyed server-side on the verified mobile, which is what makes signing
in on another device resume rather than restart. The header shows a quiet
Saving/Saved indicator; `beforeunload` only warns when something is genuinely
unsaved.

A draft whose `surveyVersion` doesn't match the current questionnaire is
discarded — answers keyed to questions that have since changed can't be trusted.

## Sessions

The token persists in `localStorage` under `orbitaly.survey.session`.
`lib/session.js` reads the JWT's `exp` claim directly — no signature check, a
browser can't do one — and the server re-verifies on every load.

| Situation | What happens |
|---|---|
| Reload, token live, already submitted | Straight back to the thank-you page. No login. |
| Reload, token live, mid-survey | No login; resumes at the saved section with answers prefilled. |
| Reload, token expired | Session cleared, login screen — then resumes from the draft. |
| Signs in on another device | Email step skipped (server returns the known profile), resumes at the saved section. |
| Same number verifies again after submitting | Skips the email step, lands on the original thank-you page with the original reference. |
| Token lapses mid-survey | Bounced to re-verify with the number pre-filled. On-screen answers are kept in preference to the saved draft, since they're newer. |
| Submit fails on an expired token | Same, then **resubmits automatically** once verified. |
| `DUPLICATE_SUBMISSION` from the server | Treated as success — shows the existing submission. |

Token TTL is `SESSION_TTL_MINUTES` (30) in the mock API. A timer fires at expiry
so a student is interrupted at a known point rather than hitting a silent 401.

**Shared devices:** "Not you? Start a new response" on the thank-you page clears
the session and hands the machine to the next student — campus labs need it.
Against the mock it also releases the number so the flow can be re-demoed;
against a real backend the submission stays on the server.

## Adding another survey

Drop a new JSON in `data/`, add a route. No component changes — the renderer is
driven entirely by the schema.

### Question schema

| Field | Meaning |
|---|---|
| `id` | Stable key. **Never reuse or renumber** after responses land. |
| `number` | Display number; matches the source questionnaire. |
| `type` | `single` · `multi` · `scale` |
| `text` | The question |
| `helpText` | Muted line under the question |
| `required` | Defaults to `true`; set `false` to allow skipping |
| `options[]` | `{ value, label }` plus the flags below |
| `maxSelections` / `minSelections` | `multi` only. Max is hard-enforced — options grey out at the cap. |
| `scale` | `scale` only: `{ min, max, minLabel, maxLabel }` |
| `optionsFrom` | Build this question's options from another question's answers (the "out of those, which ONE…" pattern). Pair with `optionsFromEmptyHint`. |
| `visibleIf` | `{ question, in: [...] }` or `{ question, notIn: [...] }`. Hidden questions submit as `skipped: true`. |

Option flags:

| Flag | Meaning |
|---|---|
| `allowsText` | Reveals a free-text box when selected. Required once selected — an "Other" with nothing in it is not an answer. |
| `exclusive` | "None of these" — selecting it clears the rest, and vice versa. |
| `textPlaceholder` | Placeholder for the `allowsText` box |

### Logic active in `student-survey-v1`

- **Q7** narrows to whatever was picked in **Q6** (`optionsFrom`). Changing Q6
  prunes a Q7 answer that's no longer on offer.
- **Q17** (study-abroad priorities) is hidden when **Q4 = No**.
- **Q33/Q34** (card control, payment priority) are hidden when
  **Q32 = Definitely not**.
- Pick-N caps on Q6 (5) and Q12/17/18/24/27/31 (3) are enforced as maximums, not
  exact counts — a student with three real problems shouldn't invent two more.
- `Other` on ~12 questions opens a text box. This is where the qualitative
  signal comes from; it's worth reading those verbatims before the cross-tabs.
