import { Reveal, SectionHead } from '../components/ui'
import StatusLabel from '../components/StatusLabel'
import { OVERSEAS_STEPS } from '../content/home'

export default function Overseas() {
  return (
    <section className="border-b border-rule bg-paper-2 py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index={5}
              eyebrow="Overseas"
              title="India or abroad? Don't start with a university list."
              lede="Start with the life you want after it. Studying abroad isn't a filter on a college search — it's a decision with a career, a cost and a funding plan attached, and it deserves the whole sequence."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <StatusLabel state="building" className="mb-2" />
          </Reveal>
        </div>

        {/* A real sequence — each step depends on the one before it — so the
            numbering carries information the reader needs. */}
        <ol className="mt-16 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {OVERSEAS_STEPS.map((s, i) => (
            <Reveal key={s} delay={i * 0.05}>
              <li className="flex h-full items-baseline gap-5 bg-paper px-6 py-7">
                <span className="font-mono text-[11px] text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">
                  {s}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <p className="mt-8 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-3">
            Accommodation, travel and forex come later, through partners who already do them
            well. We're not going to build a travel agency.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
