import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BedDouble, BookOpen, Building2, Bus, Laptop, UtensilsCrossed } from 'lucide-react'
import { Reveal } from '../components/ui'
import { useParallax } from '../lib/useParallax'
import trails from '../assets/orbit-trails.jpg'

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

export default function Disbursement() {
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
