import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import { LENDING_PARTNERS } from '../content/home'
import iciciLogo from '../assets/icici-bank.svg'

// Logos live in src/assets so Vite fingerprints them; the content file stays
// plain data. Add a line here when a partner is added to LENDING_PARTNERS.
const LOGOS = { icici: iciciLogo }

/**
 * The lenders behind Plan & Fund.
 *
 * Sits directly under the funding section, which promises "regulated bank and
 * NBFC partners" — this is where that promise gets a name. It is deliberately
 * not a numbered movement of the argument: a partner strip is evidence for the
 * section above it, not a new claim. Nothing here may read as Orbitaly lending;
 * the disclosure line is part of the component, not optional copy.
 */
export default function LendingPartners() {
  return (
    <section
      id="lenders"
      aria-labelledby="lenders-heading"
      className="scroll-mt-20 border-b border-rule bg-paper py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-x-20 gap-y-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
                Lending partners
              </span>
              <StatusLabel state="live" />
            </div>
            <h2
              id="lenders-heading"
              className="mt-5 max-w-[22ch] font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[1.9rem]"
            >
              The credit comes from a bank. Here is which one.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-ink-2">
              When funding is the blocker, the application is routed to a licensed lender who
              owns the underwriting, the pricing and the decision. We do the planning so you
              arrive with the whole figure, not just the tuition line.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-px border border-rule bg-rule">
              {LENDING_PARTNERS.map((p) => (
                <li
                  key={p.id}
                  className="grid gap-x-10 gap-y-6 bg-paper p-7 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center lg:p-8"
                >
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} (opens in a new tab)`}
                    className="block"
                  >
                    <img
                      src={LOGOS[p.id]}
                      alt={p.name}
                      className="h-10 w-auto max-w-full sm:h-11"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  {/* Label column is fixed so the three values line up; on
                      phones the labels stack above their values instead. */}
                  <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-[8ch_1fr] sm:items-baseline sm:border-l sm:border-rule sm:pl-8">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                      Partner
                    </dt>
                    <dd className="-mt-2 font-display text-[17px] font-semibold tracking-[-0.02em] text-ink sm:mt-0">
                      {p.name}
                    </dd>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                      Status
                    </dt>
                    <dd className="-mt-2 text-[14.5px] text-ink-2 sm:mt-0">{p.kind}</dd>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                      Covers
                    </dt>
                    <dd className="-mt-2 text-[14.5px] text-ink-2 sm:mt-0">{p.role}</dd>
                  </dl>
                </li>
              ))}
            </ul>

            {/* The same sentence the footer and Trust page carry — a lender's
                logo on the page must never read as Orbitaly lending. */}
            <p className="mt-5 flex max-w-[64ch] flex-wrap items-baseline gap-x-2 font-mono text-[10.5px] uppercase leading-[1.8] tracking-[0.14em] text-ink-3">
              <span>
                Orbitaly is not a lender. Eligibility, rates and approval are decided by the
                bank under its own terms.
              </span>
              <Link
                to="/trust"
                className="inline-flex items-center gap-1 text-brand transition-colors hover:text-brand-deep"
              >
                How this works
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
