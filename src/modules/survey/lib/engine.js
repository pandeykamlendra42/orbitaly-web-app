/**
 * Survey engine — pure functions over a questionnaire definition and an answer
 * map. No React, no fetch, no DOM: everything here is testable in isolation and
 * shared by the step renderer, the validator and the submission payload builder.
 *
 * Answer shapes, keyed by question id:
 *   single | scale  ->  "option_value"
 *   multi           ->  ["option_value", ...]
 * Free text for an "Other" option lives in a parallel map keyed `qid:option`.
 */

/** Questions default to required; a definition can opt out with `required: false`. */
export function isRequired(question) {
  return question.required !== false
}

/**
 * `visibleIf` gates a question on an earlier answer. Supported forms:
 *   { question, in: [...] }    -> visible when the answer is one of these
 *   { question, notIn: [...] } -> visible unless the answer is one of these
 * A question whose gate has not been answered yet stays hidden, so a student
 * never sees a follow-up before its trigger.
 */
export function isVisible(question, answers) {
  const rule = question.visibleIf
  if (!rule) return true

  const value = answers[rule.question]
  if (value === undefined || value === null || value === '') return false

  const held = Array.isArray(value) ? value : [value]
  if (rule.in) return held.some((v) => rule.in.includes(v))
  if (rule.notIn) return !held.some((v) => rule.notIn.includes(v))
  return true
}

/**
 * Options for a question, resolving `optionsFrom` — the "out of those, which
 * ONE..." pattern where a follow-up narrows to what the student already picked.
 * Returns [] when the source question is still unanswered; the renderer shows
 * `optionsFromEmptyHint` instead of an empty list.
 */
export function resolveOptions(question, answers, survey) {
  if (!question.optionsFrom) return question.options ?? []

  const source = findQuestion(survey, question.optionsFrom)
  if (!source) return []

  const picked = answers[question.optionsFrom]
  if (!Array.isArray(picked) || picked.length === 0) return []

  return (source.options ?? []).filter((o) => picked.includes(o.value))
}

export function findQuestion(survey, questionId) {
  for (const section of survey.sections) {
    const found = section.questions.find((q) => q.id === questionId)
    if (found) return found
  }
  return null
}

export function allQuestions(survey) {
  return survey.sections.flatMap((s) => s.questions)
}

/** Questions in a section that are currently on screen, in definition order. */
export function visibleQuestions(section, answers) {
  return section.questions.filter((q) => isVisible(q, answers))
}

function isBlank(value) {
  if (value === undefined || value === null) return true
  if (Array.isArray(value)) return value.length === 0
  return String(value).trim() === ''
}

/**
 * Validate one question against the current answers.
 * Returns an error string, or null when the answer is acceptable.
 */
export function validateQuestion(question, answers, texts, survey) {
  const value = answers[question.id]

  if (isBlank(value)) {
    if (!isRequired(question)) return null
    // A narrowed question with nothing to narrow is the upstream question's
    // problem to report, not this one's.
    if (question.optionsFrom && resolveOptions(question, answers, survey).length === 0) {
      return null
    }
    return question.type === 'multi' ? 'Pick at least one option.' : 'Please choose an option.'
  }

  if (question.type === 'multi') {
    const max = question.maxSelections
    if (max && value.length > max) return `Pick no more than ${max}.`
    const min = question.minSelections
    if (min && value.length < min) return `Pick at least ${min}.`
  }

  // An "Other" choice is only an answer once it says something.
  const options = resolveOptions(question, answers, survey)
  const held = Array.isArray(value) ? value : [value]
  for (const optionValue of held) {
    const option = options.find((o) => o.value === optionValue)
    if (option?.allowsText && isBlank(texts[`${question.id}:${optionValue}`])) {
      return 'Tell us a little more in the box.'
    }
  }

  return null
}

/** Every error in a section, keyed by question id. Empty object === valid. */
export function validateSection(section, answers, texts, survey) {
  const errors = {}
  for (const question of visibleQuestions(section, answers)) {
    const error = validateQuestion(question, answers, texts, survey)
    if (error) errors[question.id] = error
  }
  return errors
}

/**
 * Apply a click on a multi-select option, honouring exclusive options
 * ("None of these" clears the rest, and picking anything else clears it) and
 * the pick-N cap (a click past the cap is ignored — the UI disables it anyway).
 */
/**
 * Read a stored answer as a multi-select value.
 *
 * A question can change from `single` to `multi` between published versions —
 * q35 and q37 did exactly that in v2 — and a draft saved against the older
 * version still holds a bare string. Without this, every array operation below
 * throws on those drafts, and `includes()` on a string silently does substring
 * matching. The previous single answer is kept as the first selection.
 */
export function asMulti(current) {
  if (Array.isArray(current)) return current
  return current === null || current === undefined || current === '' ? [] : [current]
}

export function toggleMulti(question, options, current, optionValue) {
  const selected = asMulti(current)
  const option = options.find((o) => o.value === optionValue)

  if (selected.includes(optionValue)) {
    return selected.filter((v) => v !== optionValue)
  }
  if (option?.exclusive) {
    return [optionValue]
  }

  const withoutExclusives = selected.filter(
    (v) => !options.find((o) => o.value === v)?.exclusive,
  )
  const max = question.maxSelections
  if (max && withoutExclusives.length >= max) return withoutExclusives

  return [...withoutExclusives, optionValue]
}

/** Options that can no longer be picked because the cap is full. */
export function isOptionCapped(question, current, optionValue) {
  const max = question.maxSelections
  if (!max || question.type !== 'multi') return false
  const selected = asMulti(current)
  return selected.length >= max && !selected.includes(optionValue)
}

/**
 * Flatten answers into the shape the (future) backend stores. Hidden questions
 * are recorded as `skipped` rather than dropped, so analysis can tell "not
 * applicable to this student" apart from "we forgot to ask".
 */
export function buildSubmission({ survey, answers, texts, identity }) {
  const responses = allQuestions(survey).map((question) => {
    if (!isVisible(question, answers)) {
      return { questionId: question.id, number: question.number, skipped: true }
    }
    const value = answers[question.id] ?? null
    const options = resolveOptions(question, answers, survey)
    const held = Array.isArray(value) ? value : value == null ? [] : [value]

    const freeText = {}
    for (const optionValue of held) {
      const text = texts[`${question.id}:${optionValue}`]
      if (options.find((o) => o.value === optionValue)?.allowsText && text) {
        freeText[optionValue] = text.trim()
      }
    }

    return {
      questionId: question.id,
      number: question.number,
      type: question.type,
      value,
      ...(Object.keys(freeText).length ? { freeText } : {}),
    }
  })

  return {
    surveyId: survey.id,
    surveyVersion: survey.version,
    identity,
    responses,
    submittedAt: new Date().toISOString(),
  }
}
