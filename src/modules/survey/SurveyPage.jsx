import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import AuthGate from './components/AuthGate'
import Complete from './components/Complete'
import Progress from './components/Progress'
import SectionStep from './components/SectionStep'
import { buildSubmission, resolveOptions, validateSection } from './lib/engine'
import {
  clearStoredSession,
  millisUntilExpiry,
  readStoredSession,
  writeStoredSession,
} from './lib/session'
import {
  endSession,
  fetchDraft,
  fetchSurvey,
  saveDraft,
  submitSurvey,
  verifySession,
} from './api/surveyApi'
import definition from './data/student-survey-v1.json'

// Two notices, because the two ways a session can lapse leave the student in
// different places: mid-survey they resume, at the submit they get submitted.
const EXPIRY_NOTICE_RESUME =
  'Your session timed out for security. Verify your number again to pick up where you left off — your answers are saved.'
const EXPIRY_NOTICE_SUBMIT =
  'Your session timed out just before submitting. Verify your number again and we’ll send your answers straight through — nothing is lost.'

/** Quiet period after the last keystroke or tap before a background save. */
const AUTOSAVE_DELAY_MS = 1200

/**
 * Drop answers that a change upstream has invalidated — Q7 narrows to what was
 * picked in Q6, so un-picking the chosen option there must clear Q7 rather than
 * submit a value the student can no longer see.
 */
function pruneDependents(survey, answers) {
  let next = answers
  for (const section of survey.sections) {
    for (const question of section.questions) {
      if (!question.optionsFrom) continue
      const held = next[question.id]
      if (held === undefined) continue
      const allowed = resolveOptions(question, next, survey).map((o) => o.value)
      const kept = Array.isArray(held) ? held.filter((v) => allowed.includes(v)) : held
      if (Array.isArray(held) ? kept.length !== held.length : !allowed.includes(held)) {
        next = { ...next, [question.id]: Array.isArray(held) ? kept : undefined }
      }
    }
  }
  return next
}

