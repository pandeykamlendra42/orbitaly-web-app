import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Trust from './pages/Trust'
import { SURVEY_ROUTES } from './modules/survey/routes'
import { SURVEY_ADMIN_ROUTES } from './modules/survey-admin/routes'

// The survey is a self-contained module with its own chrome, and it ships on the
// public build — the college cohort needs to reach it directly. Lazy so its
// questionnaire JSON stays out of the landing-page bundle.
const SurveyPage = lazy(() => import('./modules/survey/SurveyPage'))

// Internal analytics over the read-only admin API. Lazy for the same reason,
// and because no public visitor should ever download it.
const SurveyAdminPage = lazy(() => import('./modules/survey-admin/AdminPage'))

// Reset scroll between pages — but the nav links to in-page anchors as "/#learn",
// so a hash has to win, otherwise arriving from /trust lands at the top instead
// of the section that was asked for.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// The survey carries its own progress header and submit bar; the marketing nav
// and footer would only offer ways to abandon it half-answered.
const CHROMELESS_ROUTES = [...SURVEY_ROUTES, ...SURVEY_ADMIN_ROUTES]

function MarketingChrome({ children }) {
  const { pathname } = useLocation()
  if (CHROMELESS_ROUTES.includes(pathname)) return null
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MarketingChrome>
        <Navbar />
      </MarketingChrome>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/student-survey-v1" element={<SurveyPage />} />
          <Route path="/survey-analytics" element={<SurveyAdminPage />} />
          {/* Anything else — including old demo links people may have saved. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <MarketingChrome>
        <Footer />
      </MarketingChrome>
    </BrowserRouter>
  )
}
