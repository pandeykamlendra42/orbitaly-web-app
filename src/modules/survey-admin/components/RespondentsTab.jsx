import { useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, Download, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { EmptyState, Panel } from './charts'
import { dateTimeLabel, formatCount, formatDuration, maskEmail, maskMobile } from '../lib/format'

const FLAG_COPY = {
  TOO_FAST: 'Completed unusually quickly',
  STRAIGHT_LINING: 'Same option repeatedly',
  DUPLICATE_DEVICE: 'Same device as another response',
}

export default function RespondentsTab({
  data,
  page,
  loading,
  error,
  detail,
  detailLoading,
  exporting,
  onPage,
  onOpenDetail,
  onCloseDetail,
  onExport,
}) {
  // PII is masked by default and revealed per row, so a screen-share or a
  // scroll-past doesn't spill student contact details.
  const [revealed, setRevealed] = useState(() => new Set())
  const toggleReveal = (id) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (error) {
    return (
      <Panel title="Couldn't load respondents">
        <EmptyState title={error.message}>
          <p className="font-mono text-[11px]">{error.code}</p>
        </EmptyState>
      </Panel>
    )
  }

  const rows = data?.rows ?? []

  return (
    <>
      <Panel
        title="Respondents"
        subtitle={
          data
            ? `${formatCount(data.totalElements)} responses · page ${data.page + 1} of ${data.totalPages}`
            : undefined
        }
        actions={
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Export CSV
          </button>
        }
      >
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-ink/30" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState title="No responses yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/[0.07] text-left text-xs font-medium text-ink/45">
                  <th className="pb-2 pr-3 font-medium">Submitted</th>
                  <th className="pb-2 pr-3 font-medium">Contact</th>
                  <th className="pb-2 pr-3 text-right font-medium">Duration</th>
                  <th className="pb-2 pr-3 text-right font-medium">Answered</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const show = revealed.has(row.submissionId)
                  return (
                    <tr key={row.submissionId} className="border-b border-ink/[0.05] last:border-0 hover:bg-ink/[0.015]">
                      <td className="py-3 pr-3 align-top">
                        <div className="text-[13px] text-ink">{dateTimeLabel(row.submittedAt)}</div>
                        <div className="font-mono text-[10px] text-ink/30">
                          {row.submissionId.slice(0, 14)}…
                        </div>
                      </td>

                      <td className="py-3 pr-3 align-top">
                        <div className="flex items-start gap-2">
                          <div className="font-mono text-[12px] leading-relaxed text-ink/70">
                            <div>{show ? (row.mobile ?? '—') : maskMobile(row.mobile)}</div>
                            <div className="text-ink/45">{show ? (row.email ?? '—') : maskEmail(row.email)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleReveal(row.submissionId)}
                            aria-label={show ? 'Hide contact details' : 'Reveal contact details'}
                            className="mt-0.5 rounded p-1 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/70"
                          >
                            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 pr-3 text-right align-top font-mono text-[13px] tabular-nums text-ink/70">
                        {formatDuration(row.durationSeconds)}
                      </td>

                      <td className="py-3 pr-3 text-right align-top font-mono text-[13px] tabular-nums text-ink/70">
                        {formatCount(row.answeredCount)}
                        <span className="text-ink/30"> / {formatCount(row.answeredCount + row.skippedCount)}</span>
                      </td>

                      <td className="py-3 pr-3 align-top">
                        <StatusCell status={row.status} flags={row.qualityFlags} />
                      </td>

                      <td className="py-3 text-right align-top">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(row.submissionId)}
                          className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-ink/[0.07] pt-4">
            <button
              type="button"
              onClick={() => onPage(page - 1)}
              disabled={page <= 0 || loading}
              className="flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 disabled:opacity-35"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span className="font-mono text-xs tabular-nums text-ink/45">
              {page + 1} / {data.totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPage(page + 1)}
              disabled={page >= data.totalPages - 1 || loading}
              className="flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 disabled:opacity-35"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </Panel>

      {(detail || detailLoading) && (
        <DetailDrawer detail={detail} loading={detailLoading} onClose={onCloseDetail} />
      )}
    </>
  )
}

function StatusCell({ status, flags }) {
  const flagged = status === 'FLAGGED'
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
          flagged ? 'bg-amber-50 text-amber-700' : 'bg-ink/[0.05] text-ink/55'
        }`}
      >
        {/* Status never rides on colour alone — icon plus word. */}
        {flagged && <AlertTriangle className="h-3 w-3" />}
        {status}
      </span>
      {flags?.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {flags.map((f) => (
            <div key={f} className="text-[11px] text-ink/45" title={FLAG_COPY[f] ?? f}>
              {FLAG_COPY[f] ?? f}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailDrawer({ detail, loading, onClose }) {
  const r = detail?.respondent

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/[0.07] bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-sm font-semibold text-ink">Response detail</h2>
            {r && (
              <p className="mt-0.5 font-mono text-[11px] text-ink/40">{r.submissionId}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {loading || !detail ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-ink/30" />
          </div>
        ) : (
          <div className="px-6 py-5">
            <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-ink/[0.09] p-4 text-[13px]">
              <Meta label="Submitted" value={dateTimeLabel(r.submittedAt)} />
              <Meta label="Duration" value={formatDuration(r.durationSeconds)} />
              <Meta label="Version" value={`v${r.surveyVersion}`} />
              <Meta label="Status" value={r.status} />
              <Meta label="Mobile" value={r.mobile ?? '—'} mono />
              <Meta label="Email" value={r.email ?? '—'} mono />
            </dl>

            {r.qualityFlags?.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Quality flags
                </p>
                <ul className="mt-1.5 space-y-0.5 text-xs text-amber-900">
                  {r.qualityFlags.map((f) => (
                    <li key={f}>{FLAG_COPY[f] ?? f}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-amber-800/70">
                  Advisory only — this is still a real response, not a reject.
                </p>
              </div>
            )}

            <ol className="space-y-4">
              {detail.answers.map((a) => (
                <li key={a.questionKey} className="border-t border-ink/[0.07] pt-4 first:border-0 first:pt-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink/30">
                      {String(a.number).padStart(2, '0')}
                    </span>
                    <span className="rounded-full bg-ink/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-ink/50">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium leading-snug text-ink">{a.text}</p>

                  <div className="mt-2">
                    {a.skipped ? (
                      <span className="text-[13px] italic text-ink/35">
                        Not applicable — hidden by conditional logic
                      </span>
                    ) : !a.answered ? (
                      <span className="text-[13px] italic text-amber-600">Left blank</span>
                    ) : (
                      <AnswerValue answer={a} />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

function AnswerValue({ answer }) {
  // Display `labels`; `values` are the machine keys and stay out of the UI.
  // numericValue and freeText are omitted when absent, never null.
  return (
    <div className="space-y-2">
      {typeof answer.numericValue === 'number' && (
        <span className="inline-block rounded-lg bg-orbit-50 px-2.5 py-1 font-mono text-[13px] font-semibold text-orbit-700">
          {answer.numericValue}
        </span>
      )}

      {answer.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {answer.labels.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="rounded-lg bg-ink/[0.05] px-2.5 py-1 text-[13px] text-ink/80"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {answer.freeText && (
        <blockquote className="border-l-2 border-orbit-300 pl-3 text-[13px] leading-relaxed text-ink/70">
          “{answer.freeText}”
        </blockquote>
      )}
    </div>
  )
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <dt className="text-[11px] text-ink/40">{label}</dt>
      <dd className={`mt-0.5 text-ink/80 ${mono ? 'font-mono text-[12px]' : ''}`}>{value}</dd>
    </div>
  )
}
