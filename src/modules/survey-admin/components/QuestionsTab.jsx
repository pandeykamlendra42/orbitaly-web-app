import { BarList, EmptyState, Panel, RAMP, StatTile } from './charts'
import { formatCount, formatDecimal, formatPercent } from '../lib/format'

/**
 * Per-question breakdown.
 *
 * Three shape rules from the API, all load-bearing:
 *  - `options` and `numeric` are mutually exclusive and *omitted*, never null.
 *  - `percentOfAnswered` is a share of `answered`, so a multi-select sums past
 *    100% — the header says so rather than leaving it looking like a bug.
 *  - `skipped` (hidden by conditional logic) and `blank` (shown, left empty) are
 *    different facts and are never added together.
 */
export default function QuestionsTab({ questions, selectedKey, stats, loading, error, onSelect }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <Panel title="Questions" className="h-fit lg:sticky lg:top-4">
        <ol className="-mx-2 max-h-[70vh] space-y-0.5 overflow-y-auto">
          {questions.map((q) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(q.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                  selectedKey === q.id ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/[0.04]'
                }`}
              >
                <span
                  className={`mt-0.5 font-mono text-[11px] tabular-nums ${
                    selectedKey === q.id ? 'text-white/50' : 'text-ink/30'
                  }`}
                >
                  {String(q.number).padStart(2, '0')}
                </span>
                <span className="text-[12px] leading-snug">{q.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="space-y-5">
        {loading && <Panel title="Loading…"><div className="h-40" /></Panel>}

        {error && !loading && (
          <Panel title="Couldn't load that question">
            <EmptyState title={error.message}>
              <p className="font-mono text-[11px]">{error.code}</p>
            </EmptyState>
          </Panel>
        )}

        {stats && !loading && !error && <QuestionStats stats={stats} />}
      </div>
    </div>
  )
}

function QuestionStats({ stats }) {
  const isMulti = stats.questionType === 'MULTI'
  const answeredShare = stats.shown > 0 ? (stats.answered / stats.shown) * 100 : null

  return (
    <>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs text-ink/35">
            Q{String(stats.questionNumber).padStart(2, '0')}
          </span>
          <span className="rounded-full bg-orbit-50 px-2 py-0.5 text-[11px] font-medium text-orbit-700">
            {stats.questionType}
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-snug text-ink">{stats.text}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Shown to" value={formatCount(stats.shown)} />
        <StatTile
          label="Answered"
          value={formatCount(stats.answered)}
          hint={answeredShare != null ? `${formatPercent(answeredShare)} of those shown` : undefined}
        />
        {/* Never merged: skipped is "the logic hid it", blank is "they left it empty". */}
        <StatTile
          label="Skipped"
          value={formatCount(stats.skipped)}
          tone="muted"
          hint="Hidden by conditional logic"
        />
        <StatTile
          label="Blank"
          value={formatCount(stats.blank)}
          tone={stats.blank > 0 ? 'warning' : 'muted'}
          hint="Shown, left unanswered"
        />
      </div>

      {stats.options ? (
        <Panel
          title="Answer breakdown"
          subtitle={
            isMulti
              ? `Share of the ${formatCount(stats.answered)} who answered. Respondents pick several, so these sum above 100%.`
              : `Share of the ${formatCount(stats.answered)} who answered.`
          }
        >
          <BarList
            items={stats.options.map((o) => ({
              key: o.value,
              label: o.label,
              value: o.respondents,
              percent: o.percentOfAnswered,
            }))}
          />
        </Panel>
      ) : stats.numeric ? (
        <NumericStats numeric={stats.numeric} />
      ) : (
        // Neither key present — a free-text question, or a question nobody has
        // reached. Both are legitimate; neither should throw.
        <Panel title="Answer breakdown">
          <EmptyState title="No distribution available for this question type." />
        </Panel>
      )}
    </>
  )
}

function NumericStats({ numeric }) {
  const distribution = numeric.distribution ?? []

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Mean" value={formatDecimal(numeric.mean)} />
        <StatTile label="Median" value={formatDecimal(numeric.median, 1)} />
        <StatTile label="Std deviation" value={formatDecimal(numeric.standardDeviation)} />
        <StatTile label="Responses" value={formatCount(numeric.n)} />
      </div>

      <Panel
        title="Rating distribution"
        subtitle="An ordered scale, so the ramp runs light to dark with the rating."
      >
        <BarList
          items={distribution.map((d, i) => ({
            key: d.value,
            label: d.label,
            value: d.respondents,
            percent: d.percentOfAnswered,
            // Ordered data → sequential ramp positioned by rating, not by rank.
            color: RAMP[Math.min(RAMP.length - 1, i)],
          }))}
        />
      </Panel>
    </>
  )
}
