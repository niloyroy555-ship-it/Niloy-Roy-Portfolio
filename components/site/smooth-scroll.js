'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    window.__lenis = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}

export function scrollToId(id) {
  const el = typeof id === 'string' && id.startsWith('#') ? document.querySelector(id) : id
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -10, duration: 1.3 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
