import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Logo from '../../../components/Logo'

const SITE_URL = 'https://www.orbitaly.in/'

export default function Complete({ survey, submissionId, submittedAt, onStartNew }) {
  const submittedOn =
    submittedAt &&
    new Date(submittedAt).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo className="h-9 w-auto" />
        </div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4, ease: [0.21, 0.65, 0.36, 1] }}
          className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-ink"
        >
          <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
        </motion.div>

        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          {survey.completion.headline}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/60">{survey.completion.body}</p>

        {submissionId && (
          <p className="mt-8 font-mono text-xs text-ink/35">
            Reference · {submissionId}
            {submittedOn && <> · {submittedOn}</>}
          </p>
        )}

        {/* The onward step. They've just told us what they need; this is the
            one place we get to show them what we're building with it. */}
        <a
          href={SITE_URL}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-bold text-white transition-transform hover:scale-[1.01]"
        >
          Explore Orbitaly
          <ArrowRight className="h-4 w-4" />
        </a>

        {/* Survey sessions happen on shared campus machines. Without a hand-over
            the next student in the queue lands on someone else's confirmation. */}
        {onStartNew && (
          <button
            type="button"
            onClick={onStartNew}
            className="mt-6 text-sm font-semibold text-ink/45 underline underline-offset-4 transition-colors hover:text-ink"
          >
            Not you? Start a new response
          </button>
        )}
      </motion.div>
    </div>
  )
}
