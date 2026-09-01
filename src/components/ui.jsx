import { motion } from 'framer-motion'

// Fade-up on scroll into view. Deliberately restrained — the hero carries the
// one orchestrated moment on this site, and scattered effects everywhere else
// would cheapen it.
export function Reveal({ children, delay = 0, y = 20, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Section head.
 *
 * The numbering is not decoration: the page is a single argument made in
 * order — what you're facing, the shape of the answer, the part that pays for
 * it, what actually exists, how we make money, how to get involved — and the
 * numbers let someone refer to a movement of it.
 */
export function SectionHead({ index, eyebrow, title, lede, onNavy = false, className = '' }) {
  return (
    <div className={`max-w-[54ch] ${className}`}>
      <div className="flex items-baseline gap-4">
        <span
          className={`font-mono text-[11px] tracking-[0.14em] ${
            onNavy ? 'text-brand-bright' : 'text-brand'
          }`}
        >
          {String(index).padStart(2, '0')}
        </span>
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
            onNavy ? 'text-white/50' : 'text-ink-3'
          }`}
        >
          {eyebrow}
        </span>
      </div>

      <h2
        className={`mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem] ${
          onNavy ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>

      {lede && (
        <p
          className={`mt-5 text-[16.5px] leading-[1.65] ${
            onNavy ? 'text-white/65' : 'text-ink-2'
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
