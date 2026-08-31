import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, LogOut, RefreshCw } from 'lucide-react'
import Logo from '../../components/Logo'
import { decodeJwt, isTokenExpired, millisUntilExpiry } from '../../lib/jwt'
import surveyDefinition from '../survey/data/student-survey-v1.json'
import {
  fetchAbuse,
  fetchCrosstab,
  fetchFunnel,
  fetchQuestionStats,
  fetchResponseDetail,
  fetchResponses,
  fetchSummary,
  fetchSurveys,
  downloadResponsesCsv,
  isAuthError,
} from './api/adminApi'
import TokenGate from './components/TokenGate'
import OverviewTab from './components/OverviewTab'
import FunnelTab from './components/FunnelTab'
import QuestionsTab from './components/QuestionsTab'
import CrosstabTab from './components/CrosstabTab'
import RespondentsTab from './components/RespondentsTab'
import AbuseTab from './components/AbuseTab'
import { EmptyState, Panel } from './components/charts'

const TOKEN_KEY = 'orbitaly.survey.admin.token'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'questions', label: 'Questions' },
  { id: 'crosstab', label: 'Cross-tab' },
  { id: 'respondents', label: 'Respondents' },
  { id: 'abuse', label: 'OTP abuse' },
]

const readToken = () => {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
    return stored && !isTokenExpired(stored) ? stored : null
  } catch {
    return null
  }
}

/**
 * The question and section metadata comes from the bundled questionnaire — the
 * admin API has no "list questions" endpoint, and the definition is the same
 * document that produced the responses.
 */
function useSurveyMeta() {
  return useMemo(() => {
    const questions = surveyDefinition.sections.flatMap((s) => s.questions)
    return {
      questions,
      // Cross-tab rejects anything that isn't a choice question.
      choiceQuestions: questions.filter((q) => q.type === 'single' || q.type === 'multi'),
      sectionTitles: Object.fromEntries(
        surveyDefinition.sections.map((s) => [s.id, `${s.letter}. ${s.title}`]),
      ),
    }
  }, [])
}

