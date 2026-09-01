import { ArrowUpRight, BadgeCheck, Banknote, Building2, Compass, Eye, FileCheck2, GraduationCap, IdCard, Landmark, LayoutDashboard, PiggyBank, Send, ShieldCheck, Smartphone, Sparkles, Store, Users, Wallet } from 'lucide-react'
import { Reveal } from '../components/ui'
import campus from '../assets/campus-dusk.jpg'

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

export default function Audiences() {
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
