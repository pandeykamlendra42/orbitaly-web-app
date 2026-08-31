import { useState } from 'react'
import { Eye, EyeOff, Info } from 'lucide-react'
import { EmptyState, Panel } from './charts'
import { dateTimeLabel, formatCount, maskMobile, relativeTime } from '../lib/format'

export default function AbuseTab({ rows, params, loading, error, onParams }) {
  const [revealed, setRevealed] = useState(() => new Set())
  const toggle = (m) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(m) ? next.delete(m) : next.add(m)
      return next
    })

  return (
    <div className="space-y-5">
      {/* The API takes surveyKey in the path but does not filter on it. Saying so
          here stops someone reading these numbers as survey-specific. */}
      <div className="flex items-start gap-2.5 rounded-xl border border-orbit-200 bg-orbit-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-orbit-600" />
        <p className="text-xs leading-relaxed text-orbit-900">
          These counts are <strong>global across every survey</strong>, not just this one — the API
          accepts a survey key in the path but ignores it when querying. Harmless while one survey is
          live; worth wiring the filter through before a second one launches.
        </p>
      </div>

      <Panel
        title="OTP request volume by number"
        subtitle="Numbers that requested more codes than expected. High requests with zero verifications is the pattern worth looking at."
        actions={
          <div className="flex shrink-0 gap-2">
            <NumberInput
              label="Hours"
              value={params.hours}
              onChange={(hours) => onParams({ ...params, hours })}
            />
            <NumberInput
              label="Min requests"
              value={params.minRequests}
              onChange={(minRequests) => onParams({ ...params, minRequests })}
            />
          </div>
        }
      >
        {loading ? (
          <div className="h-32" />
        ) : error ? (
          <EmptyState title={error.message}>
            <p className="font-mono text-[11px]">{error.code}</p>
          </EmptyState>
        ) : !rows?.length ? (
          <EmptyState title="Nothing above the threshold.">
            <p>
              No number requested {params.minRequests} or more codes in the last {params.hours} hours.
            </p>
          </EmptyState>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/[0.07] text-left text-xs font-medium text-ink/45">
                <th className="pb-2 font-medium">Mobile</th>
                <th className="pb-2 text-right font-medium">Requests</th>
                <th className="pb-2 text-right font-medium">Verified</th>
                <th className="pb-2 text-right font-medium">Last request</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const show = revealed.has(row.mobile)
                const suspicious = row.verified === 0 && row.requests >= 5
                return (
                  <tr key={row.mobile} className="border-b border-ink/[0.05] last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] text-ink/75">
                          {show ? row.mobile : maskMobile(row.mobile)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggle(row.mobile)}
                          aria-label={show ? 'Hide number' : 'Reveal number'}
                          className="rounded p-1 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/70"
                        >
                          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td
                      className={`py-3 text-right font-mono text-[13px] tabular-nums ${
                        suspicious ? 'font-semibold text-amber-600' : 'text-ink'
                      }`}
                    >
                      {formatCount(row.requests)}
                    </td>
                    <td className="py-3 text-right font-mono text-[13px] tabular-nums text-ink/60">
                      {formatCount(row.verified)}
                    </td>
                    <td className="py-3 text-right text-[13px] text-ink/55" title={dateTimeLabel(row.lastRequest)}>
                      {relativeTime(row.lastRequest)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  )
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium text-ink/45">{label}</span>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="w-16 rounded-lg border border-ink/15 px-2 py-1.5 font-mono text-xs tabular-nums text-ink focus:border-ink focus:outline-none"
      />
    </label>
  )
}
