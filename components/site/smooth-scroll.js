'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    const compact = window.innerWidth < 1024

    if (reduce || touch || compact) return

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    window.__lenis = lenis

    let rafId
    let running = true
    const raf = (time) => {
      if (running) lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onVisibilityChange = () => {
      running = document.visibilityState === 'visible'
      if (running) lenis.start()
      else lenis.stop()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}

export function scrollToId(id) {
  const el = typeof id === 'string' && id.startsWith('#') ? document.querySelector(id) : id
  if (!el) return
  const offset = -84 // account for the fixed nav height
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.2 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
