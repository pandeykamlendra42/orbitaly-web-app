import { Link } from 'react-router-dom'
import Logo from './Logo'
import {
  LEGAL_ENTITY,
  REGISTERED_ADDRESS,
  CIN,
  CONTACT_EMAIL,
  SURVEY_PATH,
} from '../content/site'

// Only destinations that exist. Links to pages we haven't built are worse than
// no links — the previous footer had nine of them, all pointing at "/".
const cols = [
  {
    title: 'The journey',
    links: [
      { label: 'Learn', href: '/#learn' },
      { label: 'Earn', href: '/#earn' },
      { label: 'Grow', href: '/#grow' },
      { label: 'Plan & Fund', href: '/#fund' },
    ],
  },
  {
    title: 'Network',
    links: [
      { label: 'Expert Network', href: '/#experts' },
      { label: 'What we’re building', href: '/#roadmap' },
      { label: 'Partner with us', href: '/#contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="on-navy bg-ink text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-6 max-w-[30ch] text-[14px] leading-[1.7] text-white/55">
              Learn what fits you. Earn from what you can do. Grow into what you want to
              become.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                {c.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              Company
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/trust"
                  className="text-[14px] text-white/70 transition-colors hover:text-white"
                >
                  Trust &amp; disclosures
                </Link>
              </li>
              <li>
                <Link
                  to={SURVEY_PATH}
                  className="text-[14px] text-white/70 transition-colors hover:text-white"
                >
                  Student research
                </Link>
              </li>
              {CONTACT_EMAIL && (
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
            {LEGAL_ENTITY}
          </p>
          {(CIN || REGISTERED_ADDRESS) && (
            <p className="mt-2 max-w-[60ch] font-mono text-[11px] leading-[1.8] text-white/35">
              {CIN && (
                <>
                  CIN: {CIN}
                  <br />
                </>
              )}
              {REGISTERED_ADDRESS}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[70ch]">
              © 2026 {LEGAL_ENTITY}. Orbitaly is not a lender. Any credit is provided by
              regulated bank or NBFC partners.
            </p>
            <p className="shrink-0 font-mono uppercase tracking-[0.16em]">
              Learn · Earn · Grow
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
