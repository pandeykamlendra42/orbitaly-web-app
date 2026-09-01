import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS, SURVEY_PATH } from '../content/site'

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/90 backdrop-blur-md transition-shadow duration-200 ${
        scrolled || open ? 'border-b border-rule' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-8 px-6 lg:px-10">
        <Link to="/" aria-label="Orbitaly home" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[14px] font-medium text-ink-2 transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={SURVEY_PATH}
            className="hidden rounded-sm bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-deep sm:block"
          >
            Take the survey
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-rule bg-paper lg:hidden"
          >
            <div className="px-6 py-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-rule-2 py-3.5 text-[15px] font-medium text-ink"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to={SURVEY_PATH}
                className="mt-4 mb-2 block rounded-sm bg-brand px-5 py-3.5 text-center text-[15px] font-semibold text-white"
              >
                Take the survey
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
