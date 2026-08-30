/**
 * Answer controls. Every one wraps a real <input> so keyboard navigation,
 * arrow-key movement within a radio group and screen-reader semantics come for
 * free — the visible box is styled off the input's `peer` state.
 */

const base =
  'group relative flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 select-none'

const resting = 'border-ink/10 bg-white hover:border-ink/25 hover:bg-ink/[0.02]'
const chosen = 'border-ink bg-ink/[0.035] shadow-[0_1px_2px_rgba(15,14,26,0.06)]'
const capped = 'cursor-not-allowed border-ink/[0.07] bg-ink/[0.015] opacity-45'

export function OptionButton({ type, name, value, label, checked, disabled, onChange }) {
  return (
    <label className={`${base} ${checked ? chosen : disabled ? capped : resting}`}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled && !checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />

      {/* Radios read as circles, checkboxes as squares — the shape is the only
          cue that a question takes more than one answer once options are picked. */}
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
          type === 'radio' ? 'rounded-full' : 'rounded-[5px]'
        } ${checked ? 'border-ink bg-ink' : 'border-ink/25 bg-white group-hover:border-ink/40'}`}
      >
        {checked &&
          (type === 'radio' ? (
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
              <path
                d="M2.5 6.2 4.8 8.5 9.5 3.8"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
      </span>

      <span className={`text-[15px] leading-snug ${checked ? 'font-medium text-ink' : 'text-ink/75'}`}>
        {label}
      </span>

      {/* The focus ring lives on the box, not the hidden input. */}
      <span className="pointer-events-none absolute -inset-px rounded-xl ring-orbit-400 peer-focus-visible:ring-2" />
    </label>
  )
}

export function OtherText({ id, value, placeholder, onChange }) {
  return (
    <input
      id={id}
      type="text"
      value={value ?? ''}
      placeholder={placeholder ?? 'Tell us more'}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
    />
  )
}

export function ScaleControl({ name, scale, value, onChange }) {
  const points = []
  for (let n = scale.min; n <= scale.max; n += 1) points.push(n)

  return (
    <div>
      <div className="flex gap-2">
        {points.map((n) => {
          const checked = String(value) === String(n)
          return (
            <label
              key={n}
              className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-xl border py-4 text-[17px] font-semibold transition-all duration-150 ${
                checked
                  ? 'border-ink bg-ink text-white'
                  : 'border-ink/10 bg-white text-ink/55 hover:border-ink/25 hover:bg-ink/[0.02]'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={checked}
                onChange={() => onChange(String(n))}
                className="peer sr-only"
              />
              {n}
              <span className="pointer-events-none absolute -inset-px rounded-xl ring-orbit-400 peer-focus-visible:ring-2" />
            </label>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-ink/45">
        <span>{scale.minLabel}</span>
        <span>{scale.maxLabel}</span>
      </div>
    </div>
  )
}

export function TextField({ id, label, hint, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[16px] text-ink placeholder:text-ink/30 focus:outline-none ${
          error ? 'border-red-400 focus:border-red-500' : 'border-ink/15 focus:border-ink'
        }`}
        {...props}
      />
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-sm text-ink/45">{hint}</p>
      ) : null}
    </div>
  )
}
