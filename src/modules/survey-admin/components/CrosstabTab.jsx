import { EmptyState, Panel, RAMP } from './charts'
import { formatCount, formatPercent } from '../lib/format'

/**
 * Cross-tab as a heatmap: a grid comparing magnitude, so one sequential hue.
 *
 * Two API facts drive the code: only choice questions are accepted (a scale or
 * text pair returns VALIDATION_FAILED, so the pickers exclude them), and cells
 * may be absent from `counts` entirely — absent means zero.
 */
export default function CrosstabTab({
  questions,
  rowKey,
  columnKey,
  crosstab,
  loading,
  error,
  onChange,
}) {
  const labelFor = (key) => questions.find((q) => q.id === key)?.text ?? key
  const optionLabels = (key) => {
    const q = questions.find((x) => x.id === key)
    return new Map((q?.options ?? []).map((o) => [o.value, o.label]))
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Cross-tab"
        subtitle="Choice questions only — scale and free-text questions are rejected by the API."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Picker
            label="Rows"
            value={rowKey}
            questions={questions}
            onChange={(v) => onChange({ rowKey: v, columnKey })}
          />
          <Picker
            label="Columns"
            value={columnKey}
            questions={questions}
            onChange={(v) => onChange({ rowKey, columnKey: v })}
          />
        </div>
      </Panel>

      {loading && <Panel title="Loading…"><div className="h-40" /></Panel>}

      {error && !loading && (
        <Panel title="Couldn't build that cross-tab">
          <EmptyState title={error.message}>
            <p className="font-mono text-[11px]">{error.code}</p>
          </EmptyState>
        </Panel>
      )}

      {crosstab && !loading && !error && (
        <Matrix
          crosstab={crosstab}
          rowTitle={labelFor(crosstab.rowQuestion)}
          columnTitle={labelFor(crosstab.columnQuestion)}
          rowLabels={optionLabels(crosstab.rowQuestion)}
          columnLabels={optionLabels(crosstab.columnQuestion)}
        />
      )}
    </div>
  )
}

function Picker({ label, value, questions, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink/50">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      >
        <option value="">Select a question…</option>
        {questions.map((q) => (
          <option key={q.id} value={q.id}>
            Q{q.number} · {q.text.slice(0, 60)}
            {q.text.length > 60 ? '…' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

function Matrix({ crosstab, rowTitle, columnTitle, rowLabels, columnLabels }) {
  const { rowValues = [], columnValues = [], counts = {} } = crosstab

  // Absent cells are zero, not missing data.
  const cell = (r, c) => counts?.[r]?.[c] ?? 0

  const rowTotals = Object.fromEntries(
    rowValues.map((r) => [r, columnValues.reduce((sum, c) => sum + cell(r, c), 0)]),
  )
  const columnTotals = Object.fromEntries(
    columnValues.map((c) => [c, rowValues.reduce((sum, r) => sum + cell(r, c), 0)]),
  )
  const grand = Object.values(rowTotals).reduce((a, b) => a + b, 0)
  const max = Math.max(...rowValues.flatMap((r) => columnValues.map((c) => cell(r, c))), 0)

  if (grand === 0) return <EmptyState title="No overlapping responses for that pair yet." />

  return (
    <Panel
      title={`${rowTitle} × ${columnTitle}`}
      subtitle={`${formatCount(grand)} responses. Shading is the cell count; the percentage is the share of that row.`}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-xs font-medium text-ink/45">
                {rowTitle.slice(0, 28)}
              </th>
              {columnValues.map((c) => (
                <th key={c} className="px-3 py-2 text-center text-xs font-medium text-ink/60">
                  {/* Capped so one long option label ("Only if bundled with
                      something else") can't stretch its column past the rest. */}
                  <div className="mx-auto max-w-[110px] leading-snug">{columnLabels.get(c) ?? c}</div>
                </th>
              ))}
              <th className="px-3 py-2 text-right text-xs font-medium text-ink/45">Total</th>
            </tr>
          </thead>
          <tbody>
            {rowValues.map((r) => (
              <tr key={r}>
                <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-[13px] font-medium text-ink/75">
                  {rowLabels.get(r) ?? r}
                </th>
                {columnValues.map((c) => {
                  const value = cell(r, c)
                  const intensity = max > 0 ? value / max : 0
                  // Step index by intensity; zero cells stay on the surface so
                  // "none" reads as absence rather than as the palest step.
                  const stepIndex = value === 0 ? -1 : Math.min(RAMP.length - 1, Math.floor(intensity * RAMP.length))
                  const background = stepIndex < 0 ? 'transparent' : RAMP[stepIndex]
                  const dark = stepIndex >= 2
                  const rowShare = rowTotals[r] > 0 ? (value / rowTotals[r]) * 100 : 0

                  return (
                    <td key={c} className="p-0.5">
                      <div
                        className="rounded-md px-3 py-2.5 text-center"
                        style={{ background }}
                        title={`${rowLabels.get(r) ?? r} × ${columnLabels.get(c) ?? c}: ${formatCount(value)} (${formatPercent(rowShare)} of row)`}
                      >
                        <div
                          className={`font-mono text-[13px] font-medium tabular-nums ${
                            dark ? 'text-white' : value === 0 ? 'text-ink/25' : 'text-ink'
                          }`}
                        >
                          {formatCount(value)}
                        </div>
                        <div className={`font-mono text-[10px] tabular-nums ${dark ? 'text-white/65' : 'text-ink/40'}`}>
                          {value === 0 ? '—' : formatPercent(rowShare, { digits: 0 })}
                        </div>
                      </div>
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums text-ink/60">
                  {formatCount(rowTotals[r])}
                </td>
              </tr>
            ))}
            <tr className="border-t border-ink/[0.07]">
              <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-xs font-medium text-ink/45">
                Total
              </th>
              {columnValues.map((c) => (
                <td key={c} className="px-3 py-2 text-center font-mono text-[13px] tabular-nums text-ink/60">
                  {formatCount(columnTotals[c])}
                </td>
              ))}
              <td className="px-3 py-2 text-right font-mono text-[13px] font-semibold tabular-nums text-ink">
                {formatCount(grand)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
