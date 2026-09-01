import { Link } from 'react-router-dom'
import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import EnquiryForm from '../components/EnquiryForm'
import { EXPERT_SIGNALS } from '../content/home'
import { LEADS_ENABLED } from '../lib/leads'
import { SURVEY_PATH } from '../content/site'

export default function ExpertNetwork() {
  return (
    <section id="experts" className="scroll-mt-20 border-b border-rule bg-paper py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-x-20 gap-y-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <SectionHead
                index={4}
                eyebrow="Expert Network"
                title="The right counsellor depends on your course, country, profile and goal."
                lede="Not a directory you scroll. Two or three verified experts matched to your situation, with the reason for the match written down — and every commercial relationship on the table before you book anything."
              />
            </Reveal>

            {/* A specification, because that is what a family is actually asking
                for: what will I be told about this person before I pay them. */}
            <Reveal delay={0.08}>
              <dl className="mt-14 border-t border-rule">
                {EXPERT_SIGNALS.map(([term, detail]) => (
                  <div
                    key={term}
                    className="grid grid-cols-1 gap-1 border-b border-rule py-4 sm:grid-cols-[16ch_1fr] sm:gap-8"
                  >
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand">
                      {term}
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-ink-2">{detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="bg-paper-2 p-7 ring-1 ring-rule sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
                  For counsellors
                </span>
                <StatusLabel state="partners" />
              </div>

              <h3 className="mt-5 font-display text-[24px] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
                We're onboarding the first counsellors now.
              </h3>

              <p className="mt-4 text-[15px] leading-[1.65] text-ink-2">
                Career counsellors, admissions specialists and country experts. You get
                students who match what you actually do, with their context before the first
                conversation — not a list of cold numbers.
              </p>

              <div className="mt-8">
                {LEADS_ENABLED ? (
                  <EnquiryForm kind="counsellor" submitLabel="Register interest" />
                ) : (
                  <div className="border-t border-rule pt-6">
                    <p className="text-[14.5px] leading-[1.65] text-ink-2">
                      Registration opens shortly. In the meantime, the student research is
                      what shapes the network — including how counsellors get matched and
                      what students say they would pay for.
                    </p>
                    <Link
                      to={SURVEY_PATH}
                      className="mt-5 inline-flex rounded-sm border border-ink px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                    >
                      See the research
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
