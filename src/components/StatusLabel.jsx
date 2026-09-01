/**
 * The honesty device for this site.
 *
 * Every capability we show carries the state it is actually in — §18 "do not
 * show empty shelves", §23 "do not promise jobs, admissions, loan approvals".
 * Nothing here may read "live" unless a visitor can complete it today.
 *
 * Rendered as a marker and a label rather than a coloured pill: a status is
 * information, and it should not compete with the accent for attention.
 */
const STATES = {
  live: { label: 'Live now', dot: 'bg-state-live', text: 'text-state-live' },
  building: { label: 'In build', dot: 'bg-state-build', text: 'text-state-build' },
  partners: { label: 'Onboarding partners', dot: 'bg-brand', text: 'text-brand' },
  planned: { label: 'Planned', dot: 'bg-ink-3', text: 'text-ink-3' },
}

const ON_NAVY = {
  live: 'text-emerald-300',
  building: 'text-amber-300',
  partners: 'text-brand-bright',
  planned: 'text-white/45',
}

const ON_NAVY_DOT = {
  live: 'bg-emerald-300',
  building: 'bg-amber-300',
  partners: 'bg-brand-bright',
  planned: 'bg-white/40',
}

export default function StatusLabel({ state, onNavy = false, className = '' }) {
  const s = STATES[state]
  if (!s) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.13em] ${
        onNavy ? ON_NAVY[state] : s.text
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${onNavy ? ON_NAVY_DOT[state] : s.dot}`}
        aria-hidden="true"
      />
      {s.label}
    </span>
  )
}
