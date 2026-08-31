# Survey analytics (internal)

Read-only dashboard over `/api/survey/v1/admin`. Route: **`/survey-analytics`**.

```
modules/survey-admin/
  AdminPage.jsx          token gate → tabbed dashboard, all data loading
  routes.js              route constants (leaf file, safe for App.jsx)
  api/adminApi.js        all 9 endpoints + the authenticated CSV download
  lib/format.js          dates (timezone-corrected), durations, PII masking
  components/
    TokenGate.jsx        paste an LOS admin JWT
    charts.jsx           Panel, StatTile, BarList, VolumeChart + the palette
    OverviewTab.jsx  FunnelTab.jsx  QuestionsTab.jsx
    CrosstabTab.jsx  RespondentsTab.jsx  AbuseTab.jsx
```

Depends on the survey module for exactly one thing: the bundled questionnaire,
used to list questions and map section keys to titles (the admin API has no
endpoint for either). Otherwise the two modules share only `src/lib/jwt.js`.

## Auth

There is no admin login endpoint, so the dashboard asks for an existing **LOS
admin JWT** and sends it as `Authorization: Bearer`. It must carry the `ADMIN`
authority.

The token is checked locally for shape and expiry, then proven against
`GET /admin/surveys` *before* being stored — a bad paste fails at the gate
rather than as six broken panels. It lives in `localStorage` under
`orbitaly.survey.admin.token`, and is cleared on sign-out, on expiry (a timer
fires at `exp`), and on any `401`/`403` from any panel.

## Tabs

| Tab | Endpoint | Notes |
|---|---|---|
| Overview | `/summary` | Stat tiles + daily volume |
| Funnel | `/funnel` | Stages + section retention |
| Questions | `/questions/{key}/stats` | Choice **or** scale breakdown |
| Cross-tab | `/crosstab` | Heatmap; choice questions only |
| Respondents | `/responses`, `/responses/{id}`, `.csv` | Paged, PII masked |
| OTP abuse | `/abuse` | Global, not per-survey |

## API quirks this handles

These are the things that would otherwise silently produce wrong numbers:

- **Day buckets are not UTC days.** `summary.dailyVolume[].day` is truncated in
  the DB session timezone and *then* serialised as UTC, so an IST bucket arrives
  as `18:30:00Z` — the previous calendar day. `dayLabel()` parses the instant and
  formats it locally. **Never `.slice(0, 10)` that string**; every bar shifts a
  day. (If the API ever switches to a plain `"2026-08-28"` string, simplify
  `dayLabel` — parsing a bare date as UTC would reintroduce the same bug.)
- **`options` and `numeric` are mutually exclusive and omitted**, not null. The
  question tab branches on presence and falls back to an empty state, so a
  free-text question can't crash it.
- **`percentOfAnswered` is a share of `answered`**, not of total responses, so
  multi-selects sum well past 100%. The panel subtitle says so.
- **`skipped` ≠ `blank`.** Hidden by conditional logic vs shown and left empty.
  Shown as separate tiles and never added together.
- **Cross-tab cells can be absent** from `counts`; absent renders as `0`.
- **Cross-tab rejects non-choice questions** with `400 VALIDATION_FAILED`, so
  the pickers only offer `single`/`multi` questions — and the error is still
  surfaced if the API disagrees.
- **`FLAGGED` is advisory.** Those responses are real data, not rejects, and the
  UI says so in both the tile hint and the detail drawer.
- **Render `labels`, not `values`.** Values are machine keys and stay out of the
  UI; `freeText` and `numericValue` are omitted when absent.
- **The CSV needs an auth header**, so a plain `<a download>` cannot fetch it —
  it is pulled as a blob and handed to a synthetic link.
- **`/abuse` ignores its `surveyKey`.** Results are global across all surveys;
  the tab says so rather than letting the numbers read as survey-specific.

## PII

`mobile` and `email` are masked by default in both the respondent list and the
abuse table, with a per-row reveal. The full values are shown in the detail
drawer, which is opened deliberately. `/survey-analytics` is served with
`X-Robots-Tag: noindex, nofollow` (see `vercel.json`).

## Charts

One series each, so none carries a legend — the panel title names what is
plotted. Colour does the magnitude job throughout: a single accent (`#4f46e5`)
for bars and the volume line, and a **validated sequential ramp** for the
heatmap and the ordered rating distribution.

The ramp in `charts.jsx` was checked with the dataviz validator in ordinal mode
against a white surface: monotone lightness, adjacent ΔL ≥ 0.06, light end
2.13:1, hue spread 2°. **Don't lighten the first step** — `#a5b4fc` and anything
above it fall below the 2:1 contrast floor and disappear on white.

## Not wired

- **The funnel will read all zeros** until the respondent app posts to
  `POST /api/survey/v1/surveys/{key}/events`. That is a survey-app change, not a
  dashboard one. The tab detects the all-zero case and explains it rather than
  drawing a flat chart that looks like catastrophic drop-off.
- No date-range control on the funnel yet; it uses the API default (last 30
  days). `fetchFunnel` already accepts `{ from, to }`.
