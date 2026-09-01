# Orbitaly — marketing site

The public brand site for Orbitaly. It presents the offering, how it works and who
it is for. **The product itself is built separately** — nothing here is a working
product surface.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (picks next port if busy)
npm run build      # production build to dist/
```

## Routes

| Route | What it is |
|---|---|
| `/` | The marketing landing page. |
| `/student-survey-v1` | Student discovery survey — live, backed by a real API. |
| `/survey-analytics` | Internal analytics over the survey. Noindexed. |

The survey and admin modules are self-contained and carry their own chrome; the
marketing nav and footer are hidden on their routes (see `CHROMELESS_ROUTES` in
`src/App.jsx`). Each has its own README.

## Where things live

```
src/
  pages/Landing.jsx     section order — the argument the page makes
  pages/Trust.jsx       how we make money, who lends, disclosures
  sections/             one file per landing section
  sections/staged/      not imported — kept for phase 2/3 pages, see its README
  content/home.js       all homepage copy, as data
  content/site.js       site-wide facts (legal entity, nav, contact)
  components/           Navbar, Footer, Logo, StatusLabel, EnquiryForm, ui.jsx
  lib/leads.js          lead capture client — see LEADS-BACKEND.md
  modules/survey/       the survey — see its README and BACKEND.md
  modules/survey-admin/ internal analytics dashboard
```

Copy lives in `src/content/` rather than inline in JSX so marketing can run the
research doc's §25 proposition test (Future Fit vs Education Journey Planner)
by switching `ACTIVE_HERO`, without touching components.

## Design system

Tokens are in the `@theme` block of `src/index.css`.

- **Colour** is derived from the brand mark itself (`#0A2472 → #1565C0 →
  #00AEEF`). `brand` `#0D2B8E` is a dominant field colour, not a hairline;
  `brand-bright` `#00AEEF` is used sparingly for emphasis and state. Status
  colours are deliberately muted and separate from the accent.
- **Type** pairs Instrument Sans (display, tight tracking) with Inter (body)
  and IBM Plex Mono (labels, amounts, statuses). The mono is load-bearing —
  this brand's native artifact is a fee schedule.
- **`ink`, `ink-soft`, `orbit-*` and `mint-*` belong to the survey and admin
  modules.** They are live and out of scope for the redesign; don't remove or
  repoint those tokens without converting those modules first.

## Honesty rule

Nothing on the site claims a capability is live unless a visitor can complete
it today. Every capability carries a `StatusLabel` — live / in build /
onboarding partners / planned — and product previews are marked illustrative.
The strategy is explicit about this (§18 "do not show empty shelves", §23 "do
not promise jobs, admissions, loan approvals"), and it is why there is a
roadmap where a traction strip would normally go.

## Still open

- Registered address and CIN for the footer (`src/content/site.js`).
- A partnerships inbox — `CONTACT_EMAIL` is empty, so the partner door shows an
  interim state.
- Privacy policy, terms and grievance process — needed before any product
  journey opens, and the survey already collects mobile numbers.
- Lead capture is built and gated off. Set `VITE_LEADS_ENABLED=true` once
  `/api/leads/v1` is deployed; see `src/lib/LEADS-BACKEND.md`.

> **Known issue:** `npm run lint` currently fails to start — the installed
> `oxlint` is missing its platform binary (`oxlint.darwin-universal.node`).
> Pre-existing; fix with a clean reinstall of `node_modules`.
