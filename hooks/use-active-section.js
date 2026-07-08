'use client'

import { useEffect, useState } from 'react'

// Tracks which of the given section ids is currently "active" for nav
// highlighting. Uses a thin horizontal band near the top of the viewport
// (via rootMargin) rather than "is it visible at all" — that way a short
// section still gets picked up as active for the stretch it's the one
// sitting at that band, instead of never winning against a taller neighbor.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.querySelector(id))
      .filter(Boolean)
    if (elements.length === 0) return

    const ratios = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(`#${entry.target.id}`, entry.isIntersecting ? entry.intersectionRatio : 0)
        })
        let top = null
        let topRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio
            top = id
          }
        })
        if (top) setActive(top)
      },
      {
        // band sits just under the fixed nav, roughly the top third of the
        // viewport — crossing it is what flips the active section
        rootMargin: '-15% 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
