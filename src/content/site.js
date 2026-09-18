/**
 * Site-wide facts and copy that are not owned by any one section.
 */

// The operating entity. Note: the v3 homepage comp carries a different name and
// CIN ("OrbitalyOS Labs Private Limited", U62099MH2026PTC473946) — that is a
// different company and must not be used here.
export const LEGAL_ENTITY = 'Orbitaly One Technologies Private Limited'

// TODO(orbitaly): needed before launch. Registered address and CIN for the
// entity above, for the footer. The v3 comp's Borivali address belongs to the
// other company.
export const REGISTERED_ADDRESS = ''
export const CIN = ''

// The shared inbox. Every "get in touch" affordance on the site opens a draft
// to this address; while LEADS_ENABLED is on, the partner and counsellor doors
// use the on-page enquiry form instead.
export const CONTACT_EMAIL = 'contactus@orbitaly.in'
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`

// The student survey has closed. The route is commented out in App.jsx; keep
// the path here so it can be switched back on for a future cohort.
// export const SURVEY_PATH = '/student-survey-v1'

export const NAV_LINKS = [
  { label: 'Learn', href: '/#learn' },
  { label: 'Earn', href: '/#earn' },
  { label: 'Grow', href: '/#grow' },
  { label: 'Plan & Fund', href: '/#fund' },
  { label: 'Experts', href: '/#experts' },
  { label: 'Trust', href: '/trust' },
]
