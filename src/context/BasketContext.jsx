import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const BasketContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Item shape: { key, instituteId, instituteName, city, type: 'course'|'addon',
//               refId, name, meta, amount }
export function BasketProvider({ children }) {
  const [items, setItems] = useState(() => load('orbitaly:basket', []))
  const [eligibility, setEligibility] = useState(() => load('orbitaly:eligibility', null)) // { status, creditLine, applicant }

  useEffect(() => {
    localStorage.setItem('orbitaly:basket', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (eligibility) localStorage.setItem('orbitaly:eligibility', JSON.stringify(eligibility))
    else localStorage.removeItem('orbitaly:eligibility')
  }, [eligibility])

  const addItem = (item) => {
    setItems((prev) => {
      const key = `${item.instituteId}:${item.type}:${item.refId}`
      if (prev.some((p) => p.key === key)) return prev
      // one course per institute — selecting a new course replaces the old one
      const next =
        item.type === 'course'
          ? prev.filter((p) => !(p.instituteId === item.instituteId && p.type === 'course'))
          : prev
      return [...next, { ...item, key }]
    })
  }

  const removeItem = (key) => setItems((prev) => prev.filter((p) => p.key !== key))
  const clearBasket = () => {
    setItems([])
    setEligibility(null)
  }

  const total = useMemo(() => items.reduce((s, i) => s + i.amount, 0), [items])

  const hasItem = (instituteId, type, refId) =>
    items.some((p) => p.key === `${instituteId}:${type}:${refId}`)

  const value = {
    items,
    total,
    addItem,
    removeItem,
    clearBasket,
    hasItem,
    eligibility,
    setEligibility,
  }

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
}

export function useBasket() {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error('useBasket must be used within BasketProvider')
  return ctx
}
