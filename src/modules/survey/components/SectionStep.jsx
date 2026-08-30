import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import QuestionCard from './QuestionCard'
import { visibleQuestions } from '../lib/engine'

export default function SectionStep({
  survey,
  section,
  answers,
  texts,
  errors,
  isFirst,
  isLast,
  busy,
  error,
  onAnswer,
  onText,
  onBack,
  onNext,
}) {
  const questions = visibleQuestions(section, answers)

  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.21, 0.65, 0.36, 1] }}
    >
      <div className="mb-9">
        <span className="font-mono text-xs font-semibold tracking-widest text-orbit-600">
          SECTION {section.letter}
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-2 text-[15px] leading-relaxed text-ink/55">{section.description}</p>
        )}
      </div>

      <div>
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            survey={survey}
            answers={answers}
            texts={texts}
            error={errors[question.id]}
            onAnswer={onAnswer}
            onText={onText}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {/* Sticky so the primary action stays in thumb reach on a phone. */}
      <div className="sticky bottom-0 -mx-5 mt-8 border-t border-ink/[0.07] bg-white/85 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-full border border-ink/12 px-5 py-3.5 text-[15px] font-semibold text-ink/65 transition-colors hover:border-ink/30 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition-transform hover:enabled:scale-[1.01] disabled:opacity-40"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLast ? (busy ? 'Submitting…' : 'Submit survey') : 'Continue'}
            {!isLast && !busy && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
