import { OptionButton, OtherText, ScaleControl } from './controls'
import { asMulti, isOptionCapped, resolveOptions, toggleMulti } from '../lib/engine'

/** Short labels tile two-up on wider screens; long ones stay a single column. */
function useColumns(options) {
  const longest = options.reduce((n, o) => Math.max(n, o.label.length), 0)
  return options.length >= 4 && longest <= 30 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
}

export default function QuestionCard({ question, survey, answers, texts, error, onAnswer, onText }) {
  const value = answers[question.id]
  const options = resolveOptions(question, answers, survey)
  const isMulti = question.type === 'multi'
  const selected = isMulti ? asMulti(value) : []

  const typeLabel = isMulti
    ? question.maxSelections
      ? `Select up to ${question.maxSelections} · ${selected.length}/${question.maxSelections}`
      : 'Select all that apply'
    : question.type === 'scale'
      ? 'Rate 1 to 5'
      : 'Select one'

  const handlePick = (optionValue) => {
    if (isMulti) {
      onAnswer(question.id, toggleMulti(question, options, value, optionValue))
    } else {
      onAnswer(question.id, optionValue)
    }
  }

  return (
    <section
      id={`q-${question.id}`}
      aria-labelledby={`label-${question.id}`}
      className="scroll-mt-28 border-t border-ink/[0.07] py-8 first:border-t-0 first:pt-0"
    >
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="font-mono text-xs tabular-nums text-ink/35">
            {String(question.number).padStart(2, '0')}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${
              isMulti ? 'bg-orbit-50 text-orbit-700' : 'bg-ink/[0.05] text-ink/50'
            }`}
          >
            {typeLabel}
          </span>
        </div>

        <h3 id={`label-${question.id}`} className="text-[17px] font-semibold leading-snug text-ink sm:text-lg">
          {question.text}
        </h3>

        {question.helpText && <p className="mt-1.5 text-sm text-ink/50">{question.helpText}</p>}
      </div>

      {question.type === 'scale' ? (
        <ScaleControl
          name={question.id}
          scale={question.scale}
          value={value}
          onChange={(v) => onAnswer(question.id, v)}
        />
      ) : options.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 bg-ink/[0.015] px-4 py-5 text-sm text-ink/45">
          {question.optionsFromEmptyHint ?? 'No options available yet.'}
        </p>
      ) : (
        <div role={isMulti ? 'group' : 'radiogroup'} aria-labelledby={`label-${question.id}`}>
          <div className={`grid grid-cols-1 gap-2.5 ${useColumns(options)}`}>
            {options.map((option) => {
              const checked = isMulti ? selected.includes(option.value) : value === option.value
              return (
                <div key={option.value} className={option.allowsText && checked ? 'sm:col-span-full' : undefined}>
                  <OptionButton
                    type={isMulti ? 'checkbox' : 'radio'}
                    name={question.id}
                    value={option.value}
                    label={option.label}
                    checked={checked}
                    disabled={isOptionCapped(question, value, option.value)}
                    onChange={handlePick}
                  />
                  {option.allowsText && checked && (
                    <OtherText
                      id={`${question.id}-${option.value}-text`}
                      value={texts[`${question.id}:${option.value}`]}
                      placeholder={option.textPlaceholder}
                      onChange={(text) => onText(`${question.id}:${option.value}`, text)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </section>
  )
}
