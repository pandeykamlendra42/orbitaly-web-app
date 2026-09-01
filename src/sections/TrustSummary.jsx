import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, SectionHead } from '../components/ui'
import { TRUST_POINTS } from '../content/home'

export default function TrustSummary() {
  return (
    <section className="on-navy bg-brand-deep py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <SectionHead
            index={7}
            eyebrow="How this works"
            onNavy
            title="A platform that claims to cut through noise can't quietly add to it."
          />
        </Reveal>

        <dl className="mt-16 border-t border-white/20">
          {TRUST_POINTS.slice(0, 4).map((t, i) => (
            <Reveal key={t.term} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-white/12 py-6 lg:grid-cols-[24ch_1fr]">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-bright">
                  {t.term}
                </dt>
                <dd className="max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
                  {t.detail}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal>
          <Link
            to="/trust"
            className="group mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-bright"
          >
            Read the full position
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