export default function AdminPage() {
  const { questions, choiceQuestions, sectionTitles } = useSurveyMeta()

  const [token, setToken] = useState(readToken)
  const [authNotice, setAuthNotice] = useState(null)
  const [gateBusy, setGateBusy] = useState(false)
  const [gateError, setGateError] = useState(null)

  const [surveys, setSurveys] = useState(null)
  const [surveyKey, setSurveyKey] = useState(surveyDefinition.id)
  const [tab, setTab] = useState('overview')

  const [summary, setSummary] = useState(null)
  const [funnel, setFunnel] = useState(null)
  const [shellError, setShellError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState(null)

  const [questionKey, setQuestionKey] = useState(questions[0]?.id ?? null)
  const [questionStats, setQuestionStats] = useState(null)
  const [questionState, setQuestionState] = useState({ loading: false, error: null })

  const [crosstabKeys, setCrosstabKeys] = useState({
    rowKey: choiceQuestions[0]?.id ?? null,
    columnKey: choiceQuestions[1]?.id ?? null,
  })
  const [crosstab, setCrosstab] = useState(null)
  const [crosstabState, setCrosstabState] = useState({ loading: false, error: null })

  const [page, setPage] = useState(0)
  const [responses, setResponses] = useState(null)
  const [responsesState, setResponsesState] = useState({ loading: false, error: null })
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [abuseParams, setAbuseParams] = useState({ hours: 24, minRequests: 3, limit: 50 })
  const [abuse, setAbuse] = useState(null)
  const [abuseState, setAbuseState] = useState({ loading: false, error: null })

  /** Any 401/403 drops the token and returns to the gate rather than looping. */
  const signOut = useCallback((notice) => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* nothing to clear */
    }
    setToken(null)
    setAuthNotice(notice ?? null)
    setSurveys(null)
    setSummary(null)
    setFunnel(null)
  }, [])

  const guard = useCallback(
    (error) => {
      if (isAuthError(error)) {
        signOut(
          error.code === 'FORBIDDEN'
            ? 'That token is valid but lacks the ADMIN authority. Use an admin account.'
            : 'Your admin session expired. Paste a fresh token to continue.',
        )
        return true
      }
      return false
    },
    [signOut],
  )

  // Kick the admin out the moment the LOS token lapses, rather than letting
  // every panel fail with its own 401.
  useEffect(() => {
    if (!token) return
    const timer = setTimeout(
      () => signOut('Your admin session expired. Paste a fresh token to continue.'),
      millisUntilExpiry(token),
    )
    return () => clearTimeout(timer)
  }, [token, signOut])

  const loadShell = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setShellError(null)
    try {
      const [surveyList, summaryData, funnelData] = await Promise.all([
        fetchSurveys(token),
        fetchSummary(surveyKey, token),
        fetchFunnel(surveyKey, {}, token),
      ])
      setSurveys(surveyList)
      setSummary(summaryData)
      setFunnel(funnelData)
      setRefreshedAt(new Date())
    } catch (e) {
      if (!guard(e)) setShellError(e)
    } finally {
      setLoading(false)
    }
  }, [token, surveyKey, guard])

  useEffect(() => {
    loadShell()
  }, [loadShell])

  // Per-tab loads, each guarded so one failing panel never blanks the shell.
  useEffect(() => {
    if (!token || tab !== 'questions' || !questionKey) return
    let cancelled = false
    setQuestionState({ loading: true, error: null })
    fetchQuestionStats(surveyKey, questionKey, token)
      .then((data) => !cancelled && (setQuestionStats(data), setQuestionState({ loading: false, error: null })))
      .catch((e) => {
        if (cancelled || guard(e)) return
        setQuestionState({ loading: false, error: e })
      })
    return () => {
      cancelled = true
    }
  }, [token, tab, surveyKey, questionKey, guard])

  useEffect(() => {
    const { rowKey, columnKey } = crosstabKeys
    if (!token || tab !== 'crosstab' || !rowKey || !columnKey) return
    let cancelled = false
    setCrosstabState({ loading: true, error: null })
    fetchCrosstab(surveyKey, rowKey, columnKey, token)
      .then((data) => !cancelled && (setCrosstab(data), setCrosstabState({ loading: false, error: null })))
      .catch((e) => {
        if (cancelled || guard(e)) return
        setCrosstab(null)
        setCrosstabState({ loading: false, error: e })
      })
    return () => {
      cancelled = true
    }
  }, [token, tab, surveyKey, crosstabKeys, guard])

  useEffect(() => {
    if (!token || tab !== 'respondents') return
    let cancelled = false
    setResponsesState({ loading: true, error: null })
    fetchResponses(surveyKey, { page, size: 50 }, token)
      .then((data) => !cancelled && (setResponses(data), setResponsesState({ loading: false, error: null })))
      .catch((e) => {
        if (cancelled || guard(e)) return
        setResponsesState({ loading: false, error: e })
      })
    return () => {
      cancelled = true
    }
  }, [token, tab, surveyKey, page, guard])

  useEffect(() => {
    if (!token || tab !== 'abuse') return
    let cancelled = false
    setAbuseState({ loading: true, error: null })
    fetchAbuse(surveyKey, abuseParams, token)
      .then((data) => !cancelled && (setAbuse(data), setAbuseState({ loading: false, error: null })))
      .catch((e) => {
        if (cancelled || guard(e)) return
        setAbuseState({ loading: false, error: e })
      })
    return () => {
      cancelled = true
    }
  }, [token, tab, surveyKey, abuseParams, guard])

  const openDetail = useCallback(
    async (submissionId) => {
      setDetailLoading(true)
      setDetail(null)
      try {
        setDetail(await fetchResponseDetail(surveyKey, submissionId, token))
      } catch (e) {
        if (!guard(e)) setResponsesState((s) => ({ ...s, error: e }))
        setDetail(null)
      } finally {
        setDetailLoading(false)
      }
    },
    [surveyKey, token, guard],
  )

  const exportCsv = useCallback(async () => {
    setExporting(true)
    try {
      await downloadResponsesCsv(surveyKey, token)
    } catch (e) {
      if (!guard(e)) setResponsesState((s) => ({ ...s, error: e }))
    } finally {
      setExporting(false)
    }
  }, [surveyKey, token, guard])

  const acceptToken = useCallback(async (candidate) => {
    setGateBusy(true)
    setGateError(null)
    try {
      // Prove the token works before storing it, so a bad paste fails here
      // rather than as six broken panels.
      await fetchSurveys(candidate)
      try {
        localStorage.setItem(TOKEN_KEY, candidate)
      } catch {
        /* storage unavailable — the session just won't survive a reload */
      }
      setAuthNotice(null)
      setToken(candidate)
    } catch (e) {
      setGateError(e)
    } finally {
      setGateBusy(false)
    }
  }, [])

  if (!token) {
    return (
      <TokenGate notice={authNotice} busy={gateBusy} error={gateError} onSubmit={acceptToken} />
    )
  }

  const activeSurvey = surveys?.find((s) => s.surveyKey === surveyKey)
  const tokenClaims = decodeJwt(token)

  return (
    <div className="min-h-dvh bg-[#fbfbfd]">
      <header className="border-b border-ink/[0.09] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-auto" />
            <span className="rounded-full bg-ink/[0.06] px-2 py-0.5 text-[11px] font-semibold text-ink/50">
              Analytics
            </span>
          </div>

          <div className="flex items-center gap-3">
            {surveys?.length > 1 && (
              <select
                value={surveyKey}
                onChange={(e) => {
                  setSurveyKey(e.target.value)
                  setPage(0)
                }}
                className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
              >
                {surveys.map((s) => (
                  <option key={s.surveyKey} value={s.surveyKey}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}

            {refreshedAt && (
              <span className="hidden font-mono text-[11px] text-ink/35 sm:inline">
                {refreshedAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
              </span>
            )}

            <button
              type="button"
              onClick={loadShell}
              disabled={loading}
              aria-label="Refresh"
              className="rounded-lg border border-ink/15 p-1.5 text-ink/55 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => signOut(null)}
              className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-semibold text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
              title={tokenClaims?.sub ? `Signed in as ${tokenClaims.sub}` : undefined}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-7xl px-5">
          <ul className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                    tab === t.id
                      ? 'border-ink text-ink'
                      : 'border-transparent text-ink/45 hover:text-ink/75'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {shellError ? (
          <Panel title="Couldn't load this survey">
            <EmptyState title={shellError.message}>
              <p className="font-mono text-[11px]">{shellError.code}</p>
            </EmptyState>
          </Panel>
        ) : loading && !summary ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-ink/30" />
          </div>
        ) : (
          <>
            {tab === 'overview' && <OverviewTab summary={summary} survey={activeSurvey} />}
            {tab === 'funnel' && <FunnelTab funnel={funnel} sectionTitles={sectionTitles} />}
            {tab === 'questions' && (
              <QuestionsTab
                questions={questions}
                selectedKey={questionKey}
                stats={questionStats}
                loading={questionState.loading}
                error={questionState.error}
                onSelect={setQuestionKey}
              />
            )}
            {tab === 'crosstab' && (
              <CrosstabTab
                questions={choiceQuestions}
                rowKey={crosstabKeys.rowKey}
                columnKey={crosstabKeys.columnKey}
                crosstab={crosstab}
                loading={crosstabState.loading}
                error={crosstabState.error}
                onChange={setCrosstabKeys}
              />
            )}
            {tab === 'respondents' && (
              <RespondentsTab
                data={responses}
                page={page}
                loading={responsesState.loading}
                error={responsesState.error}
                detail={detail}
                detailLoading={detailLoading}
                exporting={exporting}
                onPage={setPage}
                onOpenDetail={openDetail}
                onCloseDetail={() => setDetail(null)}
                onExport={exportCsv}
              />
            )}
            {tab === 'abuse' && (
              <AbuseTab
                rows={abuse}
                params={abuseParams}
                loading={abuseState.loading}
                error={abuseState.error}
                onParams={setAbuseParams}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
