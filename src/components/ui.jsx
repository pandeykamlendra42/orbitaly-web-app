import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// Fade-up on scroll into view — the standard Revolut-style section reveal.
export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Animated counter for statistics. `format` receives the interpolated value.
export function CountUp({ to, duration = 1.8, format = (v) => Math.round(v).toLocaleString('en-IN') }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return <span ref={ref}>{format(val)}</span>
}

// Gradient cover used in place of institute photography.
export function InstituteCover({ institute, className = '', children }) {
  const [c1, c2] = institute.gradient
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.55), transparent 45%), radial-gradient(circle at 15% 85%, rgba(255,255,255,0.3), transparent 40%)',
        }}
      />
      <span className="absolute bottom-3 left-4 text-5xl font-black tracking-tight text-white/25 select-none">
        {institute.name
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')}
      </span>
      {children}
    </div>
  )
}

export function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active ? 'bg-ink text-white shadow-md' : 'bg-ink/[0.04] text-ink/70 hover:bg-ink/10'
      }`}
    >
      {children}
    </button>
  )
}
