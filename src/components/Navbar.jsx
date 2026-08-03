import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBasket, Menu, X } from 'lucide-react'
import { useBasket } from '../context/BasketContext'
import Logo from './Logo'
import { SHOW_PROTOTYPE } from '../config'

const links = SHOW_PROTOTYPE
  ? [
      { to: '/', label: 'Home' },
      { to: '/marketplace', label: 'Institutes' },
      { to: '/eligibility', label: 'Eligibility' },
    ]
  : []

export default function Navbar() {
  const { items } = useBasket()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Landing page starts on a dark hero; nav is transparent until scrolled.
  const onDarkHero = pathname === '/' && !scrolled

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onDarkHero ? 'bg-transparent' : 'bg-white/85 shadow-[0_1px_0_rgba(15,14,26,0.06)] backdrop-blur-xl'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Orbitaly home">
          <Logo dark={onDarkHero} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  onDarkHero
                    ? isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                    : isActive
                      ? 'bg-orbit-50 text-orbit-700'
                      : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {SHOW_PROTOTYPE && (
            <Link
              to="/basket"
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                onDarkHero ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'
              }`}
              aria-label="Education basket"
            >
              <ShoppingBasket className="h-5 w-5" />
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orbit-600 text-[11px] font-bold text-white"
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {SHOW_PROTOTYPE ? (
            <Link
              to="/marketplace"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.03] md:block ${
                onDarkHero ? 'bg-white text-ink' : 'bg-ink text-white'
              }`}
            >
              Get started
            </Link>
          ) : (
            <a
              href="#partners"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.03] ${
                onDarkHero ? 'bg-white text-ink' : 'bg-ink text-white'
              }`}
            >
              Partner With Us
            </a>
          )}

          {/* No nav links on the public build — nothing for the drawer to hold. */}
          {links.length > 0 && (
            <button
              onClick={() => setOpen(!open)}
              className={`flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
                onDarkHero ? 'text-white' : 'text-ink'
              }`}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-ink/5 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/marketplace"
                className="mt-2 block rounded-full bg-ink px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
