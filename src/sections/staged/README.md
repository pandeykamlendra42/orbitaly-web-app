# Staged sections

Not imported by any page. These three carry work worth keeping — the
hand-tuned disbursement orbit SVG especially — and are staged here for the
pages that will reuse them:

| File | Destination | Phase |
|---|---|---|
| `Disbursement.jsx` | `/plan-and-fund` | 2 |
| `ParentApp.jsx` | `/plan-and-fund` (as Parent View, §5) | 2 |
| `Audiences.jsx` | `/partners` | 3 |

They still use the old `orbit-*` / `mint-*` theme tokens and the retired
lending-first copy. Converting them to the current palette and rewriting the
copy is part of the phase that adopts them — do not import them as-is.

The rest of the original landing sections (hero, problem, basket, student app,
how-it-works, compliance, CTA) were removed rather than staged: they argued the
positioning the strategy retired. Git history has them at `ef3460c` if anything
needs to be read back.
