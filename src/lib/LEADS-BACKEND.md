# Lead capture — backend contract

One endpoint. The marketing site needs it for counsellor registration (§21
makes counsellor supply an immediate Partnerships mandate) and partner
enquiries. The client is written and gated off — see `LEADS_ENABLED` in
`src/lib/leads.js`.

Base URL follows the survey's convention: `/api/leads/v1` relative by default,
so the Vite dev proxy keeps the browser same-origin and no CORS config is
needed. Override with `VITE_LEADS_API_BASE_URL`.

## `POST /api/leads/v1/enquiries`

**Request**

```json
{
  "kind": "counsellor",
  "name": "…",
  "email": "…",
  "mobile": "9876543210",
  "organisation": "…",
  "specialisation": "UK & Europe admissions",
  "message": "…",
  "source": "web",
  "path": "/"
}
```

`kind` is one of `counsellor` | `partner` | `student`. Fields beyond `kind`,
`name` and `email` vary by kind and should be treated as optional:

| kind | also sends |
|---|---|
| `counsellor` | `mobile`, `organisation`, `specialisation` |
| `partner` | `organisation`, `message` |
| `student` | `mobile` |

**201**

```json
{ "id": "lead_01H…" }
```

**Errors** — return a `code` the UI branches on, same convention as the survey
API:

| status | code | UI shows |
|---|---|---|
| 400/422 | `VALIDATION_FAILED` | "Some of those details need another look." |
| 409 | `DUPLICATE` | "You're already on the list — we'll be in touch." |
| 429 | `RATE_LIMITED` | "That was a lot of attempts. Try again in a few minutes." |
| 5xx | `SERVER_ERROR` | generic retry message |

## Notes for implementation

- **Rate limit by IP and by email.** This form is public and unauthenticated.
- **Counsellor records are contact data for real people.** They should land
  somewhere the Partnerships team can work them, and be covered by whatever
  retention policy legal settles on.
- Consider reusing the survey's existing abuse/blocklist machinery — the admin
  module already has an `AbuseTab` over `/admin/abuse`.

## Turning it on

```
VITE_LEADS_ENABLED=true
```

Until then the counsellor and partner sections render an honest interim state
and point visitors at the survey, which is live.
