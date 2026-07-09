'use client'

import { useEffect, useState } from 'react'

// Detects touch/stylus devices (coarse pointer — phones, tablets) as well as
// the user's OS-level reduced-motion preference. Both cases get the lighter
// experience: no autoplaying background video, no continuous scroll-linked
// 3D tilt transforms. This used to only check prefers-reduced-motion, which
// meant tablets and phones (no reduced-motion set) were silently getting the
// full desktop treatment — multiple autoplaying videos plus per-card 3D
// tilt recalculated on every scroll frame — which is what caused the janky/
// laggy feel on real Android devices.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const pointerMql = window.matchMedia('(pointer: coarse)')
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCoarse(pointerMql.matches || motionMql.matches)
    update()
    pointerMql.addEventListener('change', update)
    motionMql.addEventListener('change', update)
    return () => {
      pointerMql.removeEventListener('change', update)
      motionMql.removeEventListener('change', update)
    }
  }, [])

  return coarse
}
