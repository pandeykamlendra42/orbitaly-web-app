import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui'
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from '../content/privacy'

// The policy text is plain strings, so emails and our own URLs are linked here
// rather than hand-marked in the copy. On-site URLs stay inside the router.
const LINKABLE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+|https:\/\/orbitaly\.in[^\s,]*?(?=\.?(?:\s|$)))/g

function Linked({ text }) {
  return text.split(LINKABLE).map((part, i) => {
    if (i % 2 === 0) return part
    const cls = 'text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand'
    if (part.includes('@')) {
      return (
        <a key={i} href={`mailto:${part.toLowerCase()}`} className={cls}>
          {part}
        </a>
      )
    }
    const path = part.replace('https://orbitaly.in', '') || '/'
    return (
      <Link key={i} to={path} className={cls}>
        {part}
      </Link>
    )
  })
}

function Block({ block }) {
  if (block.h3) {
    return (
      <h3 className="mt-8 font-display text-[17px] font-bold tracking-[-0.02em] text-ink first:mt-0">
        {block.h3}
      </h3>
    )
  }
  if (block.list) {
    return (
      <ul className="mt-4 list-disc space-y-2.5 pl-5 marker:text-brand">
        {block.list.map((item, i) => {
          const [label, text] = Array.isArray(item) ? item : [null, item]
          return (
            <li key={i} className="pl-1">
              {label && <strong className="font-semibold text-ink">{label}</strong>}
              {label && ' '}
              <Linked text={text} />
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <p className="mt-4 first:mt-0">
      <Linked text={block.p} />
    </p>
  )
}

export default function Privacy() {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-[1240px] px-6 pb-28 pt-32 lg:px-10 lg:pt-40">
        <Reveal>
          <div className="max-w-[52ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
              Privacy policy
            </p>
            <h1 className="mt-6 font-display text-[2.4rem] font-bold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.1rem]">
              How Orbitaly handles your personal data.
            </h1>
            <dl className="mt-7 space-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
              <div>
                <dt className="inline">Effective date: </dt>
                <dd className="inline">{PRIVACY_EFFECTIVE_DATE}</dd>
              </div>
              <div>
                <dt className="inline">Last updated: </dt>
                <dd className="inline">{PRIVACY_LAST_UPDATED}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-ink pt-10 lg:grid-cols-[26ch_1fr]">
          <nav aria-label="Policy sections" className="hidden lg:block">
            <ol className="sticky top-28 space-y-2 font-mono text-[10.5px] uppercase leading-[1.5] tracking-[0.12em]">
              {PRIVACY_SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink-2 transition-colors hover:text-brand">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[72ch]">
            {PRIVACY_SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 border-b border-rule py-10 first:pt-0"
              >
                <h2 className="font-display text-[21px] font-bold tracking-[-0.025em] text-ink">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-5 text-[16px] leading-[1.75] text-ink-2">
                  {s.blocks.map((b, j) => (
                    <Block key={j} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
