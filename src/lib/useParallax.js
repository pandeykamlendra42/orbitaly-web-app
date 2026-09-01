import { useScroll, useTransform, useReducedMotion } from 'framer-motion'

/* Scroll-linked parallax that flattens to a no-op when the visitor has asked
   the OS for reduced motion. Every drifting layer on the site goes through it. */
export function useParallax(ref, from, to) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [from, to])
}
