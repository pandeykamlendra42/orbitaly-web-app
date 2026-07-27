# Orbitaly™ — Investor Demo MVP

One Student. One Platform. Every Education Expense.

A Revolut-inspired education financing platform MVP built with React. All institutes,
offers and approvals are **mock data** — no backend required.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (picks next port if busy)
npm run build      # production build to dist/
```

## The demo journey

1. **Landing** (`/`) — parallax hero, animated statistics, parent / institution /
   banking-partner value props and the six-step "how it works" from orbitalyos.com.
2. **Institute Marketplace** (`/marketplace`) — search plus City, Category and Fee-range
   filters over 8 mock institutes.
3. **Institute Details** (`/institute/:id`) — product-detail page: pick a campus city,
   select a course, then add financed extras (hostel, transport, mess, books, laptop,
   allowance…) to the basket.
4. **Education Basket** (`/basket`) — grouped bill of materials with tuition/add-on
   split and total to finance.
5. **Eligibility Checker** (`/eligibility`) — mock applicant form → animated soft-check
   → pre-approved credit line (max of ₹5L or 1.4× basket, rounded to ₹50K) → coverage
   bar → "proceed with loan journey" next steps.

The basket and approval persist in `localStorage`, so refreshes don't break a demo.

## Stack

- Vite 6 + React 19 (JSX)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion — parallax (`useScroll`/`useTransform`), reveals, counters, layout animations
- React Router 7, lucide-react icons, Inter (Google Fonts)

## Where things live

```
src/
  data/institutes.js         # mock catalogue: institutes, courses, add-ons, filters, ₹ formatting
  context/BasketContext.jsx  # basket + eligibility state (localStorage-backed)
  components/                # Navbar, Footer, ui.jsx (Reveal, CountUp, InstituteCover, Chip)
  pages/                     # Landing, Marketplace, InstituteDetails, Basket, Eligibility
```
