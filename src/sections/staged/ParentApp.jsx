import { useRef } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, CircleSlash, Gauge, Percent, Users } from 'lucide-react'
import { Reveal } from '../components/ui'
import { useParallax } from '../lib/useParallax'
import parents from '../assets/parent-morning.jpg'

/* ------------------------------- Parent app ------------------------------- */

const parentFeatures = [
  {
    icon: Gauge,
    title: 'One sanctioned limit',
    desc: 'A pre-approved credit line the family draws against for any approved education expense — this term’s hostel, next term’s fees, a laptop in between. Apply once, not per bill.',
  },
  {
    icon: Percent,
    title: 'Interest on what’s drawn',
    desc: 'Repayment is calculated on the tranches actually disbursed, not on the whole sanctioned line. An unused limit costs nothing to hold.',
  },
  {
    icon: CalendarCheck,
    title: 'One EMI, every vendor',
    desc: 'The institute, hostel, mess and commute partner each settle on their own cycle. The family sees a single auto-debit on a single date.',
  },
  {
    icon: CircleSlash,
    title: 'Stop a payout before it leaves',
    desc: 'Upcoming disbursements are visible in advance, and a scheduled payout to any vendor can be cancelled — if your child moves out of the hostel, that line stops.',
  },
  {
    icon: Users,
    title: 'Every child in one login',
    desc: 'Families with more than one dependent on the platform manage all of them from the same dashboard.',
  },
]

// Illustrative figures for the dashboard mock — deliberately consistent with
// the ₹1,52,000 basket shown in the hero card.
const upcoming = [
  { vendor: 'Hostel', date: '1 Aug', amount: '₹8,000', cancellable: true },
  { vendor: 'Mess', date: '1 Aug', amount: '₹4,500', cancellable: true },
  { vendor: 'Institute', date: '15 Aug', amount: '₹50,000', cancellable: false },
]

export default function ParentApp() {
  const ref = useRef(null)
  const yPanel = useParallax(ref, 60, -50)

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-28">
      {/* soft daylight wash — the parent's side of the product is the lit one */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-orbit-100/60 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-100/70 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-x-16 gap-y-20 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        {/* photo with the dashboard overlapping it */}
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl">
            <img
              src={parents}
              alt="Parents at home reviewing their child's education financing on a phone."
              loading="lazy"
              decoding="async"
              className="aspect-[5/6] w-full object-cover"
            />
          </div>

          <motion.div
            style={{ y: yPanel }}
            className="mx-3 -mt-24 sm:absolute sm:-bottom-8 sm:left-8 sm:-right-4 sm:mx-0 sm:mt-0 lg:-right-10"
          >
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-ink/[0.07] bg-white/95 p-5 shadow-[0_30px_60px_-20px_rgba(15,14,26,0.35)] backdrop-blur-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                  Sanctioned credit line
                </p>
                <p className="mt-1 font-mono text-3xl font-semibold tracking-tight text-ink">
                  ₹4,00,000
                </p>

                <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orbit-600 to-orbit-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: '38%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-ink/50">
                  <span>Drawn ₹1,52,000</span>
                  <span>Available ₹2,48,000</span>
                </div>

                <p className="mt-5 border-t border-ink/[0.07] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                  Next disbursements
                </p>
                <ul className="mt-2.5 space-y-2">
                  {upcoming.map((u) => (
                    <li key={u.vendor} className="flex items-center gap-3 text-[13px]">
                      <span className="flex-1 font-semibold text-ink">{u.vendor}</span>
                      <span className="font-mono text-[11px] text-ink/45">{u.date}</span>
                      <span className="w-16 text-right font-mono font-medium text-ink">{u.amount}</span>
                      {u.cancellable ? (
                        <CircleSlash className="h-3.5 w-3.5 shrink-0 text-ink/30" />
                      ) : (
                        <span className="w-3.5 shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-orbit-50 px-3.5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-orbit-700">
                    One EMI · auto-debit 5th
                  </span>
                  <span className="font-mono text-sm font-semibold text-orbit-700">₹12,400</span>
                </div>
              </div>
              <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-ink/30">
                Illustrative dashboard
              </p>
            </Reveal>
          </motion.div>
        </div>

        <div>
          <Reveal>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-600">
              The parent dashboard
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Everything your child’s
              <br />education costs, on one screen
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
              A parent’s questions are simple ones: how much is approved, how much is left,
              what goes out next, and when. Orbitaly answers all four in the same place — and
              collapses five vendor relationships into a single monthly EMI.
            </p>
          </Reveal>

          <div className="mt-10 space-y-7">
            {parentFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orbit-50 text-orbit-600">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-extrabold tracking-tight text-ink">{f.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink/60">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
