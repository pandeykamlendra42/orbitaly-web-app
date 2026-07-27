import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Landmark,
  FileCheck2,
  Send,
  LayoutDashboard,
  PartyPopper,
  Lock,
  CircleCheck,
} from 'lucide-react'
import { useBasket } from '../context/BasketContext'
import { formatINR, compactINR } from '../data/institutes'
import { Reveal } from '../components/ui'

// Mock underwriting: approve a credit line of at least ₹5L,
// or the basket scaled 1.4x rounded up to the nearest ₹50K.
const computeCreditLine = (total) => Math.max(500000, Math.ceil((total * 1.4) / 50000) * 50000)

const CHECK_STEPS = [
  'Verifying applicant details…',
  'Running soft bureau check…',
  'Evaluating Education Basket…',
  'Matching banking partner offers…',
]

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-bold text-ink/60">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full rounded-2xl border border-ink/10 bg-ink/[0.03] px-4 py-3.5 text-[15px] font-medium outline-none transition-all placeholder:text-ink/30 focus:border-orbit-400 focus:bg-white focus:ring-4 focus:ring-orbit-100'

export default function Eligibility() {
  const { total, items, eligibility, setEligibility } = useBasket()
  const [phase, setPhase] = useState(eligibility ? 'result' : 'form') // form | checking | result | journey
  const [checkStep, setCheckStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    pan: '',
    income: '',
    employment: 'Salaried',
    relationship: 'Parent',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const valid = form.name.trim().length >= 3 && form.pan.trim().length >= 10 && Number(form.income) > 0

  // simulated underwriting sequence
  useEffect(() => {
    if (phase !== 'checking') return
    if (checkStep < CHECK_STEPS.length) {
      const t = setTimeout(() => setCheckStep((s) => s + 1), 850)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setEligibility({
        status: 'approved',
        creditLine: computeCreditLine(total),
        applicant: form.name.trim(),
      })
      setPhase('result')
    }, 500)
    return () => clearTimeout(t)
  }, [phase, checkStep, total, form.name, setEligibility])

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    setCheckStep(0)
    setPhase('checking')
  }

  const creditLine = eligibility?.creditLine ?? computeCreditLine(total)
  const covered = total > 0 && creditLine >= total

  return (
    <main className="min-h-screen bg-[#f6f6fb] pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Eligibility Checker
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ink/55">
            A soft check against our banking partners — instant, paperless and with no
            impact on your credit score.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="rounded-3xl bg-white p-8">
            <AnimatePresence mode="wait">
              {/* ------------------------------ FORM ------------------------------ */}
              {phase === 'form' && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  onSubmit={submit}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-extrabold text-ink">Applicant details</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name (as per PAN)">
                      <input className={inputCls} placeholder="e.g. Rohan Sharma" value={form.name} onChange={set('name')} />
                    </Field>
                    <Field label="PAN">
                      <input
                        className={`${inputCls} uppercase`}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        value={form.pan}
                        onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))}
                      />
                    </Field>
                    <Field label="Annual household income (₹)">
                      <input className={inputCls} type="number" min="0" placeholder="12,00,000" value={form.income} onChange={set('income')} />
                    </Field>
                    <Field label="Employment type">
                      <select className={inputCls} value={form.employment} onChange={set('employment')}>
                        {['Salaried', 'Self-employed', 'Business owner', 'Professional'].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Relationship to student">
                      <select className={inputCls} value={form.relationship} onChange={set('relationship')}>
                        {['Parent', 'Guardian', 'Self (student)'].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <button
                    type="submit"
                    disabled={!valid}
                    className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold transition-all sm:w-auto sm:px-10 ${
                      valid
                        ? 'bg-ink text-white hover:scale-[1.02]'
                        : 'cursor-not-allowed bg-ink/10 text-ink/35'
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5" /> Check my eligibility
                  </button>
                  <p className="flex items-center gap-1.5 text-[12px] text-ink/40">
                    <Lock className="h-3.5 w-3.5" /> Demo only — details are not stored or sent anywhere.
                  </p>
                </motion.form>
              )}

              {/* ---------------------------- CHECKING ---------------------------- */}
              {phase === 'checking' && (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[380px] flex-col items-center justify-center py-10 text-center"
                >
                  <motion.svg viewBox="0 0 100 100" className="h-20 w-20" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e0e7ff" strokeWidth="9" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#4f46e5" strokeWidth="9" strokeDasharray="80 200" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="14" fill="#4f46e5" />
                  </motion.svg>
                  <div className="mt-8 space-y-2.5">
                    {CHECK_STEPS.map((s, i) => (
                      <motion.p
                        key={s}
                        initial={{ opacity: 0.25 }}
                        animate={{ opacity: i <= checkStep ? 1 : 0.25 }}
                        className="flex items-center justify-center gap-2 text-[15px] font-semibold text-ink"
                      >
                        {i < checkStep ? (
                          <CircleCheck className="h-4.5 w-4.5 text-mint-500" />
                        ) : (
                          <span className="h-4.5 w-4.5 rounded-full border-2 border-ink/15" />
                        )}
                        {s}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ----------------------------- RESULT ----------------------------- */}
              {phase === 'result' && eligibility && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint-500/15"
                  >
                    <BadgeCheck className="h-10 w-10 text-mint-500" />
                  </motion.div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-ink">
                    Congratulations{eligibility.applicant ? `, ${eligibility.applicant.split(' ')[0]}` : ''}! 🎉
                  </h2>
                  <p className="mt-2 text-center text-ink/55">
                    You're pre-approved for an education credit line of
                  </p>
                  <p className="mt-3 text-center text-5xl font-black tracking-tight text-orbit-600">
                    {formatINR(creditLine)}
                  </p>

                  {/* coverage bar */}
                  <div className="mx-auto mt-8 max-w-md">
                    <div className="flex justify-between text-[13px] font-bold">
                      <span className="text-ink/55">Basket {formatINR(total)}</span>
                      <span className="text-orbit-600">Credit line {compactINR(creditLine)}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${creditLine ? Math.min((total / creditLine) * 100, 100) : 0}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-orbit-500 to-mint-400"
                      />
                    </div>
                    <p className="mt-2.5 text-center text-[13px] font-medium text-ink/50">
                      {total === 0
                        ? 'Your basket is empty — add items and they are covered up to your credit line.'
                        : covered
                          ? `Your entire basket is covered, with ${formatINR(creditLine - total)} headroom for future expenses.`
                          : 'Basket exceeds the pre-approved line — a co-applicant can raise the limit.'}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setPhase('journey')}
                      className="group flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[15px] font-bold text-white transition-transform hover:scale-[1.03]"
                    >
                      Proceed with loan journey
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    {total === 0 && (
                      <Link to="/marketplace" className="rounded-full border border-ink/15 px-8 py-4 text-[15px] font-bold text-ink hover:bg-ink/5">
                        Build your basket
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ----------------------------- JOURNEY ----------------------------- */}
              {phase === 'journey' && (
                <motion.div key="journey" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orbit-600 text-white">
                      <PartyPopper className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-ink">You're on your way!</h2>
                      <p className="text-sm text-ink/50">Here's what happens next on Orbitaly.</p>
                    </div>
                  </div>
                  <div className="mt-7 space-y-4">
                    {[
                      { icon: FileCheck2, title: 'Digital documentation', desc: 'e-KYC and e-sign the loan agreement — completely paperless.', tag: 'Next step' },
                      { icon: Landmark, title: 'Banking partner confirmation', desc: 'Final sanction from the matched banking partner within 24 hours.', tag: 'Day 1' },
                      { icon: Send, title: 'Payments routed to recipients', desc: 'Tuition and add-ons are paid directly to approved institutes and merchants.', tag: 'On sanction' },
                      { icon: LayoutDashboard, title: 'Track everything digitally', desc: 'Follow disbursements, allowance limits and statements from one dashboard.', tag: 'Ongoing' },
                    ].map((s, i) => (
                      <motion.div
                        key={s.title}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.12 }}
                        className="flex items-start gap-4 rounded-2xl border border-ink/[0.06] p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orbit-50 text-orbit-600">
                          <s.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-extrabold text-ink">{s.title}</p>
                            <span className="rounded-full bg-mint-500/10 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-mint-500">
                              {s.tag}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-ink/55">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-6 rounded-2xl bg-orbit-50 p-4 text-center text-sm font-semibold text-orbit-800">
                    Demo complete — in production this continues into e-KYC with our banking partner.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* sidebar — basket recap */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-ink p-7 text-white">
              <h3 className="text-lg font-extrabold">Financing summary</h3>
              {items.length === 0 ? (
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  Your basket is empty. You can still check eligibility — your credit line
                  will be ready when you add courses and add-ons.
                </p>
              ) : (
                <div className="mt-5 space-y-2.5">
                  {items.slice(0, 5).map((it) => (
                    <div key={it.key} className="flex items-center justify-between rounded-xl bg-white/[0.07] px-4 py-2.5">
                      <span className="mr-3 line-clamp-1 text-sm text-white/75">{it.name}</span>
                      <span className="shrink-0 text-sm font-bold">{formatINR(it.amount)}</span>
                    </div>
                  ))}
                  {items.length > 5 && (
                    <p className="text-[12px] text-white/40">+ {items.length - 5} more items</p>
                  )}
                </div>
              )}
              <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                <span className="text-sm font-semibold text-white/55">Basket total</span>
                <span className="text-2xl font-extrabold">{formatINR(total)}</span>
              </div>
              {eligibility && (
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-sm font-semibold text-white/55">Approved line</span>
                  <span className="text-2xl font-extrabold text-mint-400">{formatINR(eligibility.creditLine)}</span>
                </div>
              )}
              <Link to="/basket" className="mt-6 block text-center text-sm font-bold text-orbit-300 hover:text-orbit-200">
                Edit basket →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
