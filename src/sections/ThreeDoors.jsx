import { ArrowRight } from 'lucide-react'
import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import EnquiryForm from '../components/EnquiryForm'
import { LEADS_ENABLED } from '../lib/leads'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '../content/site'

/* Replaces the single "Partner With Us" button that was the only call to
   action on the old site, and pointed at an empty mailto. Three audiences —
   the student door was the survey while it ran; now it's the shared inbox. */
export default function ThreeDoors() {
  return (
    <section id="contact" className="scroll-mt-20 border-b border-rule bg-paper py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <SectionHead index={8} eyebrow="Get involved" title="Three ways in." />
        </Reveal>

        <div className="mt-16 grid gap-px border border-rule bg-rule lg:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col bg-brand p-8 lg:p-9">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60">
                Students &amp; parents
              </span>

              <h3 className="mt-6 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                Tell us what you're actually stuck on.
              </h3>

              <p className="mt-4 flex-1 text-[15px] leading-[1.65] text-white/70">
                The student survey has closed and the responses are being worked through.
                If you have a question, a story, or criticism, write to us — honest
                criticism is more useful to us than polite approval.
              </p>

              <a
                href={CONTACT_MAILTO}
                className="group mt-8 inline-flex items-center justify-between gap-3 rounded-sm bg-white px-6 py-4 text-[15px] font-semibold text-brand transition-colors hover:bg-paper-2"
              >
                Get in touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col bg-paper p-8 lg:p-9">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
                  Counsellors
                </span>
                <StatusLabel state="partners" />
              </div>

              <h3 className="mt-6 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
                Get students who match what you do.
              </h3>

              <p className="mt-4 flex-1 text-[15px] leading-[1.65] text-ink-2">
                Career, admissions and country specialists. Matched students with their
                context, instead of leads you have to qualify yourself.
              </p>

              <a
                href="#experts"
                className="mt-8 inline-flex items-center justify-between gap-3 rounded-sm border border-ink px-6 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Join the network
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex h-full flex-col bg-paper p-8 lg:p-9">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
                Institutions &amp; partners
              </span>

              <h3 className="mt-6 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
                Reach students at the point they're deciding.
              </h3>

              <p className="mt-4 flex-1 text-[15px] leading-[1.65] text-ink-2">
                Universities, lenders, employers and brands.
              </p>

              <div className="mt-8">
                {LEADS_ENABLED ? (
                  <EnquiryForm kind="partner" submitLabel="Start a conversation" />
                ) : CONTACT_EMAIL ? (
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Orbitaly%20partnership%20enquiry`}
                    className="inline-flex items-center justify-between gap-3 rounded-sm border border-ink px-6 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    Email the team
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="border-t border-rule pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                    Enquiries open shortly
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
