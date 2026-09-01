import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import { ROADMAP } from '../content/home'

/**
 * This section exists instead of a traction strip.
 *
 * The comp this replaced opened with "12,400+ students helped · 380+
 * institutions" and a named testimonial about an outcome. None of it is true
 * yet. A status table does the same job honestly — and a company that can
 * state its own order of operations is more convincing to a counsellor or a
 * lender than four invented counters.
 */
export default function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-20 border-b border-rule bg-paper py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <SectionHead
            index={6}
            eyebrow="Where we actually are"
            title="What's live, what's next, and what's just a plan."
            lede="We'd rather show you an honest order of operations than a number we made up. If it isn't built, it says so."
          />
        </Reveal>

        <div className="mt-16 border-t border-ink">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-rule py-7 lg:grid-cols-[19ch_1fr_auto] lg:items-baseline">
                <StatusLabel state={r.state} className="lg:pt-1.5" />

                <div>
                  <h3 className="font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.65] text-ink-2">
                    {r.body}
                  </p>
                </div>

                {r.action ? (
                  <Link
                    to={r.action.to}
                    className="group inline-flex items-center gap-2 justify-self-start rounded-sm bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-deep lg:justify-self-end"
                  >
                    {r.action.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 max-w-[62ch] text-[14px] leading-relaxed text-ink-3">
            Sequencing, not delivery dates. What we build after the planner depends partly on
            what the research says — which is the point of running it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
