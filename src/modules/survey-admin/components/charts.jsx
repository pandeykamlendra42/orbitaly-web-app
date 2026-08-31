import { useId, useState } from 'react'
import { formatCount, formatPercent } from '../lib/format'

/**
 * Chart primitives.
 *
 * Every chart here plots ONE series, so none carries a legend — the panel title
 * names what is plotted. Colour does the "magnitude" job throughout, which means
 * a single hue, never a categorical set.
 *
 * The sequential ramp below was validated with the dataviz skill's checker
 * (ordinal mode, white surface): monotone lightness, adjacent ΔL ≥ 0.06, light
 * end 2.13:1 against the surface, hue spread 2°. Don't lighten the first step —
 * #a5b4fc and anything above it fall under the 2:1 floor and vanish on white.
 */
export const ACCENT = '#4f46e5'
export const RAMP = ['#9fadfb', '#818cf8', '#6366f1', '#4f46e5', '#3730a3']

/** Bucket a 0..1 fraction onto the ramp. */
export function rampStep(fraction) {
  if (!Number.isFinite(fraction) || fraction <= 0) return null
  const index = Math.min(RAMP.length - 1, Math.floor(fraction * RAMP.length))
  return RAMP[index]
}

export function Panel({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-ink/[0.09] bg-white ${className}`}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-ink/[0.07] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            {subtitle && <p className="mt-1 text-xs leading-relaxed text-ink/50">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

/** A headline number. Not a one-bar bar chart. */
export function StatTile({ label, value, hint, tone = 'default' }) {
  const toneClass = {
    default: 'text-ink',
    warning: 'text-amber-600',
    muted: 'text-ink/45',
  }[tone]

  return (
    <div className="rounded-xl border border-ink/[0.09] bg-white px-5 py-4">
      <p className="text-xs font-medium text-ink/50">{label}</p>
      <p className={`mt-2 font-mono text-[28px] font-semibold leading-none tabular-nums ${toneClass}`}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-ink/40">{hint}</p>}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 bg-ink/[0.015] px-5 py-8 text-center">
      <p className="text-sm font-medium text-ink/65">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink/45">{children}</div>}
    </div>
  )
}

/**
 * Horizontal bars for ranked magnitude. Bars are capped at 24px, squared at the
 * baseline and rounded at the data end, with the value at the tip.
 */
export function BarList({ items, total, valueFormat = formatCount, emptyLabel = 'No data' }) {
  if (!items?.length) return <EmptyState title={emptyLabel} />

  const max = Math.max(...items.map((i) => i.value), 0)

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const width = max > 0 ? (item.value / max) * 100 : 0
        const share = total > 0 ? (item.value / total) * 100 : null
        return (
          <li key={item.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <span className="text-[13px] leading-snug text-ink/75">{item.label}</span>
              <span className="shrink-0 font-mono text-[13px] tabular-nums text-ink">
                {valueFormat(item.value)}
                {item.percent != null && (
                  <span className="ml-2 text-ink/40">{formatPercent(item.percent)}</span>
                )}
                {item.percent == null && share != null && (
                  <span className="ml-2 text-ink/40">{formatPercent(share)}</span>
                )}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-sm bg-ink/[0.05]">
              <div
                className="h-full rounded-r-[4px]"
                style={{ width: `${width}%`, background: item.color ?? ACCENT }}
                title={`${item.label}: ${valueFormat(item.value)}`}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Daily volume. A single series over time → area + 2px line, one hue, no legend.
 * Hover gives a crosshair and a tooltip rather than labelling every point.
 */
export function VolumeChart({ points, height = 190 }) {
  const gradientId = useId()
  const [hover, setHover] = useState(null)

  if (!points?.length) {
    return <EmptyState title="No responses in this window yet." />
  }

  const width = 720
  const padding = { top: 12, right: 12, bottom: 26, left: 40 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const max = Math.max(...points.map((p) => p.count), 1)
  // Round the axis top to something clean rather than the raw max.
  const step = max <= 10 ? 2 : max <= 50 ? 10 : max <= 200 ? 50 : 100
  const axisTop = Math.ceil(max / step) * step

  const x = (i) => padding.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW)
  const y = (v) => padding.top + plotH - (v / axisTop) * plotH

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.count)}`).join(' ')
  const area = `${line} L ${x(points.length - 1)} ${padding.top + plotH} L ${x(0)} ${padding.top + plotH} Z`

  const ticks = [0, axisTop / 2, axisTop]

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`Daily responses, ${points.length} days`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.16" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#0f0e1a"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <text x={padding.left - 8} y={y(t) + 4} textAnchor="end" className="fill-ink/40 text-[10px]">
              {formatCount(t)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={p.day}>
            {/* Hit target far larger than the mark. */}
            <rect
              x={x(i) - plotW / (points.length * 2 || 1) - 6}
              y={padding.top}
              width={plotW / (points.length || 1) + 12}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover({ ...p, i })}
            />
            {hover?.i === i && (
              <line
                x1={x(i)}
                x2={x(i)}
                y1={padding.top}
                y2={padding.top + plotH}
                stroke={ACCENT}
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            )}
            <circle
              cx={x(i)}
              cy={y(p.count)}
              r={hover?.i === i ? 5 : 3.5}
              fill={ACCENT}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Label the ends only — never a number on every point. */}
        <text x={padding.left} y={height - 8} className="fill-ink/40 text-[10px]">
          {points[0].label}
        </text>
        {points.length > 1 && (
          <text x={width - padding.right} y={height - 8} textAnchor="end" className="fill-ink/40 text-[10px]">
            {points[points.length - 1].label}
          </text>
        )}
      </svg>

      {hover && (
        <div className="pointer-events-none absolute left-0 top-0 rounded-lg border border-ink/10 bg-white px-3 py-2 text-xs shadow-lg">
          <div className="font-medium text-ink">{hover.label}</div>
          <div className="mt-0.5 font-mono tabular-nums text-ink/60">
            {formatCount(hover.count)} response{hover.count === 1 ? '' : 's'}
          </div>
        </div>
      )}
    </div>
  )
}