export default function SurveyPage() {
  const [survey, setSurvey] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // booting → auth → survey → done. `booting` covers the session and draft
  // fetch, so a returning student never sees a login screen or an empty
  // section A flash before being restored.
  const [phase, setPhase] = useState('booting')
  const [identity, setIdentity] = useState(null)
  const [authNotice, setAuthNotice] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)

  const [answers, setAnswers] = useState({})
  const [texts, setTexts] = useState({})
  const [errors, setErrors] = useState({})

  const [busy, setBusy] = useState(false)
  const [stepError, setStepError] = useState(null)
  const [saveState, setSaveState] = useState('idle')
  const [submission, setSubmission] = useState(null)

  // Set when a submit fails on an expired token, so re-verifying finishes the
  // job instead of dumping the student back on the last page with no feedback.
  const resubmitPending = useRef(false)
  // Answers already in memory beat anything on the server: set when a lapsed
  // session bounces a student who was mid-survey, so re-verifying doesn't
  // overwrite their unsaved work with an older draft.
  const preserveAnswers = useRef(false)
  // Edits made since the last successful save.
  const unsaved = useRef(false)

  const persistDraft = useCallback(
    async (who, draftAnswers, draftTexts, sectionIndex) => {
      if (!who?.token) return { ok: true }
      setSaveState('saving')
      try {
        await saveDraft(
          {
            surveyId: definition.id,
            surveyVersion: definition.version,
            // Stored with the draft so signing in on another device can skip
            // the email step instead of asking for details already given.
            identity: { email: who.email, consentedAt: who.consentedAt },
            answers: draftAnswers,
            texts: draftTexts,
            lastSectionIndex: sectionIndex,
          },
          who.token,
        )
        unsaved.current = false
        setSaveState('saved')
        return { ok: true }
      } catch (e) {
        setSaveState('error')
        return { ok: false, error: e }
      }
    },
    [],
  )

  const restoreDraft = useCallback(async (who) => {
    try {
      const draft = await fetchDraft(definition.id, who.token)
      if (!draft) return
      // A draft written against different questions can't be trusted to still
      // mean the same thing, so it is discarded rather than half-applied.
      if (draft.surveyVersion !== definition.version) return

      setAnswers(draft.answers ?? {})
      setTexts(draft.texts ?? {})
      setStepIndex(Math.min(draft.lastSectionIndex ?? 0, definition.sections.length - 1))
      setSaveState('saved')
    } catch {
      // No draft is a fine outcome — they just start at the beginning.
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      let definitionData
      try {
        definitionData = await fetchSurvey(definition.id, definition)
      } catch (e) {
        if (!cancelled) setLoadError(e.message)
        return
      }
      if (cancelled) return
      setSurvey(definitionData)

      // Local expiry check first: readStoredSession reads the JWT's own `exp`
      // and clears anything already dead, so we only call the network for a
      // token that still has a chance of being live.
      const stored = readStoredSession()
      if (!stored) {
        setPhase('auth')
        return
      }

      try {
        const session = await verifySession(stored.token)
        if (cancelled) return

        const who = {
          ...stored,
          mobile: session.mobile,
          // The server may know an email this browser doesn't (first visit on
          // a new device), so let it fill the gap without overriding ours.
          email: stored.email ?? session.profile?.email,
          survey: session.survey,
        }
        setIdentity(who)

        if (session.survey.hasSubmitted) {
          setSubmission({
            submissionId: session.survey.submissionId,
            submittedAt: session.survey.submittedAt,
          })
          setPhase('done')
          return
        }

        await restoreDraft(who)
        if (cancelled) return
        setPhase('survey')
      } catch {
        // The server disagreed about the token. It is the authority, so drop it.
        if (cancelled) return
        clearStoredSession()
        setPhase('auth')
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [restoreDraft])

  // Background save on a debounce, so a refresh mid-section costs nothing. The
  // awaited save on Continue is the guarantee; this is the safety net between.
  useEffect(() => {
    if (phase !== 'survey' || !identity || !unsaved.current) return
    const timer = setTimeout(() => {
      persistDraft(identity, answers, texts, stepIndex)
    }, AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [answers, texts, stepIndex, phase, identity, persistDraft])

  // Only warn about closing the tab while something is genuinely unsaved.
  useEffect(() => {
    if (phase !== 'survey') return
    const warn = (e) => {
      if (!unsaved.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [phase])

  // Catch expiry while the tab sits open, rather than letting the student write
  // out a whole section and only then discover the session died.
  useEffect(() => {
    if (phase !== 'survey' || !identity?.token) return
    const remaining = millisUntilExpiry(identity.token)
    const timer = setTimeout(() => {
      clearStoredSession()
      preserveAnswers.current = true
      setAuthNotice(EXPIRY_NOTICE_RESUME)
      setPhase('auth')
    }, remaining)
    return () => clearTimeout(timer)
  }, [phase, identity])

  const handleAnswer = useCallback((questionId, value) => {
    unsaved.current = true
    setAnswers((prev) => pruneDependents(definition, { ...prev, [questionId]: value }))
    setErrors((prev) => {
      if (!prev[questionId]) return prev
      const { [questionId]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const handleText = useCallback((key, value) => {
    unsaved.current = true
    setTexts((prev) => ({ ...prev, [key]: value }))
    const questionId = key.split(':')[0]
    setErrors((prev) => {
      if (!prev[questionId]) return prev
      const { [questionId]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const finish = useCallback((record) => {
    unsaved.current = false
    setSubmission(record)
    setPhase('done')
    // Persist the outcome so a reload — or a fresh login on this number —
    // restores the thank-you page instead of offering the survey again.
    setIdentity((who) => {
      const next = { ...who, survey: { hasSubmitted: true, ...record } }
      writeStoredSession(next)
      return next
    })
    window.scrollTo({ top: 0 })
  }, [])

  const bounceToReauth = useCallback((notice) => {
    clearStoredSession()
    preserveAnswers.current = true
    setAuthNotice(notice)
    setPhase('auth')
  }, [])

  const doSubmit = useCallback(
    async (who) => {
      setBusy(true)
      setStepError(null)
      try {
        const payload = buildSubmission({ survey, answers, texts, identity: who })
        const res = await submitSurvey(payload, who.token)
        finish({ submissionId: res.submissionId, submittedAt: res.submittedAt })
      } catch (e) {
        if (e.code === 'DUPLICATE_SUBMISSION') {
          // Already recorded — that's the desired end state, not an error.
          finish(e.details)
          return
        }
        if (e.code === 'SESSION_EXPIRED' || e.code === 'UNAUTHENTICATED' || e.code === 'INVALID_TOKEN') {
          resubmitPending.current = true
          bounceToReauth(EXPIRY_NOTICE_SUBMIT)
          return
        }
        setStepError(e.message)
      } finally {
        setBusy(false)
      }
    },
    [survey, answers, texts, finish, bounceToReauth],
  )

  const handleAuthenticated = useCallback(
    async (who) => {
      setIdentity(who)
      writeStoredSession(who)
      setAuthNotice(null)

      if (who.survey?.hasSubmitted) {
        setSubmission({
          submissionId: who.survey.submissionId,
          submittedAt: who.survey.submittedAt,
        })
        setPhase('done')
        return
      }

      if (resubmitPending.current) {
        resubmitPending.current = false
        preserveAnswers.current = false
        setPhase('survey')
        doSubmit(who)
        return
      }

      // Coming back from a mid-survey timeout: what's on screen is newer than
      // anything saved, so keep it rather than reloading an older draft.
      if (preserveAnswers.current) {
        preserveAnswers.current = false
        setPhase('survey')
        return
      }

      setPhase('booting')
      await restoreDraft(who)
      setPhase('survey')
    },
    [doSubmit, restoreDraft],
  )

  const handleStartNew = useCallback(() => {
    // Hand the device to the next student. Best effort: the local session is
    // dropped whether or not the server acknowledges the sign-out.
    endSession({ token: identity?.token, mobile: identity?.mobile })
    clearStoredSession()
    unsaved.current = false
    preserveAnswers.current = false
    resubmitPending.current = false
    setIdentity(null)
    setSubmission(null)
    setAnswers({})
    setTexts({})
    setErrors({})
    setStepIndex(0)
    setSaveState('idle')
    setPhase('auth')
  }, [identity])

  if (loadError) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-sm text-ink/60">{loadError}</p>
      </div>
    )
  }

  if (phase === 'booting' || !survey) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-ink/30" />
      </div>
    )
  }

  if (phase === 'auth') {
    return (
      <AuthGate
        survey={survey}
        notice={authNotice}
        resume={identity}
        onAuthenticated={handleAuthenticated}
      />
    )
  }

  if (phase === 'done') {
    return (
      <Complete
        survey={survey}
        submissionId={submission?.submissionId}
        submittedAt={submission?.submittedAt}
        onStartNew={handleStartNew}
      />
    )
  }

  const section = survey.sections[stepIndex]
  const isLast = stepIndex === survey.sections.length - 1

  const goTo = (index) => {
    setStepIndex(index)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = async () => {
    // Save on the way back too — a student who edits an earlier section and
    // then closes the tab should keep those edits.
    await persistDraft(identity, answers, texts, stepIndex - 1)
    goTo(stepIndex - 1)
  }

  const handleNext = async () => {
    const found = validateSection(section, answers, texts, survey)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      const firstId = section.questions.find((q) => found[q.id])?.id
      document.getElementById(`q-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (isLast) {
      await doSubmit(identity)
      return
    }

    setBusy(true)
    setStepError(null)
    const { ok, error } = await persistDraft(identity, answers, texts, stepIndex + 1)
    setBusy(false)

    if (!ok) {
      if (
        error?.code === 'SESSION_EXPIRED' ||
        error?.code === 'UNAUTHENTICATED' ||
        error?.code === 'INVALID_TOKEN'
      ) {
        bounceToReauth(EXPIRY_NOTICE_RESUME)
        return
      }
      // Hold them on the section rather than advancing over lost answers.
      setStepError("We couldn't save your answers just now. Check your connection and try again.")
      return
    }

    goTo(stepIndex + 1)
  }

  return (
    <div className="min-h-dvh bg-white">
      <Progress
        sections={survey.sections}
        currentIndex={stepIndex}
        saveState={saveState}
        onJump={goTo}
      />

      <main className="mx-auto max-w-2xl px-5 pb-4 pt-9">
        <AnimatePresence mode="wait">
          <SectionStep
            key={section.id}
            survey={survey}
            section={section}
            answers={answers}
            texts={texts}
            errors={errors}
            isFirst={stepIndex === 0}
            isLast={isLast}
            busy={busy}
            error={stepError}
            onAnswer={handleAnswer}
            onText={handleText}
            onBack={handleBack}
            onNext={handleNext}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}
