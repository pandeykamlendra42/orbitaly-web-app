import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import { LEDGER } from '../content/home'

const inr = (n) => '₹' + n.toLocaleString('en-IN')

const total = LEDGER.lines.reduce((s, l) => s + l.amount, 0)
const tuition = LEDGER.lines.find((l) => l.primary).amount
const tuitionShare = Math.round((tuition / total) * 100)

/**
 * The fee schedule, which is this company's native artifact — the thing every
 * Indian family already recognises from a college circular. §8's cost
 * categories rendered as the document they actually arrive as, so the argument
 * is carried by the shape of the table rather than by an adjective.
 */
export default function PlanAndFund() {
  return (
    <section id="fund" className="on-navy scroll-mt-20 bg-brand-deep py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-x-20 gap-y-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Reveal>
              <SectionHead
                index={3}
                eyebrow="Plan & Fund"
                onNavy
                title="The cost of an education is not the cost of the course."
                lede="Tuition is the number everyone quotes, and it is rarely more than half of what the journey takes. Build the whole figure first, see the gap against what your family can put in, and only then look at how to cover it."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <StatusLabel state="building" onNavy />
              </div>

              <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.7] text-white/60">
                When funding is the blocker we route you to regulated bank and NBFC
                partners. They own the underwriting, the pricing and the decision. We own
                the planning, and making sure you understand what you're signing.
              </p>

              <p className="mt-6 max-w-[44ch] border-l-2 border-brand-bright/50 pl-5 text-[14px] leading-[1.7] text-white/50">
                We show the estimated cost of the journey separately from what you might be
                eligible to borrow. They are different numbers, and treating them as one is
                how people end up over-borrowing.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <figure className="m-0">
              <div className="bg-white/[0.04] px-6 py-7 ring-1 ring-white/12 sm:px-8 sm:py-8">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Cost of the journey
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Amount
                  </span>
                </div>

                <table className="w-full border-collapse">
                  <caption className="sr-only">{LEDGER.caption}</caption>
                  <tbody>
                    {LEDGER.lines.map((l) => (
                      <tr key={l.label} className="border-b border-white/[0.09]">
                        <th
                          scope="row"
                          className="py-3.5 pr-4 text-left align-baseline font-normal"
                        >
                          <span
                            className={`text-[15px] ${
                              l.primary ? 'font-semibold text-white' : 'text-white/75'
                            }`}
                          >
                            {l.label}
                          </span>
                          {/* Secondary detail — dropped on narrow screens, where
                              it orphans onto its own line and reads as noise. */}
                          {l.note && (
                            <span className="ml-2 hidden font-mono text-[10.5px] text-white/35 sm:inline">
                              {l.note}
                            </span>
                          )}
                        </th>
                        <td
                          className={`py-3.5 text-right align-baseline font-mono text-[14.5px] ${
                            l.primary ? 'text-white' : 'text-white/70'
                          }`}
                        >
                          {inr(l.amount)}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <th scope="row" className="pt-5 text-left align-baseline">
                        <span className="font-display text-[16px] font-bold tracking-tight text-white">
                          Total
                        </span>
                      </th>
                      <td className="pt-5 text-right align-baseline">
                        <span className="font-mono text-[22px] font-semibold text-brand-bright">
                          {inr(total)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* The ratio is the whole argument, so it gets stated once, plainly. */}
                <p className="mt-6 border-t border-white/15 pt-5 text-[14px] leading-relaxed text-white/60">
                  The course fee is{' '}
                  <span className="font-mono text-brand-bright">{tuitionShare}%</span> of it.
                  Families budget for that line and meet the other six as they arrive.
                </p>
              </div>

              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                {LEDGER.caption} · illustrative figures, not a quote
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
