'use client'

import { useEffect, useState } from 'react'

// Shared motion preference. Phones and tablets keep the animated experience;
// only the user's explicit reduced-motion setting disables heavier effects.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCoarse(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return coarse
}
