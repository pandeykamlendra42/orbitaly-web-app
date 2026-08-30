/* global __SHOW_PROTOTYPE__ */
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { BasketProvider } from './context/BasketContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import { SURVEY_ROUTES } from './modules/survey/routes'

// `__SHOW_PROTOTYPE__` is a build-time literal, so on the public build these
// ternaries collapse to `null` and the dynamic imports become unreachable —
// the demo pages and their mock data are never emitted. See src/config.js.
const Marketplace = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Marketplace')) : null
const InstituteDetails = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/InstituteDetails')) : null
const Basket = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Basket')) : null
const Eligibility = __SHOW_PROTOTYPE__ ? lazy(() => import('./pages/Eligibility')) : null

// The survey is a self-contained module with its own chrome, and it ships on the
// public build — the college cohort needs to reach it directly. Lazy so its
// questionnaire JSON stays out of the landing-page bundle.
const SurveyPage = lazy(() => import('./modules/survey/SurveyPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// The survey carries its own progress header and submit bar; the marketing nav
// and footer would only offer ways to abandon it half-answered.
function MarketingChrome({ children }) {
  const { pathname } = useLocation()
  if (SURVEY_ROUTES.includes(pathname)) return null
  return children
}

export default function App() {
  return (
    <BasketProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MarketingChrome>
          <Navbar />
        </MarketingChrome>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/student-survey-v1" element={<SurveyPage />} />
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
        <MarketingChrome>
          <Footer />
        </MarketingChrome>
      </BrowserRouter>
    </BasketProvider>
  )
}
