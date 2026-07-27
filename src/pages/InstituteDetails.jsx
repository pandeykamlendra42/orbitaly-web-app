import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  Users,
  CalendarDays,
  BadgeCheck,
  Check,
  Plus,
  BedDouble,
  Bus,
  BookOpen,
  UtensilsCrossed,
  Laptop,
  FileCheck2,
  Wallet,
  Shirt,
  ShoppingBasket,
  Sparkles,
} from 'lucide-react'
import { getInstitute, CATEGORIES, formatINR } from '../data/institutes'
import { useBasket } from '../context/BasketContext'
import { InstituteCover } from '../components/ui'

const ICONS = { BedDouble, Bus, BookOpen, UtensilsCrossed, Laptop, FileCheck2, Wallet, Shirt }

export default function InstituteDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inst = getInstitute(id)
  const { addItem, hasItem, items, total } = useBasket()

  const [city, setCity] = useState(inst?.cities[0] ?? '')
  const [courseId, setCourseId] = useState(inst?.courses[0]?.id ?? '')

  const course = useMemo(() => inst?.courses.find((c) => c.id === courseId), [inst, courseId])

  if (!inst) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6fb] pt-16">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-ink">Institute not found</p>
          <Link to="/marketplace" className="mt-4 inline-block font-bold text-orbit-600">
            ← Back to marketplace
          </Link>
        </div>
      </main>
    )
  }

  const courseInBasket = hasItem(inst.id, 'course', `${courseId}:${city}`)
  const instituteItems = items.filter((i) => i.instituteId === inst.id)

  const addCourse = () =>
    addItem({
      instituteId: inst.id,
      instituteName: inst.name,
      city,
      type: 'course',
      refId: `${courseId}:${city}`,
      name: course.name,
      meta: `${course.degree} · ${course.duration} · ${city}`,
      amount: course.fee,
    })

  const addAddon = (a) =>
    addItem({
      instituteId: inst.id,
      instituteName: inst.name,
      city,
      type: 'addon',
      refId: a.id,
      name: a.name,
      meta: a.desc,
      amount: a.amount,
    })

  return (
    <main className="min-h-screen bg-[#f6f6fb] pb-24 pt-16">
      {/* hero banner */}
      <InstituteCover institute={inst} className="h-64 sm:h-72">
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink">
              {CATEGORIES.find((c) => c.id === inst.category)?.label}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-ink/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {inst.rating} ({inst.reviews.toLocaleString('en-IN')} reviews)
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {inst.name}
          </h1>
        </div>
      </InstituteCover>

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        {/* left column */}
        <div className="space-y-8">
          {/* quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {[
              { icon: Users, label: 'Students', value: inst.students },
              { icon: CalendarDays, label: 'Established', value: inst.established },
              { icon: BadgeCheck, label: 'Accreditation', value: inst.accreditation },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-white p-4">
                <f.icon className="h-5 w-5 text-orbit-500" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink/40">{f.label}</p>
                <p className="text-sm font-extrabold text-ink">{f.value}</p>
              </div>
            ))}
          </motion.div>

          {/* about */}
          <section className="rounded-3xl bg-white p-7">
            <h2 className="text-xl font-extrabold text-ink">About</h2>
            <p className="mt-3 leading-relaxed text-ink/65">{inst.about}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {inst.highlights.map((h) => (
                <span key={h} className="flex items-center gap-1.5 rounded-full bg-orbit-50 px-3.5 py-1.5 text-[13px] font-bold text-orbit-700">
                  <Sparkles className="h-3.5 w-3.5" /> {h}
                </span>
              ))}
            </div>
          </section>

          {/* step 1 — city */}
          <section className="rounded-3xl bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-black text-white">1</span>
              <h2 className="text-xl font-extrabold text-ink">Choose your campus city</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {inst.cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                    city === c
                      ? 'bg-orbit-600 text-white shadow-lg shadow-orbit-600/25'
                      : 'bg-ink/[0.04] text-ink/70 hover:bg-ink/10'
                  }`}
                >
                  <MapPin className="h-4 w-4" /> {c}
                </button>
              ))}
            </div>
          </section>

          {/* step 2 — course */}
          <section className="rounded-3xl bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-black text-white">2</span>
              <h2 className="text-xl font-extrabold text-ink">Select a course</h2>
            </div>
            <div className="mt-5 space-y-3">
              {inst.courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCourseId(c.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                    courseId === c.id
                      ? 'border-orbit-500 bg-orbit-50/60'
                      : 'border-ink/[0.06] hover:border-ink/20'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-ink">{c.name}</p>
                    <p className="mt-0.5 text-[13px] font-medium text-ink/50">
                      {c.degree} · {c.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-ink">{formatINR(c.fee)}</p>
                    <p className="text-[12px] font-semibold text-ink/40">per year</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={addCourse}
              disabled={courseInBasket}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all ${
                courseInBasket
                  ? 'bg-mint-500/15 text-mint-500'
                  : 'bg-ink text-white hover:scale-[1.01] hover:bg-ink-soft'
              }`}
            >
              {courseInBasket ? (
                <>
                  <Check className="h-5 w-5" /> Tuition added to basket
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" /> Add tuition to basket · {formatINR(course.fee)}
                </>
              )}
            </button>
          </section>

          {/* step 3 — add-ons */}
          <section className="rounded-3xl bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-black text-white">3</span>
              <div>
                <h2 className="text-xl font-extrabold text-ink">Beyond tuition — financed add-ons</h2>
                <p className="text-sm text-ink/50">
                  Everything this institute lets you finance through Orbitaly.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {inst.addons.map((a) => {
                const Icon = ICONS[a.icon] ?? Wallet
                const added = hasItem(inst.id, 'addon', a.id)
                return (
                  <div
                    key={a.id}
                    className={`flex flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
                      added ? 'border-mint-400/60 bg-mint-500/[0.06]' : 'border-ink/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-50 text-orbit-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="font-extrabold text-ink">{formatINR(a.amount)}</p>
                      </div>
                      <p className="mt-3 font-bold text-ink">{a.name}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink/50">{a.desc}</p>
                    </div>
                    <button
                      onClick={() => addAddon(a)}
                      disabled={added}
                      className={`mt-4 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition-colors ${
                        added
                          ? 'bg-mint-500/15 text-mint-500'
                          : 'bg-ink/[0.05] text-ink hover:bg-ink hover:text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Add to basket
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* right column — sticky basket summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-7 text-white shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <ShoppingBasket className="h-5 w-5 text-orbit-300" />
              </div>
              <div>
                <h3 className="font-extrabold">Your Education Basket</h3>
                <p className="text-[13px] text-white/50">
                  {items.length} item{items.length !== 1 && 's'} · all institutes
                </p>
              </div>
            </div>

            <div className="mt-6 min-h-[60px] space-y-2.5">
              <AnimatePresence initial={false}>
                {instituteItems.length === 0 && items.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm leading-relaxed text-white/45"
                  >
                    Add tuition and add-ons to build your basket, then check your financing
                    eligibility in one step.
                  </motion.p>
                )}
                {instituteItems.map((it) => (
                  <motion.div
                    key={it.key}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between rounded-xl bg-white/[0.07] px-4 py-2.5"
                  >
                    <span className="mr-3 line-clamp-1 text-sm text-white/75">{it.name}</span>
                    <span className="shrink-0 text-sm font-bold">{formatINR(it.amount)}</span>
                  </motion.div>
                ))}
                {items.length > instituteItems.length && (
                  <p className="text-[12px] font-medium text-white/40">
                    + {items.length - instituteItems.length} item(s) from other institutes
                  </p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-white/55">Basket total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.15, color: '#a5b4fc' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-3xl font-extrabold tracking-tight"
                >
                  {formatINR(total)}
                </motion.span>
              </div>
              <Link
                to="/basket"
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all ${
                  items.length
                    ? 'bg-white text-ink hover:scale-[1.02]'
                    : 'pointer-events-none bg-white/10 text-white/35'
                }`}
              >
                Review basket <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-[12px] text-white/40">
                No branch visits · instant in-principle decision
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
