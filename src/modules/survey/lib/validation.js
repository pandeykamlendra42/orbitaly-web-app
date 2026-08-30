/** Shared field validation, used by both the HTTP and mock API layers. */

export function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, ''))
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
}

export const digitsOnly = (value) => String(value).replace(/\D/g, '')
