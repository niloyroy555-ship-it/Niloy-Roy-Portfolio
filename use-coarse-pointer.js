'use client'

import { useEffect, useState } from 'react'

// Detects touch/no-hover devices (phones, tablets) OR an explicit
// reduced-motion preference — either one means "skip the heavier,
// hover/parallax-driven animation path". This previously only checked
// prefers-reduced-motion, which almost nobody has enabled, so every
// "mobile-optimized" branch that depends on this hook was silently never
// firing on real phones/tablets.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const pointerMql = window.matchMedia('(hover: none), (pointer: coarse)')
    const reduceMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCoarse(pointerMql.matches || reduceMql.matches)
    update()
    pointerMql.addEventListener('change', update)
    reduceMql.addEventListener('change', update)
    return () => {
      pointerMql.removeEventListener('change', update)
      reduceMql.removeEventListener('change', update)
    }
  }, [])

  return coarse
}
