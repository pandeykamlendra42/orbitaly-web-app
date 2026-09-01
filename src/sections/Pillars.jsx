import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import { PILLARS } from '../content/home'

/* Learn → Earn → Grow is one journey, not three parallel products, so the
   three stations share a single rule and are numbered along it. Cards would
   have said "pick one"; a rule says "this is the order". */
export default function Pillars() {
  return (
    <section className="border-b border-rule bg-paper py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <SectionHead
            index={2}
            eyebrow="The journey"
            title="Learn what fits you. Earn from what you can do. Grow into what you want to become."
          />
        </Reveal>

        <div className="mt-16">
          <div className="hidden h-px w-full bg-rule lg:block" />

          <div className="grid gap-x-10 gap-y-14 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div id={p.id} className="scroll-mt-28 lg:pr-6">
                  <div className="relative flex items-center gap-4 lg:-mt-[9px]">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-brand bg-paper">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    </span>
                    <span className="font-display text-[15px] font-bold uppercase tracking-[0.1em] text-brand">
                      {p.tag}
                    </span>
                    <StatusLabel state={p.state} className="ml-auto" />
                  </div>

                  <h3 className="mt-6 max-w-[22ch] font-display text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
                    {p.title}
                  </h3>

                  <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.65] text-ink-2">
                    {p.body}
                  </p>

                  <ul className="mt-7 border-t border-rule-2">
                    {p.items.map((it) => (
                      <li
                        key={it}
                        className="border-b border-rule-2 py-2.5 text-[14px] text-ink-2"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="mt-16 max-w-[62ch] border-l-2 border-brand pl-5 text-[15px] leading-[1.7] text-ink-2">
            We don't manufacture all of this ourselves. Counsellors counsel, institutions
            teach, employers hire, regulated partners lend. Orbitaly's job is to understand
            where you are, connect you to the right one, and be straight with you about how
            that connection works.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
