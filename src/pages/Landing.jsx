import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Eye,
  Wallet,
  Building2,
  Landmark,
  ShieldCheck,
  Smartphone,
  ShoppingBasket,
  FileCheck2,
  BadgeCheck,
  Send,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  Bus,
  BookOpen,
  Laptop,
  Store,
  PiggyBank,
  IdCard,
  Tag,
  Compass,
  Newspaper,
  Users,
  Lock,
  UserCheck,
  CreditCard,
  Banknote,
  ArrowUpRight,
  Gauge,
  Percent,
  CalendarCheck,
  CircleSlash,
  Bot,
  PlayCircle,
} from 'lucide-react'
import { Reveal } from '../components/ui'
import flatlay from '../assets/basket-flatlay.jpg'
import campus from '../assets/campus-dusk.jpg'
import trails from '../assets/orbit-trails.jpg'
import parents from '../assets/parent-morning.jpg'

// TODO(orbitaly): set the partnerships inbox before launch. While this is empty
// the "Partner With Us" buttons fall back to scrolling to the partners section.
const CONTACT_EMAIL = ''

/* Scroll-linked parallax that flattens to a no-op when the visitor has asked
   the OS for reduced motion. Every drifting layer on this page goes through it. */
function useParallax(ref, from, to) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [from, to])
}

/* ---------------------------------- Hero --------------------------------- */

