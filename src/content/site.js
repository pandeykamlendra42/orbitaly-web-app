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

// TODO(orbitaly): set the partnerships inbox. While this is empty every
// "talk to us" affordance falls back to the on-page enquiry form.
export const CONTACT_EMAIL = ''

// The one thing on this site a visitor can actually complete today.
export const SURVEY_PATH = '/student-survey-v1'

export const NAV_LINKS = [
  { label: 'Learn', href: '/#learn' },
  { label: 'Earn', href: '/#earn' },
  { label: 'Grow', href: '/#grow' },
  { label: 'Plan & Fund', href: '/#fund' },
  { label: 'Experts', href: '/#experts' },
  { label: 'Trust', href: '/trust' },
]
