import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HERO_VARIANTS, ACTIVE_HERO, NOISE } from '../content/home'
import { SURVEY_PATH } from '../content/site'

/**
 * The signature.
 *
 * Everything a young person is holding at once, set dense and small — and one
 * line resolving out of it. §3 is that students have more information than
 * ever and less direction than ever; §26 is that Orbitaly wins by being where
 * you go when the question is "what should I do next?". So the hero shows the
 * thesis rather than asserting it.
 */
function NoiseField() {
  const reduce = useReducedMotion()
  const resolvedIndex = NOISE.findIndex((n) => typeof n === 'object')

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-sm bg-brand-deep px-7 py-9 sm:px-9 sm:py-11"
        role="img"
        aria-label="A dense field of the questions students face, with one resolved into a next step"
      >
        {/* A single faint arc — the orbit in the name, used as structure rather
            than as a decorative blob. */}
        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-[420px] w-[420px] text-white/[0.07]"
        >
          <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          What you're holding right now
        </p>

        <ul className="relative mt-6 flex flex-col gap-[7px]">
          {NOISE.map((item, i) => {
            const isResolved = typeof item === 'object'
            const text = isResolved ? item.text : item

            if (isResolved) {
              return (
                <li key={text} className="my-3">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: reduce ? 0 : 1.15 }}
                    className="flex items-center gap-4 border-y border-brand-bright/35 bg-brand-bright/[0.09] px-4 py-4"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-bright">
                      Next
                    </span>
                    <span className="font-display text-[17px] font-semibold tracking-tight text-white sm:text-[19px]">
                      {text}
                    </span>
                  </motion.div>
                </li>
              )
            }

            return (
              <motion.li
                key={text}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: reduce ? 0 : 0.15 + i * 0.028,
                }}
                className="font-mono text-[12px] leading-snug text-white/30"
              >
                {text}
              </motion.li>
            )
          })}
        </ul>

        {/* The resolved line is the point, so the field below it dims toward
            the edge rather than running to a hard stop. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-deep to-transparent"
          aria-hidden="true"
        />
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
        Illustrative · {NOISE.length - 1} of the questions we hear
      </p>

      {/* Screen readers get the list as text; the index above is decorative. */}
      <span className="sr-only">
        Resolved next step: {NOISE[resolvedIndex].text}
      </span>
    </div>
  )
}

export default function Hero() {
  const v = HERO_VARIANTS[ACTIVE_HERO]

  return (
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-[1240px] items-center gap-x-20 gap-y-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-32 lg:pt-40">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            {v.eyebrow}
          </p>

          <h1 className="mt-7 max-w-[15ch] font-display text-[2.5rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
            {v.headline}
            <br />
            <span className="text-brand">{v.headlineAccent}</span>
          </h1>

          <p className="mt-8 max-w-[46ch] text-[17px] leading-[1.65] text-ink-2">{v.sub}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to={SURVEY_PATH}
              className="group inline-flex items-center gap-2.5 rounded-sm bg-brand px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              Take the student survey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#roadmap"
              className="inline-flex items-center rounded-sm border border-rule px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-paper-2"
            >
              What we're building
            </a>
          </div>

          <p className="mt-8 max-w-[44ch] border-l-2 border-rule pl-4 text-[13.5px] leading-relaxed text-ink-3">
            Orbitaly is being built now. The research is open, and it decides what ships
            first — so the survey is not a waiting list, it's the input.
          </p>
        </div>

        <NoiseField />
      </div>
    </section>
  )
}
