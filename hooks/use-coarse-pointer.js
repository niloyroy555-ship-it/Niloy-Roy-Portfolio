'use client'

import { useEffect, useState } from 'react'

// Detects touch / coarse-pointer devices (phones, most tablets) so the
// heavier scroll-linked and hover-only animations can be skipped there.
//
// Why this matters for "buttery smooth" mobile scrolling: on desktop,
// scroll-linked JS transforms and whileInView reveals only run while a
// user is actively scrolling with a mouse/trackpad, which is comparatively
// gentle. On phones, fast flick-scrolling fires many more scroll/paint
// frames in a short burst, and phone GPUs have far less headroom than a
// desktop GPU — so the same animations that feel fine on desktop are the
// most common cause of visible jank on Android/iOS. Gating them behind
// this hook lets the site stay fully animated on desktop while rendering
// instantly (no motion) on touch devices.
//
// Single shared source of truth — several components used to each run
// their own inline `matchMedia('(pointer: coarse)')` check.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(mql.matches || window.innerWidth < 768)
    update()
    mql.addEventListener('change', update)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      mql.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return coarse
}
