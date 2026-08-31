import { ACCENT, EmptyState, Panel } from './charts'
import { formatCount, formatPercent } from '../lib/format'

const STAGE_LABEL = {
  SURVEY_VIEWED: 'Page viewed',
  OTP_REQUESTED: 'OTP requested',
  OTP_VERIFIED: 'OTP verified',
  SURVEY_STARTED: 'Survey started',
  SECTION_COMPLETED: 'Section completed',
  SUBMIT_ATTEMPTED: 'Submit attempted',
  SUBMITTED: 'Submitted',
}

export default function FunnelTab({ funnel, sectionTitles }) {
  if (!funnel) return null

  const stages = funnel.stages ?? []
  const sections = funnel.sections ?? []

  // The API always returns all seven stages, zero-filled, until the respondent
  // app starts posting to /surveys/{key}/events. An all-zero funnel is "not
  // wired up yet", not "nobody came" — say so rather than drawing a flat chart.
  const hasTelemetry = stages.some((s) => (s.uniques ?? 0) > 0)

  if (!hasTelemetry) {
    return (
      <Panel title="Funnel">
        <EmptyState title="No telemetry recorded yet.">
          <p>
            The funnel is fed entirely by <code className="font-mono">POST /surveys/{'{key}'}/events</code>.
            The survey app does not call it yet, so every stage reads zero — this is not a drop to zero,
            it is an unwired pipe. Everything else in this dashboard is unaffected.
          </p>
        </EmptyState>
      </Panel>
    )
  }

  const first = stages.find((s) => (s.uniques ?? 0) > 0)
  const anchor = first?.uniques ?? 0

  return (
    <div className="space-y-5">
      <Panel
        title="Conversion funnel"
        subtitle={`Unique respondents per stage${funnel.from ? ` · ${funnel.from.slice(0, 10)} to ${funnel.to?.slice(0, 10)}` : ''}`}
      >
        <div className="space-y-1">
          {stages.map((stage) => {
            const width = anchor > 0 ? (stage.uniques / anchor) * 100 : 0
            return (
              <div key={stage.eventKey} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-2">
                <div>
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-ink">
                      {STAGE_LABEL[stage.eventKey] ?? stage.eventKey}
                    </span>
                    {stage.total !== stage.uniques && (
                      <span className="font-mono text-[11px] text-ink/35">
                        {formatCount(stage.total)} events
                      </span>
                    )}
                  </div>
                  <div className="h-5 w-full overflow-hidden rounded-sm bg-ink/[0.05]">
                    <div
                      className="flex h-full items-center rounded-r-[4px] px-2"
                      style={{ width: `${width}%`, background: ACCENT }}
                    >
                      <span className="font-mono text-[11px] font-medium tabular-nums text-white">
                        {width > 12 ? formatCount(stage.uniques) : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-40 text-right">
                  <div className="font-mono text-sm tabular-nums text-ink">
                    {width <= 12 ? formatCount(stage.uniques) : formatPercent(stage.conversionFromStart)}
                  </div>
                  {/* Null on the first stage — there is no previous step to convert from. */}
                  <div className="mt-0.5 font-mono text-[11px] tabular-nums text-ink/45">
                    {stage.stepConversion == null ? (
                      'start'
                    ) : (
                      <>
                        step {formatPercent(stage.stepConversion)}
                        {stage.dropOff > 0 && (
                          <span className="ml-1.5 text-amber-600">−{formatPercent(stage.dropOff)}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel
        title="Section retention"
        subtitle="How far respondents get once they have started. Gaps in section numbering mean no one completed that section in the window."
      >
        {sections.length === 0 ? (
          <EmptyState title="No section completions recorded." />
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.sectionIndex}>
                <div className="mb-1.5 flex items-baseline justify-between gap-4">
                  <span className="text-[13px] text-ink/75">
                    <span className="mr-2 font-mono text-[11px] text-ink/35">
                      {String(section.sectionIndex).padStart(2, '0')}
                    </span>
                    {sectionTitles?.[section.sectionKey] ?? section.sectionKey}
                  </span>
                  <span className="shrink-0 font-mono text-[13px] tabular-nums text-ink">
                    {formatCount(section.completedBy)}
                    <span className="ml-2 text-ink/40">
                      {formatPercent(section.retentionFromFirstSection)}
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-sm bg-ink/[0.05]">
                  <div
                    className="h-full rounded-r-[4px]"
                    style={{ width: `${section.retentionFromFirstSection}%`, background: ACCENT }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}
