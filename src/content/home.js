/**
 * Homepage copy, as data.
 *
 * Keeping it here rather than inline in JSX is what makes the §25 research
 * mandate cheap: testing the Future Fit proposition against the Education
 * Journey Planner is a change to HERO_VARIANTS and a config flag, not a
 * redeploy of the section components.
 */

/* ------------------------------- hero ---------------------------------- */

export const HERO_VARIANTS = {
  // Broad hook. §26 is explicit that Orbitaly wins by being the place someone
  // returns to when the question is "what should I do next?" — so the brand
  // line is about direction, not about money. §23: lending must not define it.
  direction: {
    eyebrow: 'Learn · Earn · Grow',
    headline: "You don't need more options.",
    headlineAccent: 'You need the next step.',
    sub: 'Orbitaly works out where you actually are, then points at the one thing worth doing next — a course, a counsellor, an opportunity, or a way to pay for it.',
  },
  // High-intent alternative — §13's "primary high-intent monetisable hook".
  journeyPlanner: {
    eyebrow: 'Plan the whole journey',
    headline: 'The cost of an education',
    headlineAccent: 'is not the cost of the course.',
    sub: 'Tuition is the number everyone quotes. It is rarely more than half of what the journey actually takes. Work out the real figure before you decide how to fund it.',
  },
}

export const ACTIVE_HERO = 'direction'

/**
 * The noise, in a student's own words. This is the hero's signature device:
 * everything a young person is holding at once, rendered dense and small —
 * with one line resolved out of it.
 *
 * `resolved` marks the line that lifts out. Everything else stays background.
 */
export const NOISE = [
  'B.Tech or BSc?',
  'Is a ₹40 lakh loan sane?',
  'IELTS or TOEFL',
  'Manchester or Toronto',
  'Should I take a drop year',
  'Which branch has scope',
  'Private college worth it?',
  'CAT or placements',
  'Do I need a counsellor',
  'MS after B.Tech?',
  { text: 'What should I actually do next?', resolved: true },
  'Government job or private',
  'Is my CV the problem',
  'Can we afford abroad',
  'Scholarship deadlines',
  'PG now or work first',
  'Which agent is honest',
  'Do internships matter',
  'Commerce or science',
  'Will AI take this job',
  'Hostel or PG',
  'Education loan or gold loan',
  'Is design a real career',
  'What if I pick wrong',
]

/* ------------------------------ problems -------------------------------- */

// §3, written from the student's side rather than the parent's billing side.
export const PROBLEMS = [
  { q: 'What am I actually good at?', who: 'School · Class 11–12' },
  { q: 'Will this degree lead anywhere?', who: 'Undergraduate' },
  { q: 'India or abroad — and can we afford it?', who: 'PG · overseas aspirant' },
  { q: 'Which counsellor do I even trust?', who: 'Any stage' },
  { q: 'Why am I not getting shortlisted?', who: 'Final year · graduate' },
  { q: 'Nobody taught me how money works.', who: 'First job' },
]

/* -------------------------- the three pillars --------------------------- */

// A sequence, not three parallel products — so the numbering is doing real
// work here rather than decorating.
export const PILLARS = [
  {
    id: 'learn',
    tag: 'Learn',
    title: 'Understand yourself before you pick a path',
    body: 'A short diagnostic that turns your strengths and interests into career directions you can act on — then the courses, colleges and skills each one needs.',
    items: ['Future Fit Check', 'Career GPS', 'Course & college navigator', 'Skill Gap Map'],
    state: 'building',
  },
  {
    id: 'earn',
    tag: 'Earn',
    title: 'Turn what you can do into work',
    body: "Internships, projects and entry-level roles matched to your profile, with a plain explanation of why each fits and what you're missing.",
    items: ['Opportunity match', 'Fitment score', 'Profile-to-portfolio', 'Application copilot'],
    state: 'planned',
  },
  {
    id: 'grow',
    tag: 'Grow',
    title: 'Build financial confidence early',
    body: 'The money skills nobody teaches — budgeting, credit, taxes, saving and investing — alongside goals you set for yourself.',
    items: ['Financial Fitness Check', 'First Salary Mode', 'Goal Builder', 'Credit readiness'],
    state: 'planned',
  },
]

/* --------------------------- plan & fund -------------------------------- */

