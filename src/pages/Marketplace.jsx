import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, SlidersHorizontal, X } from 'lucide-react'
import { INSTITUTES, CITIES, CATEGORIES, FEE_RANGES, minFee, compactINR } from '../data/institutes'
import { InstituteCover, Chip, Reveal } from '../components/ui'

function InstituteCard({ inst, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link
        to={`/institute/${inst.id}`}
        className="group block h-full overflow-hidden rounded-3xl border border-ink/[0.06] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      >
        <InstituteCover institute={inst} className="h-44">
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
            {CATEGORIES.find((c) => c.id === inst.category)?.label}
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ink/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {inst.rating}
          </span>
        </InstituteCover>
        <div className="p-6">
          <h3 className="text-lg font-extrabold leading-snug text-ink group-hover:text-orbit-700">
            {inst.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-ink/55">{inst.tagline}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-ink/50">
            <MapPin className="h-3.5 w-3.5" />
            {inst.cities.join(' · ')}
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-ink/[0.06] pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
                Courses from
              </p>
              <p className="text-xl font-extrabold text-ink">
                {compactINR(minFee(inst))}
                <span className="text-sm font-semibold text-ink/40">/yr</span>
              </p>
            </div>
            <span className="rounded-full bg-orbit-50 px-4 py-2 text-[13px] font-bold text-orbit-700 transition-colors group-hover:bg-orbit-600 group-hover:text-white">
              View offers
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Marketplace() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('All')
  const [category, setCategory] = useState('all')
  const [feeRange, setFeeRange] = useState('all')

  const filtered = useMemo(() => {
    const range = FEE_RANGES.find((r) => r.id === feeRange)
    const q = query.trim().toLowerCase()
    return INSTITUTES.filter((inst) => {
      if (city !== 'All' && !inst.cities.includes(city)) return false
      if (category !== 'all' && inst.category !== category) return false
      if (range && feeRange !== 'all') {
        const fee = minFee(inst)
        if (fee < range.min || fee >= range.max) return false
      }
      if (q) {
        const hay = [inst.name, inst.tagline, ...inst.courses.map((c) => c.name)].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [query, city, category, feeRange])

  const activeCount = (city !== 'All') + (category !== 'all') + (feeRange !== 'all')

  return (
    <main className="min-h-screen bg-[#f6f6fb] pt-16">
      {/* header */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Institute Marketplace
            </h1>
            <p className="mt-3 max-w-xl text-lg text-ink/55">
              Browse financing-ready institutes, compare courses and build your Education
              Basket.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search institutes or courses…"
                className="w-full rounded-full border border-ink/10 bg-ink/[0.03] py-3.5 pl-12 pr-4 text-[15px] font-medium outline-none transition-all placeholder:text-ink/35 focus:border-orbit-400 focus:bg-white focus:ring-4 focus:ring-orbit-100"
              />
            </div>

            {/* filter rails */}
            <div className="space-y-3">
              <div className="scroll-thin flex items-center gap-2 overflow-x-auto pb-1">
                <span className="flex shrink-0 items-center gap-1.5 pr-1 text-[13px] font-bold text-ink/45">
                  <MapPin className="h-3.5 w-3.5" /> City
                </span>
                {['All', ...CITIES].map((c) => (
                  <Chip key={c} active={city === c} onClick={() => setCity(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
              <div className="scroll-thin flex items-center gap-2 overflow-x-auto pb-1">
                <span className="flex shrink-0 items-center gap-1.5 pr-1 text-[13px] font-bold text-ink/45">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Category
                </span>
                <Chip active={category === 'all'} onClick={() => setCategory('all')}>
                  All
                </Chip>
                {CATEGORIES.map((c) => (
                  <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
              <div className="scroll-thin flex items-center gap-2 overflow-x-auto pb-1">
                <span className="shrink-0 pr-1 text-[13px] font-bold text-ink/45">₹ Fees</span>
                {FEE_RANGES.map((r) => (
                  <Chip key={r.id} active={feeRange === r.id} onClick={() => setFeeRange(r.id)}>
                    {r.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* results */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink/55">
            {filtered.length} institute{filtered.length !== 1 && 's'} found
          </p>
          {activeCount > 0 && (
            <button
              onClick={() => {
                setCity('All')
                setCategory('all')
                setFeeRange('all')
                setQuery('')
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-orbit-600 hover:text-orbit-800"
            >
              <X className="h-4 w-4" /> Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white py-24 text-center">
            <p className="text-lg font-bold text-ink">No institutes match those filters</p>
            <p className="mt-1 text-sm text-ink/50">Try widening your city or budget range.</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((inst, i) => (
                <InstituteCard key={inst.id} inst={inst} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
