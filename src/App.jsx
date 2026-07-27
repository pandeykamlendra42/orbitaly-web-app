/* global __SHOW_PROTOTYPE__ */
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { BasketProvider } from './context/BasketContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'

// `__SHOW_PROTOTYPE__` is a build-time literal, so on the public build these
// ternaries collapse to `null` and the dynamic imports become unreachable —
// the demo pages and their mock data are never emitted. See src/config.js.
const Marketplace = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Marketplace')) : null
const InstituteDetails = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/InstituteDetails')) : null
const Basket = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Basket')) : null
const Eligibility = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Eligibility')) : null

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BasketProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            {__SHOW_PROTOTYPE__ && (
              <>
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/institute/:id" element={<InstituteDetails />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/eligibility" element={<Eligibility />} />
              </>
            )}
            {/* Anything else — including old demo links people may have saved. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </BasketProvider>
  )
}
