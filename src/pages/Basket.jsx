import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBasket, Trash2, MapPin, Plus, ShieldCheck } from 'lucide-react'
import { useBasket } from '../context/BasketContext'
import { formatINR } from '../data/institutes'
import { Reveal } from '../components/ui'

export default function Basket() {
  const { items, total, removeItem, clearBasket } = useBasket()

  // group items by institute for a clean bill-of-materials view
  const groups = items.reduce((acc, it) => {
    ;(acc[it.instituteId] ??= { name: it.instituteName, city: it.city, items: [] }).items.push(it)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-[#f6f6fb] pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Education Basket
              </h1>
              <p className="mt-3 text-lg text-ink/55">
                One basket for tuition, hostel, transport and everything in between.
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearBasket}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Clear basket
              </button>
            )}
          </div>
        </Reveal>

        {items.length === 0 ? (
          <Reveal className="mt-10">
            <div className="rounded-3xl border border-dashed border-ink/15 bg-white py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orbit-50">
                <ShoppingBasket className="h-8 w-8 text-orbit-500" />
              </div>
              <p className="mt-5 text-xl font-extrabold text-ink">Your basket is empty</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/50">
                Browse the marketplace, pick a course and add financed extras like hostel
                and transport to get started.
              </p>
              <Link
                to="/marketplace"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                <Plus className="h-4 w-4" /> Explore institutes
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* grouped items */}
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {Object.entries(groups).map(([gid, g]) => (
                  <motion.section
                    key={gid}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="overflow-hidden rounded-3xl bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.06] px-7 py-5">
                      <div>
                        <h2 className="font-extrabold text-ink">{g.name}</h2>
                        <p className="flex items-center gap-1 text-[13px] font-medium text-ink/45">
                          <MapPin className="h-3.5 w-3.5" /> {g.city} campus
                        </p>
                      </div>
                      <Link
                        to={`/institute/${gid}`}
                        className="text-[13px] font-bold text-orbit-600 hover:text-orbit-800"
                      >
                        + Add more from this institute
                      </Link>
                    </div>
                    <div className="divide-y divide-ink/[0.05]">
                      <AnimatePresence initial={false}>
                        {g.items.map((it) => (
                          <motion.div
                            key={it.key}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="flex items-center justify-between gap-4 px-7 py-4"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-bold text-ink">{it.name}</p>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                                    it.type === 'course'
                                      ? 'bg-orbit-50 text-orbit-700'
                                      : 'bg-mint-500/10 text-mint-500'
                                  }`}
                                >
                                  {it.type === 'course' ? 'Tuition' : 'Add-on'}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-[13px] text-ink/45">{it.meta}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <p className="font-extrabold text-ink">{formatINR(it.amount)}</p>
                              <button
                                onClick={() => removeItem(it.key)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink/35 transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label={`Remove ${it.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>

            {/* summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl bg-ink p-7 text-white shadow-2xl">
                <h3 className="text-lg font-extrabold">Basket summary</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Items</span>
                    <span className="font-bold text-white">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tuition</span>
                    <span className="font-bold text-white">
                      {formatINR(items.filter((i) => i.type === 'course').reduce((s, i) => s + i.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Add-ons</span>
                    <span className="font-bold text-white">
                      {formatINR(items.filter((i) => i.type === 'addon').reduce((s, i) => s + i.amount, 0))}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-white/55">Total to finance</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.12 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-extrabold tracking-tight"
                  >
                    {formatINR(total)}
                  </motion.span>
                </div>
                <Link
                  to="/eligibility"
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orbit-500 to-fuchsia-500 py-4 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  Check eligibility
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-white/45">
                  <ShieldCheck className="h-3.5 w-3.5" /> Soft check — no impact on credit score
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
