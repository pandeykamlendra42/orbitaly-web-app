import { Panel, StatTile, VolumeChart } from './charts'
import { dayLabel, formatCount, formatDuration, formatPercent } from '../lib/format'

export default function OverviewTab({ summary, survey }) {
  if (!summary) return null

  const points = (summary.dailyVolume ?? []).map((d) => ({
    day: d.day,
    count: d.count,
    // Never render `day` raw — it is a local day boundary serialised as UTC.
    label: dayLabel(d.day),
  }))

  const flaggedShare =
    summary.totalResponses > 0 ? (summary.flaggedResponses / summary.totalResponses) * 100 : null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Total responses"
          value={formatCount(summary.totalResponses)}
          hint={`Version ${summary.currentVersion} · ${summary.status}`}
        />
        <StatTile label="Last 24 hours" value={formatCount(summary.responsesLast24h)} />
        <StatTile
          label="Median time to complete"
          value={formatDuration(summary.medianDurationSeconds)}
          hint={`Mean ${formatDuration(summary.averageDurationSeconds)}`}
        />
        <StatTile
          label="Flagged"
          value={formatCount(summary.flaggedResponses)}
          tone={summary.flaggedResponses > 0 ? 'warning' : 'default'}
          hint={
            flaggedShare != null
              ? `${formatPercent(flaggedShare)} of responses · advisory only, still real data`
              : undefined
          }
        />
      </div>

      <Panel
        title="Responses per day"
        subtitle="Day buckets are converted to your local timezone — the API returns them on a UTC boundary that reads as the previous day."
      >
        <VolumeChart points={points} />
      </Panel>

      {survey?.versions?.length > 0 && (
        <Panel title="Versions" subtitle="Responses are stamped with the version that produced them.">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/[0.07] text-left text-xs font-medium text-ink/45">
                <th className="pb-2 font-medium">Version</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Published</th>
                <th className="pb-2 text-right font-medium">Checksum</th>
              </tr>
            </thead>
            <tbody>
              {survey.versions.map((v) => (
                <tr key={v.version} className="border-b border-ink/[0.05] last:border-0">
                  <td className="py-2.5 font-mono tabular-nums text-ink">v{v.version}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        v.status === 'PUBLISHED' ? 'bg-mint-500/10 text-mint-500' : 'bg-ink/[0.06] text-ink/50'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-ink/60">{v.publishedAt ? dayLabel(v.publishedAt, { withYear: true }) : '—'}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-ink/35">
                    {v.checksum?.slice(0, 10) ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  )
}
