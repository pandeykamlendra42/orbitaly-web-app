import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import Logo from '../../../components/Logo'
import { TextField } from './controls'
import { isValidEmail, isValidIndianMobile, requestOtp, verifyOtp } from '../api/surveyApi'

const digitsOnly = (v) => v.replace(/\D/g, '')

function Shell({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.21, 0.65, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

function PrimaryButton({ busy, children, ...props }) {
  return (
    <button
      type="submit"
      disabled={busy || props.disabled}
      {...props}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-bold text-white transition-all hover:enabled:scale-[1.01] disabled:opacity-35"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
      {!busy && <ArrowRight className="h-4 w-4" />}
    </button>
  )
}

/**
 * Phone → OTP → email. The survey is gated on a verified number so every row in
 * the results ties back to a real, reachable student; the email is collected but
 * deliberately not verified (product decision — one friction point, not two).
 */
/**
 * `resume` carries the identity of a student who was already part-way through
 * when their token lapsed. If the same number verifies again we reuse the email
 * and consent they already gave rather than asking twice — but only on an exact
 * mobile match, so a different student on the same device starts clean.
 */
export default function AuthGate({ survey, notice, resume, onAuthenticated }) {
  const [phase, setPhase] = useState('mobile')
  // Pre-filled when re-verifying, so a timeout costs a tap rather than retyping
  // a number we already hold. Still editable — it may be a different student.
  const [mobile, setMobile] = useState(resume?.mobile ?? '')
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [resendIn, setResendIn] = useState(0)
  // The backend correlates a code with the request that sent it.
  const [otpRequestId, setOtpRequestId] = useState(null)
  // Only ever set if the server volunteers one; a production API never should.
  const [devHint, setDevHint] = useState(null)
  const session = useRef(null)

  useEffect(() => {
    if (resendIn <= 0) return
    const id = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [resendIn])

  const send = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await requestOtp(mobile, survey.id)
      setOtpRequestId(res?.requestId ?? null)
      setDevHint(res?.devHint ?? null)
      setResendIn(res?.resendAfterSeconds ?? 30)
      setPhase('otp')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const submitMobile = (e) => {
    e.preventDefault()
    if (!isValidIndianMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    send()
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const verified = await verifyOtp(mobile, otp, otpRequestId)
      session.current = verified

      // A student who has already completed the survey on this number goes
      // straight back to their thank-you page — no second run, and no point
      // asking for an email we already have.
      if (verified.survey?.hasSubmitted) {
        onAuthenticated({
          token: verified.token,
          mobile: verified.mobile,
          expiresAt: verified.expiresAt,
          survey: verified.survey,
        })
        return
      }

      // We may already have their email: either in memory (re-verifying after a
      // timeout) or from the server (a part-finished survey on another device).
      // Either way, don't ask twice.
      const known =
        resume?.email && resume.mobile === verified.mobile
          ? { email: resume.email, consentedAt: resume.consentedAt }
          : verified.profile?.email
            ? { email: verified.profile.email, consentedAt: verified.profile.consentedAt }
            : null

      if (known) {
        onAuthenticated({
          token: verified.token,
          mobile: verified.mobile,
          expiresAt: verified.expiresAt,
          email: known.email,
          consentedAt: known.consentedAt,
          survey: verified.survey,
        })
        return
      }

      setPhase('email')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const submitEmail = (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (!consent) {
      setError('Please accept the consent checkbox to continue.')
      return
    }
    onAuthenticated({
      token: session.current.token,
      mobile: session.current.mobile,
      expiresAt: session.current.expiresAt,
      email: email.trim(),
      consentedAt: new Date().toISOString(),
      survey: session.current.survey,
    })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="h-9 w-auto" />
        </div>

        {phase === 'mobile' && (
          <Shell>
            {notice && (
              <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                {notice}
              </p>
            )}

            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              {notice ? 'Verify your number again' : survey.tagline}
            </h1>
            {!notice && <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{survey.intro}</p>}
            {!notice && (
              <p className="mt-4 font-mono text-xs text-ink/40">
                {survey.sections.length} short sections · about {survey.estimatedMinutes} minutes
              </p>
            )}

            {/* noValidate throughout: the native bubble on type=email/tel fires
                before our handler and replaces our inline errors with a
                browser-styled tooltip. We validate every field ourselves. */}
            <form onSubmit={submitMobile} noValidate className="mt-8">
              <TextField
                id="mobile"
                label="Mobile number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="98765 43210"
                value={mobile}
                error={error}
                hint="We'll text you a 6-digit code. Used only to verify you're a real student."
                onChange={(e) => {
                  setMobile(digitsOnly(e.target.value).slice(0, 10))
                  setError(null)
                }}
              />
              <PrimaryButton busy={busy}>Send code</PrimaryButton>
            </form>
          </Shell>
        )}

        {phase === 'otp' && (
          <Shell>
            <button
              type="button"
              onClick={() => {
                setPhase('mobile')
                setOtp('')
                setError(null)
              }}
              className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Change number
            </button>

            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink">Enter the code</h1>
            <p className="mt-3 text-[15px] text-ink/60">
              Sent to <span className="font-medium text-ink">+91 {mobile}</span>
            </p>

            <form onSubmit={submitOtp} noValidate className="mt-8">
              <TextField
                id="otp"
                label="6-digit code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="······"
                value={otp}
                error={error}
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-center font-mono text-2xl tracking-[0.5em] text-ink placeholder:text-ink/20 focus:border-ink focus:outline-none"
                onChange={(e) => {
                  setOtp(digitsOnly(e.target.value).slice(0, 6))
                  setError(null)
                }}
              />

              <div className="mt-3 text-center">
                {resendIn > 0 ? (
                  <span className="font-mono text-xs text-ink/40">Resend in {resendIn}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={send}
                    className="text-sm font-semibold text-orbit-600 hover:text-orbit-700"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <PrimaryButton busy={busy} disabled={otp.length !== 6}>
                Verify
              </PrimaryButton>
            </form>

            {/* Shown only when the API hands back a code, which it does in the
                mock and may do on a dev backend. Never in production. */}
            {import.meta.env.DEV && devHint && (
              <p className="mt-6 rounded-lg border border-dashed border-ink/15 px-3 py-2 text-center font-mono text-xs text-ink/40">
                dev · use {devHint}
              </p>
            )}
          </Shell>
        )}

        {phase === 'email' && (
          <Shell>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-mint-500/10 px-3 py-1.5 text-xs font-semibold text-mint-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Number verified
            </div>

            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink">
              One last detail
            </h1>
            <p className="mt-3 text-[15px] text-ink/60">
              Where should we send your results summary if we publish one?
            </p>

            <form onSubmit={submitEmail} noValidate className="mt-8">
              <TextField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@college.edu"
                value={email}
                error={error}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
              />

              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    setError(null)
                  }}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#0f0e1a]"
                />
                <span className="text-sm leading-relaxed text-ink/65">{survey.auth.consentText}</span>
              </label>

              <PrimaryButton busy={busy}>Start survey</PrimaryButton>
            </form>
          </Shell>
        )}
      </div>
    </div>
  )
}
