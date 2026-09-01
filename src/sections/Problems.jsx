import { Reveal, SectionHead } from '../components/ui'
import { PROBLEMS } from '../content/home'

export default function Problems() {
  return (
    <section className="border-b border-rule bg-paper-2 py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <SectionHead
            index={1}
            eyebrow="The problem"
            title="More information than ever. Less direction than ever."
            lede="Every one of these has an answer. They're just scattered across counsellors, portals, agents, coaching centres and whichever relative spoke last."
          />
        </Reveal>

        {/* An index of questions, with the life stage in the gutter — the stage
            is what makes the question answerable, so it belongs beside it. */}
        <ul className="mt-16 border-t border-rule">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.q} delay={i * 0.04}>
              <li className="grid grid-cols-1 gap-2 border-b border-rule py-6 sm:grid-cols-[15ch_1fr] sm:items-baseline sm:gap-8 lg:grid-cols-[22ch_1fr]">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                  {p.who}
                </span>
                <span className="font-display text-[20px] font-semibold tracking-[-0.02em] text-ink sm:text-[23px]">
                  {p.q}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
