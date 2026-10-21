import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '../components/ui'
import { TRUST_POINTS } from '../content/home'
import { CONTACT_MAILTO } from '../content/site'

export default function Trust() {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-[1240px] px-6 pb-28 pt-32 lg:px-10 lg:pt-40">
        <Reveal>
          <div className="max-w-[52ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
              Trust &amp; disclosures
            </p>
            <h1 className="mt-6 font-display text-[2.4rem] font-bold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.1rem]">
              How Orbitaly works, and how it makes money.
            </h1>
            <p className="mt-7 text-[17px] leading-[1.7] text-ink-2">
              Orbitaly sits between students and a lot of parties with commercial interests —
              counsellors, universities, lenders, employers, brands. That is the business. It
              only works if you can see how it works, so this page states it plainly and we
              keep it current as things change.
            </p>
          </div>
        </Reveal>

        <dl className="mt-20 border-t border-ink">
          {TRUST_POINTS.map((t, i) => (
            <Reveal key={t.term} delay={i * 0.04}>
              <div className="grid grid-cols-1 gap-x-12 gap-y-3 border-b border-rule py-8 lg:grid-cols-[26ch_1fr]">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand">
                  {t.term}
                </dt>
                <dd className="max-w-[66ch] text-[16px] leading-[1.75] text-ink-2">
                  {t.detail}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal>
          <div className="mt-16 max-w-[68ch] bg-paper-2 p-8 ring-1 ring-rule lg:p-10">
            <h2 className="font-display text-[21px] font-bold tracking-[-0.025em] text-ink">
              What this page doesn't cover yet
            </h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink-2">
              Our{' '}
              <Link to="/privacy-policy" className="text-brand underline underline-offset-2">
                privacy policy
              </Link>{' '}
              sets out how we handle personal data and how to raise a grievance. Our terms of
              use are being drawn up with counsel and will be published here before the first
              product journey opens. If you have taken the student survey and want your
              responses removed, tell us and we'll remove them.
            </p>
            <a
              href={`${CONTACT_MAILTO}?subject=${encodeURIComponent('Remove my survey responses')}`}
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brand"
            >
              Get in touch
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
