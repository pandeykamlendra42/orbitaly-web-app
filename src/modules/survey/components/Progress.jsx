import { Check, CloudOff, Loader2 } from 'lucide-react'
import Logo from '../../../components/Logo'

/**
 * Tells the student their work is safe. Quiet by design — this should be
 * reassuring background detail, not a thing that pulls the eye mid-question.
 */
function SaveIndicator({ state }) {
  if (state === 'idle') return null

  const map = {
    saving: { icon: Loader2, text: 'Saving', className: 'text-ink/40', spin: true },
    saved: { icon: Check, text: 'Saved', className: 'text-mint-500' },
    error: { icon: CloudOff, text: 'Not saved', className: 'text-amber-600' },
  }
  const { icon: Icon, text, className, spin } = map[state]

  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${spin ? 'animate-spin' : ''}`} />
      {text}
    </span>
  )
}

/**
 * Sticky survey chrome: a hairline completion bar, the brand mark, and the
 * section rail. The rail is the honest answer to "how much is left" — seven
 * short sections read as far less work than "question 14 of 37".
 */
export default function Progress({ sections, currentIndex, saveState, onJump }) {
  const pct = Math.round(((currentIndex + 1) / sections.length) * 100)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.07] bg-white/85 backdrop-blur-xl">
      <div className="h-[3px] w-full bg-ink/[0.06]">
        <div
          className="h-full bg-ink transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
        <Logo className="h-7 w-auto" />
        <div className="flex items-center gap-3">
          <SaveIndicator state={saveState} />
          <span className="font-mono text-xs tabular-nums text-ink/45">
            Step {currentIndex + 1} / {sections.length}
          </span>
        </div>
      </div>

      <nav aria-label="Survey sections" className="mx-auto max-w-2xl px-5 pb-3">
        <ol className="flex items-center gap-1.5">
          {sections.map((section, i) => {
            const done = i < currentIndex
            const active = i === currentIndex
            return (
              <li key={section.id} className="flex-1">
                <button
                  type="button"
                  // Only backwards — jumping ahead would skip validation.
                  disabled={i >= currentIndex}
                  onClick={() => onJump(i)}
                  title={`${section.letter}. ${section.title}`}
                  aria-current={active ? 'step' : undefined}
                  className={`flex h-7 w-full items-center justify-center rounded-md text-[11px] font-semibold transition-colors ${
                    active
                      ? 'bg-ink text-white'
                      : done
                        ? 'bg-ink/[0.07] text-ink/60 hover:bg-ink/15'
                        : 'bg-ink/[0.03] text-ink/25'
                  }`}
                >
                  {section.letter}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </header>
  )
}
