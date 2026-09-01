import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HERO_VARIANTS, ACTIVE_HERO, PREVIEW } from '../content/home'
import { SURVEY_PATH } from '../content/site'

/**
 * The product, in one screen.
 *
 * A visitor should understand Orbitaly before reading a word of body copy:
 * it knows where you are, it gives you one next action, and Learn · Earn ·
 * Grow is the shape of what sits behind it. Everything else on the page
 * elaborates on this panel.
 *
 * Marked illustrative — it previews an idea, not a running product.
 */
function Preview() {
  const reduce = useReducedMotion()
  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay },
  })

  return (
    <div>
      <div className="relative overflow-hidden rounded-md bg-brand-deep p-6 shadow-[0_30px_70px_-40px_rgba(10,36,114,0.7)] sm:p-8">
        {/* The orbit in the name, used as structure rather than as a glow. */}
        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] text-white/[0.06]"
        >
          <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Who it's talking to — the personalisation is the premise. */}
        <motion.div {...rise(0.05)} className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Your dashboard
          </p>
          <p className="mt-3 font-display text-[19px] font-bold tracking-[-0.02em] text-white">
            {PREVIEW.who}
          </p>
          <p className="mt-1 text-[13px] text-white/50">{PREVIEW.context}</p>
        </motion.div>

        {/* The single next action. This is the whole proposition, so it is the
            only element on the panel that carries the accent. */}
        <motion.div
          {...rise(0.25)}
          className="relative mt-6 rounded-sm border border-brand-bright/40 bg-brand-bright/[0.09] p-5"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-bright">
            Do this next
          </span>
          <p className="mt-3 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.02em] text-white sm:text-[21px]">
            {PREVIEW.next.label}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/55">
            {PREVIEW.next.reason}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3.5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">
              {PREVIEW.next.meta}
            </span>
            <ArrowRight className="h-4 w-4 text-brand-bright" />
          </div>
        </motion.div>

        {/* And the three pillars, so the model is legible without explanation. */}
        <motion.ul {...rise(0.4)} className="relative mt-6 border-t border-white/12">
          {PREVIEW.queue.map((q) => (
            <li
              key={q.pillar}
              className="flex items-center gap-4 border-b border-white/[0.08] py-3"
            >
              <span className="w-[6ch] shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                {q.pillar}
              </span>
              <span className="flex-1 text-[13.5px] text-white/75">{q.item}</span>
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                {q.state === 'Done' && <Check className="h-3 w-3" />}
                {q.state}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
        Illustrative interface
      </p>
    </div>
  )
}

export default function Hero() {
  const v = HERO_VARIANTS[ACTIVE_HERO]

  return (
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-[1240px] items-center gap-x-20 gap-y-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-36">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            {v.eyebrow}
          </p>

          <h1 className="mt-7 max-w-[15ch] font-display text-[2.5rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
            {v.headline}
            <br />
            <span className="text-brand">{v.headlineAccent}</span>
          </h1>

          <p className="mt-7 max-w-[44ch] text-[18px] leading-[1.6] text-ink-2">{v.sub}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={SURVEY_PATH}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-brand px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep sm:w-auto"
            >
              Take the student survey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#roadmap"
              className="inline-flex w-full items-center justify-center rounded-sm border border-rule px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-paper-2 sm:w-auto"
            >
              What we're building
            </a>
          </div>

          <p className="mt-8 font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-ink-3">
            Being built now · the research decides what ships first
          </p>
        </div>

        <Preview />
      </div>
    </section>
  )
}
