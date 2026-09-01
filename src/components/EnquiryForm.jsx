import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { submitLead, LEADS_ENABLED } from '../lib/leads'

const FIELDS = {
  counsellor: [
    { name: 'name', label: 'Your name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'mobile', label: 'Mobile', type: 'tel', required: true },
    { name: 'organisation', label: 'Organisation', type: 'text' },
    {
      name: 'specialisation',
      label: 'What you specialise in',
      type: 'text',
      placeholder: 'e.g. UK & Europe admissions, or career counselling',
    },
  ],
  partner: [
    { name: 'name', label: 'Your name', type: 'text', required: true },
    { name: 'email', label: 'Work email', type: 'email', required: true },
    { name: 'organisation', label: 'Organisation', type: 'text', required: true },
    { name: 'message', label: 'What you have in mind', type: 'textarea' },
  ],
}

const inputClass =
  'w-full rounded-sm border border-rule bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none'

export default function EnquiryForm({ kind, submitLabel = 'Submit' }) {
  const fields = FIELDS[kind]
  const [values, setValues] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await submitLead(kind, values)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-rule bg-paper-2 px-5 py-4">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-state-live" />
        <p className="text-[15px] leading-relaxed text-ink-2">
          Thanks — that's with us. Someone from the team will be in touch.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            {f.label}
            {f.required && <span className="text-brand"> *</span>}
          </span>
          {f.type === 'textarea' ? (
            <textarea
              rows={3}
              required={f.required}
              value={values[f.name] ?? ''}
              onChange={set(f.name)}
              placeholder={f.placeholder}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type={f.type}
              required={f.required}
              value={values[f.name] ?? ''}
              onChange={set(f.name)}
              placeholder={f.placeholder}
              className={inputClass}
            />
          )}
        </label>
      ))}

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !LEADS_ENABLED}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50 "
      >
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>

      <p className="text-xs leading-relaxed text-ink-3">
        We use these details only to contact you about this. No marketing lists.
      </p>
    </form>
  )
}