// The platform's surface area, as a student actually meets it. The hero shows
// the breadth by cycling through it rather than claiming it in a sentence.
const modules = [
  {
    key: 'ai',
    label: 'AI study buddy',
    icon: Bot,
    meta: 'every subject · 24/7',
    body: (
      <div className="space-y-2.5">
        <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-orbit-600 px-3.5 py-2.5 text-[13px] font-medium leading-relaxed text-white">
          Explain Bayes’ theorem like I’m in a hurry
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2.5 text-[13px] leading-relaxed text-white/75">
          It’s belief-updating. Start with what you assumed, weigh it by how well the new
          evidence fits, normalise. Want the exam-style derivation next?
        </div>
        <div className="flex items-center gap-2 pt-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
          <span className="font-mono text-[10px] text-white/40">
            answered in 1.2s · from your syllabus
          </span>
        </div>
      </div>
    ),
  },
  {
    key: 'fees',
    label: 'Fees & financing',
    icon: Wallet,
    meta: 'one EMI',
    body: (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          Sanctioned credit line
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-white">₹4,00,000</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-orbit-500 to-orbit-300" />
        </div>
        <div className="mt-4 space-y-2">
          {[
            ['Institute', '15 Aug', '₹50,000'],
            ['Hostel', '1 Aug', '₹8,000'],
          ].map(([who, when, amt]) => (
            <div key={who} className="flex items-center gap-3 text-[13px]">
              <span className="flex-1 font-semibold text-white/90">{who}</span>
              <span className="font-mono text-[10px] text-white/35">{when}</span>
              <span className="font-mono text-white/90">{amt}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.06] px-3.5 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
            One EMI · auto-debit 5th
          </span>
          <span className="font-mono text-[13px] font-semibold text-white">₹12,400</span>
        </div>
      </div>
    ),
  },
  {
    key: 'courses',
    label: 'Courses',
    icon: PlayCircle,
    meta: '3 active',
    body: (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          Enrolled · stream or download
        </p>
        <div className="mt-3.5 space-y-3.5">
          {[
            ['Data structures in Java', 68],
            ['Spoken English · advanced', 41],
            ['UPSC prelims crash course', 12],
          ].map(([name, pct]) => (
            <div key={name}>
              <div className="flex justify-between text-[12px]">
                <span className="font-semibold text-white/90">{name}</span>
                <span className="font-mono text-[10px] text-white/40">{pct}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-orbit-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] text-white/35">
          Added to the basket · financed with the fees
        </p>
      </div>
    ),
  },
  {
    key: 'deals',
    label: 'ID & deals',
    icon: IdCard,
    meta: 'verified',
    body: (
      <div>
        <div className="flex items-center gap-2.5 rounded-xl bg-mint-500/10 px-3.5 py-3">
          <IdCard className="h-4 w-4 shrink-0 text-mint-400" />
          <span className="text-[12px] font-semibold text-white/85">Student ID verified</span>
          <span className="ml-auto font-mono text-[10px] text-mint-400">active</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            ['Campus café', '15% off'],
            ['Stationery & print', '20% off'],
            ['Bus pass top-up', '₹120 back'],
          ].map(([who, offer]) => (
            <div key={who} className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3.5 py-2.5">
              <span className="text-[12px] font-medium text-white/80">{who}</span>
              <span className="font-mono text-[11px] font-semibold text-orbit-300">{offer}</span>
            </div>
          ))}
        </div>
        <p className="mt-3.5 font-mono text-[10px] text-white/35">12 more within 2 km of campus</p>
      </div>
    ),
  },
  {
    key: 'career',
    label: 'Career',
    icon: Compass,
    meta: '1:1 booked',
    body: (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          Next session
        </p>
        <div className="mt-3 rounded-xl border border-orbit-500/30 bg-orbit-600/10 px-4 py-3.5">
          <p className="text-[13px] font-bold text-white">Choosing between M.Tech and a job</p>
          <p className="mt-1 font-mono text-[10px] text-white/45">Friday · 5:30 pm · 45 min</p>
        </div>
        <div className="mt-3 space-y-2">
          {[
            ['Psychometric assessment', 'complete'],
            ['Résumé review', '2 slots open'],
          ].map(([what, state]) => (
            <div key={what} className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3.5 py-2.5">
              <span className="text-[12px] font-medium text-white/80">{what}</span>
              <span className="font-mono text-[10px] text-white/40">{state}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function ModuleDeck() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (reduce || held) return
    const id = setInterval(() => setActive((a) => (a + 1) % modules.length), 3800)
    return () => clearInterval(id)
  }, [reduce, held])

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      {/* top-[76px] leaves room for the four cards behind to stack upward */}
      <div className="relative h-[430px]">
        {modules.map((m, i) => {
          const offset = (i - active + modules.length) % modules.length
          return (
            <motion.div
              key={m.key}
              className="absolute inset-x-0 top-[76px] rounded-3xl border border-white/10 bg-ink-soft/85 p-5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              style={{ zIndex: modules.length - offset }}
              animate={{
                y: offset * -19,
                scale: 1 - offset * 0.038,
                opacity: offset > 3 ? 0 : 1 - offset * 0.16,
              }}
              transition={{ duration: 0.55, ease: [0.21, 0.65, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center gap-2.5 border-b border-white/[0.07] pb-3.5">
                <m.icon className="h-4 w-4 shrink-0 text-orbit-300" />
                <span className="text-[13px] font-bold text-white">{m.label}</span>
                <span className="ml-auto font-mono text-[10px] text-white/35">{m.meta}</span>
              </div>
              {m.body}
            </motion.div>
          )
        })}
      </div>

      {/* the deck's index — also the plainest statement of what's on the platform */}
      <div className="mt-6 flex flex-wrap gap-x-1 gap-y-1.5">
        {modules.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
              i === active
                ? 'bg-white/10 text-orbit-200'
                : 'text-white/35 hover:bg-white/5 hover:text-white/60'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const reduce = useReducedMotion()
  const yText = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90])
  const yDeck = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -110])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0">
        {/* one light source, not three — the deck carries the visual weight */}
        <div className="absolute right-[4%] top-[6%] h-[720px] w-[720px] rounded-full bg-orbit-700/25 blur-[170px]" />
        {/* ruled grid: this is an operating system, not a marketing gradient */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '76px 76px',
            maskImage: 'radial-gradient(ellipse 85% 65% at 45% 40%, #000 35%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 65% at 45% 40%, #000 35%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-x-16 gap-y-14 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:px-8">
        <motion.div style={{ y: yText, opacity }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.22em] text-orbit-300"
          >
            Student OS · built for India
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 text-5xl font-black leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
          >
            Everything college
            <br />
            asks for.
            <br />
            <span className="text-orbit-300">One login.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/60"
          >
            Fees and financing, hostel and mess, online courses, an AI study buddy, student
            deals and career guidance. One place for the whole of student life — instead of a
            dozen apps and five separate due dates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#partners"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-ink transition-transform hover:scale-[1.04]"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/20 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yDeck, opacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex justify-center lg:justify-end"
        >
          <ModuleDeck />
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-9 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Scroll
        </span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
          style={{ transformOrigin: 'top' }}
          animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

/* --------------------------------- Problem -------------------------------- */

function Problem() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [110, -110])

  const scattered = [
    { label: 'Tuition portal', pos: 'left-0 top-4' },
    { label: 'Hostel vendor', pos: 'right-8 top-0' },
    { label: 'Book store', pos: 'left-10 top-32' },
    { label: 'Transport agency', pos: 'right-0 top-40' },
    { label: 'Pocket money UPI', pos: 'left-4 top-64' },
    { label: 'Exam fee counter', pos: 'right-12 top-72' },
  ]

  return (
    <section ref={ref} className="overflow-hidden bg-white py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Reveal>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-600">
              The problem
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Education expenses are no longer limited to course fees
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
              Parents juggle multiple vendors, payment cycles and follow-ups — tuition here,
              hostel there, books somewhere else. Orbitaly centralises every education
              expense into a single basket with one application, one approval and one
              dashboard.
            </p>
            <a
              href="#how-it-works"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            >
              See how it works <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="relative h-[420px]">
          {/* scattered chaos drifts at one speed… */}
          <motion.div style={{ y: y1 }} className="absolute inset-0">
            {scattered.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`absolute ${s.pos} rotate-[-2deg] rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink/50 shadow-lg`}
                style={{ rotate: `${(i % 2 ? 1 : -1) * (2 + i)}deg` }}
              >
                {s.label}
              </motion.div>
            ))}
          </motion.div>
          {/* …while the Orbitaly card floats above at another */}
          <motion.div style={{ y: y2 }} className="absolute inset-x-8 top-24">
            <div className="rounded-3xl bg-ink p-7 shadow-2xl">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 100 100" className="h-7 w-7">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#818cf8" strokeWidth="9" />
                  <circle cx="50" cy="50" r="16" fill="#818cf8" />
                </svg>
                <span className="font-extrabold text-white">Orbitaly</span>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-white">
                One basket. One approval.
                <br />
                Every expense tracked.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Tuition', 'Hostel', 'Books', 'Transport', 'Allowance'].map((t) => (
                  <span key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-orbit-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- Basket --------------------------------- */

// The six configurable categories. `route` is the real distinction that makes
// the model work: onboarded vendors are paid into their account, everything
// else lands on a prepaid card in the student's name — never cash.
const basketLines = [
  { icon: Building2, label: 'Institute / college fee', cycle: 'per term', route: 'direct' },
  { icon: BedDouble, label: 'Hostel or PG rent', cycle: 'monthly', route: 'direct' },
  { icon: UtensilsCrossed, label: 'Mess & meal plan', cycle: 'monthly', route: 'direct' },
  { icon: Bus, label: 'Commute pass', cycle: 'monthly', route: 'direct' },
  { icon: BookOpen, label: 'Books & study material', cycle: 'per semester', route: 'card' },
  { icon: Laptop, label: 'Laptop, uniform, insurance', cycle: 'one-time', route: 'card' },
]

function Basket() {
  const ref = useRef(null)
  const yImage = useParallax(ref, -40, 60)
  const yCard = useParallax(ref, 80, -80)

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-28">
      {/* the things the money actually buys, drifting behind the statement */}
      <motion.div style={{ y: yImage }} className="pointer-events-none absolute inset-0 -top-16 -bottom-16">
        <img
          src={flatlay}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <Reveal>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-300">
            What's in the basket
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            A term costs more than
            <br />a term's tuition
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            The institute fee is line one. Hostel, mess, commute, books and the laptop are
            lines two through six — and those are the ones families end up paying vendor by
            vendor, out of pocket, on six different due dates.
          </p>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/60">
            Orbitaly puts all six in a single basket, financed together and repaid as one EMI.
            Categories are configurable, so a new city or institute can be onboarded without
            a code release.
          </p>
        </Reveal>

        <motion.div style={{ y: yCard }}>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Education basket
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                  One academic year
                </span>
              </div>

              <ul className="mt-2 divide-y divide-white/[0.07]">
                {basketLines.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: 0.12 + i * 0.09, duration: 0.5 }}
                    className="flex items-center gap-4 py-3.5"
                  >
                    <l.icon className="h-4.5 w-4.5 shrink-0 text-orbit-300" />
                    <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white">
                      {l.label}
                    </span>
                    <span className="hidden font-mono text-[11px] text-white/40 sm:block">
                      {l.cycle}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                        l.route === 'direct'
                          ? 'bg-mint-500/15 text-mint-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          l.route === 'direct' ? 'bg-mint-400' : 'bg-amber-400'
                        }`}
                      />
                      {l.route === 'direct' ? 'vendor' : 'card'}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/55">
                <p className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-400" />
                  <span>
                    <b className="font-semibold text-white/80">Vendor</b> — paid straight into
                    the onboarded institute, hostel, mess or transport partner's account.
                  </span>
                </p>
                <p className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>
                    <b className="font-semibold text-white/80">Card</b> — where a vendor can't
                    be onboarded, funds load onto a prepaid card in the student's name. Still
                    not cash.
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------------------- Audiences ------------------------------- */

const audiences = [
  {
    icon: GraduationCap,
    title: 'Parents',
    accent: 'bg-orbit-600',
    points: [
      { icon: Eye, text: 'One dashboard for every disbursement, amount and date' },
      { icon: Wallet, text: 'Pocket money with category caps and spend alerts' },
      { icon: Smartphone, text: 'Digital-first — no branch visits required' },
      { icon: Users, text: 'Multi-child support for families with more than one dependent' },
    ],
  },
  {
    icon: Sparkles,
    title: 'Students',
    accent: 'bg-fuchsia-600',
    points: [
      { icon: PiggyBank, text: 'A wallet and budgeting tools built for an allowance' },
      { icon: IdCard, text: 'A verified student ID that unlocks partner pricing' },
      { icon: Compass, text: 'Career counselling, skilling and mentorship in-app' },
    ],
  },
  {
    icon: Building2,
    title: 'Institutes',
    accent: 'bg-cyan-600',
    points: [
      { icon: BadgeCheck, text: 'Fees collected on time, with less manual follow-up' },
      { icon: Send, text: 'Convert admissions remotely with a digital financing path' },
      { icon: LayoutDashboard, text: 'Multi-campus distribution without per-partner engineering' },
    ],
  },
  {
    icon: Store,
    title: 'Hostels, mess & commute',
    accent: 'bg-amber-600',
    points: [
      { icon: Send, text: 'Predictable payouts on a fixed cycle, not chased family by family' },
      { icon: FileCheck2, text: 'Onboarding with document verification and clear payout rules' },
      { icon: Users, text: 'Access to a ready student base near your location' },
    ],
  },
  {
    icon: Landmark,
    title: 'Banks & NBFCs',
    accent: 'bg-mint-500',
    points: [
      { icon: ShieldCheck, text: 'End-use verifiable by construction — funds reach vendors, not cash' },
      { icon: Smartphone, text: 'Digital origination with e-KYC, e-sign and e-mandate built in' },
      { icon: Building2, text: 'Institution-led acquisition instead of open-market sourcing' },
    ],
  },
]

function Audiences() {
  return (
    <section id="partners" className="scroll-mt-16 bg-[#f6f6fb] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-600">
            One ecosystem
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Five sides of the same transaction
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/60">
            A basket only works if every party in it is better off. Here's what each one gets.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="group h-full rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.accent} text-white`}>
                  <a.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">{a.title}</h3>
                <ul className="mt-6 space-y-4">
                  {a.points.map((p) => (
                    <li key={p.text} className="flex gap-3">
                      <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-orbit-500" />
                      <span className="text-[15px] leading-relaxed text-ink/70">{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* sixth cell — the grid's odd slot, doing something useful */}
          <Reveal delay={0.4}>
            <a
              href="#contact"
              className="group flex h-full flex-col justify-between rounded-3xl bg-ink p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-white">
                  Don't see your side of it?
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  Book publishers, device retailers, insurers, coaching centres — the basket is
                  configurable, and new categories are onboarded without a code release.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-orbit-300">
                Talk to us
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- How it works ---------------------------- */

// A real sequence, so the numbering carries information rather than decorating.
const steps = [
  { icon: ShoppingBasket, title: 'Build the basket', desc: 'Pick the institute and programme, then add hostel, mess, commute, books and any add-ons.' },
  { icon: Wallet, title: 'See what it costs', desc: 'Affordability and the indicative EMI recalculate live as lines go in and out of the basket.' },
  { icon: FileCheck2, title: 'Apply once', desc: 'A single digital application covers the whole basket — e-KYC, e-sign and e-mandate, no branch visit.' },
  { icon: BadgeCheck, title: 'Partner lender decides', desc: 'The partner bank or NBFC runs its own rules engine and returns a credit line decision.' },
  { icon: Eye, title: 'Adjust, don’t restart', desc: 'If the sanctioned line comes in under the basket, the basket gets edited — not the application refiled.' },
  { icon: Send, title: 'Tranches go out', desc: 'Funds route to each vendor on their own cycle, and repayment applies only to what has been drawn.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-white py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-600">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            From basket to first disbursement
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/60">
            The journey we're building for launch, end to end.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-ink/[0.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orbit-200 hover:shadow-lg">
                <span className="absolute -right-2 -top-6 text-[88px] font-black leading-none text-ink/[0.04]">
                  {i + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orbit-50 text-orbit-600">
                  <s.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Disbursement ------------------------------ */

const CX = 310
const CY = 300
const pt = (r, deg) => [
  CX + r * Math.cos((deg * Math.PI) / 180),
  CY + r * Math.sin((deg * Math.PI) / 180),
]

// Orbital radius encodes payment frequency: the tighter the orbit, the shorter
// the cycle. Monthly vendors sit closest, one-time purchases furthest out.
const orbitRings = [
  { r: 118, spin: 34 },
  { r: 196, spin: 52 },
  { r: 252, spin: 76 },
]

const orbitNodes = [
  { label: 'Hostel', r: 118, angle: -90, cycle: 'monthly', pulse: 2.4, icon: BedDouble },
  { label: 'Mess', r: 118, angle: 20, cycle: 'monthly', pulse: 2.4, icon: UtensilsCrossed },
  { label: 'Commute', r: 118, angle: 160, cycle: 'monthly', pulse: 2.4, icon: Bus },
  { label: 'Institute', r: 196, angle: -35, cycle: 'per term', pulse: 3.6, icon: Building2 },
  { label: 'Books', r: 196, angle: 215, cycle: 'per semester', pulse: 3.6, icon: BookOpen },
  { label: 'Add-ons', r: 252, angle: 90, cycle: 'one-time', pulse: 5, icon: Laptop },
]

function DisbursementOrbit() {
  const reduce = useReducedMotion()

  return (
    <svg viewBox="0 0 620 660" className="h-auto w-full" role="img"
      aria-label="Orbitaly at the centre, routing tranches outward to the institute, hostel, mess, commute, books and add-on vendors, each on its own payment cycle.">
      <defs>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* dashed rings — rotation is only legible because they're dashed */}
      {orbitRings.map((ring) => (
        <motion.circle
          key={ring.r}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill="none"
          stroke="rgba(129,140,248,0.22)"
          strokeWidth="1"
          strokeDasharray="3 9"
          style={{ transformBox: 'view-box', transformOrigin: `${CX}px ${CY}px` }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: ring.spin, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <circle cx={CX} cy={CY} r="150" fill="url(#coreGlow)" />

      {orbitNodes.map((n, i) => {
        const [x, y] = pt(n.r, n.angle)
        return (
          <g key={n.label}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(129,140,248,0.16)" strokeWidth="1" />

            {/* a tranche travelling out to its vendor, on that vendor's cycle */}
            {!reduce && (
              <motion.circle
                r="4"
                fill="#34d399"
                initial={{ cx: CX, cy: CY, opacity: 0 }}
                animate={{ cx: [CX, x], cy: [CY, y], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: n.pulse,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: 'easeInOut',
                  repeatDelay: 0.5,
                }}
              />
            )}

            <circle cx={x} cy={y} r="26" fill="#14132a" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" />
            <g transform={`translate(${x - 10}, ${y - 10})`}>
              <n.icon width="20" height="20" color="#a5b4fc" />
            </g>
            <text
              x={x}
              y={y + 46}
              textAnchor="middle"
              className="hidden fill-white text-[15px] font-bold md:block"
            >
              {n.label}
            </text>
            <text
              x={x}
              y={y + 63}
              textAnchor="middle"
              className="hidden fill-white/40 font-mono text-[11px] md:block"
            >
              {n.cycle}
            </text>
          </g>
        )
      })}

      {/* the centre: one credit line */}
      <circle cx={CX} cy={CY} r="46" fill="#0f0e1a" stroke="#818cf8" strokeWidth="2" />
      <circle cx={CX} cy={CY} r="30" fill="none" stroke="#818cf8" strokeWidth="4" />
      <circle cx={CX} cy={CY} r="11" fill="#818cf8" />
    </svg>
  )
}

function Disbursement() {
  const ref = useRef(null)
  const yBg = useParallax(ref, -60, 90)
  const yDiagram = useParallax(ref, 60, -70)

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-28">
      <motion.div style={{ y: yBg }} className="pointer-events-none absolute inset-0 -top-24 -bottom-24">
        <img src={trails} alt="" aria-hidden="true"
          loading="lazy"
          decoding="async" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-300">
            Disbursement
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            The money never passes
            <br />through anyone's hands
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            A sanctioned basket isn't paid out as a lump sum. It's split into tranches and
            routed to each vendor on that vendor's own cycle — the hostel monthly, the
            institute per term, the laptop once. The parent repays a single EMI, and only on
            what has actually been drawn.
          </p>
        </Reveal>

        <motion.div style={{ y: yDiagram }} className="mx-auto mt-12 max-w-2xl">
          <DisbursementOrbit />
        </motion.div>

        {/* the diagram's labels are hidden on small screens — this carries them */}
        <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-x-6 gap-y-2 md:hidden">
          {orbitNodes.map((n) => (
            <div key={n.label} className="flex items-baseline justify-between border-b border-white/10 py-1.5">
              <span className="text-sm font-semibold text-white">{n.label}</span>
              <span className="font-mono text-[10px] text-white/40">{n.cycle}</span>
            </div>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-14 max-w-2xl text-center text-[15px] leading-relaxed text-white/45">
            Because funds land with vendors rather than as cash with the borrower, end-use is
            verifiable by construction — which is what a lending partner needs to see.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

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

function ParentApp() {
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

/* ------------------------------- Student app ------------------------------ */

const studentFeatures = [
  { icon: Wallet, title: 'Pocket money wallet', desc: 'Parent tops up; the student spends from a linked wallet or prepaid card.' },
  { icon: PiggyBank, title: 'Budgeting that sticks', desc: 'Categorised spends, savings goals, and a monthly view of where it went.' },
  { icon: IdCard, title: 'Verified student ID', desc: 'One digital identity that unlocks student pricing across partner brands.' },
  { icon: Tag, title: 'Deals worth opening', desc: 'Student-only discounts and cashback, in one place instead of a dozen apps.' },
  { icon: Compass, title: 'Career counselling', desc: '1:1 sessions with onboarded counsellors, plus psychometric assessments.' },
  { icon: Newspaper, title: 'Content & community', desc: 'Exam alerts, scholarship deadlines, peer Q&A and senior mentorship.' },
]

function StudentApp() {
  const ref = useRef(null)
  const yPhoto = useParallax(ref, -70, 70)
  const yPhone = useParallax(ref, 110, -110)

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-28">
      <motion.div style={{ y: yPhoto }} className="pointer-events-none absolute inset-0 -top-24 -bottom-24">
        <img src={campus} alt="" aria-hidden="true"
          loading="lazy"
          decoding="async" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        <div>
          <Reveal>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-300">
              The second app
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              The other half of Orbitaly
              <br />lives on the student's phone
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Financing is the parent's side of the product. The student gets something they
              open every day: pocket money they can actually track, a verified student identity,
              deals worth using, and guidance for what comes after the degree.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {studentFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="flex gap-3.5">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-orbit-400" />
                  <div>
                    <h3 className="text-[15px] font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <motion.div style={{ y: yPhone }} className="flex justify-center lg:justify-end">
          <Reveal delay={0.15}>
            <div className="w-[280px] rounded-[2.75rem] border border-white/15 bg-ink-soft p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-[#181733] to-[#0f0e1a] p-5">
                <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Pocket money
                </p>
                <p className="mt-1.5 font-mono text-3xl font-semibold tracking-tight text-white">
                  ₹4,200
                </p>
                <p className="mt-1 text-[11px] text-white/40">Left this month · tops up on the 1st</p>

                <div className="mt-6 space-y-3.5">
                  {[
                    { label: 'Food', pct: 62, tone: 'bg-orbit-400' },
                    { label: 'Travel', pct: 38, tone: 'bg-cyan-400' },
                    { label: 'Books', pct: 24, tone: 'bg-mint-400' },
                  ].map((b, i) => (
                    <div key={b.label}>
                      <div className="flex justify-between font-mono text-[10px] text-white/45">
                        <span>{b.label}</span>
                        <span>{b.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className={`h-full rounded-full ${b.tone}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-white/[0.06] px-3.5 py-3">
                  <IdCard className="h-4 w-4 shrink-0 text-mint-400" />
                  <span className="text-[11px] font-semibold text-white/80">Student ID verified</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl bg-white/[0.06] px-3.5 py-3">
                  <Tag className="h-4 w-4 shrink-0 text-orbit-300" />
                  <span className="text-[11px] font-semibold text-white/80">12 deals near campus</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
              Illustrative interface
            </p>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------- Compliance ------------------------------- */

const commitments = [
  {
    icon: Landmark,
    term: 'Who lends',
    detail:
      'Credit is provided by a licensed bank or NBFC partner. Orbitaly is the origination, basket and disbursement layer — not a lender, and not a bank.',
  },
  {
    icon: Lock,
    term: 'Where funds go',
    detail:
      'Disbursements route to onboarded vendors, or onto a prepaid card in the student’s name. Cash is never released to the borrower.',
  },
  {
    icon: UserCheck,
    term: 'Students under 18',
    detail:
      'Onboarded only with explicit parental consent, with data collection restricted accordingly.',
  },
  {
    icon: CreditCard,
    term: 'Documents & data',
    detail:
      'KYC and income verification are being built on the Account Aggregator and DigiLocker rails, so families share less and verify faster.',
  },
]

function Compliance() {
  return (
    <section className="border-t border-white/[0.07] bg-ink py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orbit-300">
            How it's structured
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A lending product should be clear about who is lending
          </h2>
        </Reveal>

        <dl className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {commitments.map((c, i) => (
            <Reveal key={c.term} delay={i * 0.07}>
              <div className="flex gap-4 border-t border-white/10 pt-5">
                <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-orbit-400" />
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {c.term}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-white/70">{c.detail}</dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------------------------------- CTA ----------------------------------- */

function CTA() {
  return (
    <section id="contact" className="scroll-mt-16 bg-ink pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-soft px-8 py-20 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-orbit-600/40 blur-[100px]" />
              <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-[100px]" />
            </div>
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Ready to fund the full journey — not just the fees?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
                We're building Orbitaly alongside institutions, lending partners, hostels and
                merchants across India. Tell us which side of the basket you're on.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=Orbitaly%20partnership%20enquiry` : '#partners'}
                  className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-ink transition-transform hover:scale-[1.04]"
                >
                  Partner With Us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <main>
      <Hero />
      <Problem />
      <Basket />
      <ParentApp />
      <StudentApp />
      <HowItWorks />
      <Disbursement />
      <Audiences />
      <Compliance />
      <CTA />
    </main>
  )
}
