'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0

    // On touch devices, skip Lenis entirely and let the OS handle scrolling
    // natively. syncTouch hijacks native touch/fling scrolling (which the
    // browser already runs smoothly on the compositor thread, off main
    // thread) and replaces it with a synthetic scroll driven by JS on every
    // rAF tick — on real phones this is what "laggy scrolling" usually is.
    // scrollToId()'s native window.scrollTo fallback below still gives
    // smooth in-page nav links on touch devices.
    if (reduce || touch) return

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
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
