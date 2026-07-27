import { Link } from 'react-router-dom'
import { SHOW_PROTOTYPE } from '../config'

const platformCol = {
  title: 'Platform',
  links: [
    { label: 'Institute Marketplace', to: '/marketplace' },
    { label: 'Education Basket', to: '/basket' },
    { label: 'Check Eligibility', to: '/eligibility' },
  ],
}

const cols = [
  ...(SHOW_PROTOTYPE ? [platformCol] : []),
  {
    title: 'For Partners',
    links: [
      { label: 'Institutions', to: '/' },
      { label: 'Banking Partners', to: '/' },
      { label: 'Merchants', to: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Orbitaly', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={`grid gap-12 ${
            cols.length === 3 ? 'md:grid-cols-[1.4fr_1fr_1fr_1fr]' : 'md:grid-cols-[1.4fr_1fr_1fr]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="h-8 w-8">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#818cf8" strokeWidth="9" />
                <circle cx="50" cy="50" r="16" fill="#818cf8" />
              </svg>
              <span className="text-xl font-extrabold tracking-tight">Orbitaly™</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              One Student. One Platform. Every Education Expense. India's first student
              financial operating system.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/40">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Orbitaly One Technologies Private Limited. All rights reserved.</p>
          {SHOW_PROTOTYPE && (
            <p>Demo build · All institutes, offers and approvals shown are illustrative mock data.</p>
          )}
        </div>
      </div>
    </footer>
  )
}