/**
 * A worked example, and labelled as one on the page. §8's cost categories with
 * plausible figures for a two-year postgraduate programme in Bengaluru — the
 * point being the ratio, not the rupees: the course fee is about half.
 *
 * These are illustrative and must never be presented as a quote or an average.
 */
export const LEDGER = {
  caption: 'Worked example · 2-year postgraduate programme · Bengaluru',
  lines: [
    { label: 'Tuition / course fee', amount: 1200000, primary: true },
    { label: 'Hostel or accommodation', amount: 432000, note: '24 months' },
    { label: 'Food & daily living', amount: 288000 },
    { label: 'Books, laptop, equipment', amount: 110000, note: 'mostly one-time' },
    { label: 'Transport & commute', amount: 96000 },
    { label: 'Admission & security deposit', amount: 80000, note: 'one-time' },
    { label: 'Exam, admin & misc. fees', amount: 65000 },
  ],
}

/* ---------------------------- expert network ---------------------------- */

// §6 — what a student should be able to see about a counsellor before booking.
export const EXPERT_SIGNALS = [
  ['Credentials', 'Verified experience, not a self-written bio'],
  ['Specialisation', 'The countries and courses they actually work on'],
  ['Fees', 'Stated up front, before you book'],
  ['Incentives', 'Any commercial relationship with a university, disclosed'],
  ['Reasoning', 'Why this expert was matched to you specifically'],
  ['Comparison', 'Two or three side by side, so you choose'],
]

/* ------------------------------- overseas ------------------------------- */

export const OVERSEAS_STEPS = [
  'Career direction',
  'Country opportunity map',
  'Course & university shortlist',
  'Expert match',
  'Complete journey cost',
  'Funding gap',
]

/* ------------------------------- roadmap -------------------------------- */

/**
 * Replaces the invented traction strip in the v3 comp — "12,400+ students
 * helped", a named testimonial, real universities in a matched-opportunity UI.
 * None of that is true yet, and §23 is explicit that survey enthusiasm is not
 * behaviour. An honest order of operations does the same job.
 */
export const ROADMAP = [
  {
    state: 'live',
    title: 'Student discovery research',
    body: 'What students actually struggle with, what they have already paid to solve, and what they would use. Open now — and it decides what we build first.',
    action: { label: 'Take the survey', to: '/student-survey-v1' },
  },
  {
    state: 'building',
    title: 'Education Journey Planner',
    body: 'The complete cost of a course — every line, not just tuition — the gap against what a family can contribute, and the funding routes available through regulated partners.',
  },
  {
    state: 'building',
    title: 'Future Fit & Career GPS',
    body: 'A short diagnostic that turns strengths and interests into career directions, each with the courses, skills and next actions behind it.',
  },
  {
    state: 'partners',
    title: 'Orbitaly Expert Network',
    body: 'Matched, verified counsellors with their specialisation and commercial relationships shown up front. Counsellors can register now.',
  },
  {
    state: 'planned',
    title: 'Earn, Perks and Grow',
    body: 'Opportunity matching, member benefits and the financial-capability tools. Sequenced after guidance and planning are genuinely useful.',
  },
]

/* -------------------------------- trust --------------------------------- */

export const TRUST_POINTS = [
  {
    term: 'How we make money',
    detail:
      'Partners pay us — lenders for well-prepared applicants, counsellors for matched students rather than cold leads. Where a recommendation carries a commercial relationship, we show it on the recommendation.',
  },
  {
    term: 'Who lends',
    detail:
      'Orbitaly is not a lender and not a bank. Any credit comes from a licensed bank or NBFC partner, which owns the underwriting, pricing, terms and the decision. We help you plan and route; they decide.',
  },
  {
    term: 'How matches are ranked',
    detail:
      "Our matching stays distinguishable from a counsellor's own recommendation. A platform that claims to cut through noise cannot quietly optimise for whoever pays most, so ranking is explained wherever it appears.",
  },
  {
    term: 'What we will not promise',
    detail:
      'No guaranteed jobs, admissions, loan approvals or investment returns. We help with discovery, readiness and fit — which is a real thing to offer, and enough of one.',
  },
  {
    term: 'Your data',
    detail:
      'Profile information reaches a counsellor or partner only with your consent, and you can withdraw it. Students under 18 are onboarded only with explicit parental consent.',
  },
]
