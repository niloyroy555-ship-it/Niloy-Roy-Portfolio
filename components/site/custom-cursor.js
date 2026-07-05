'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Desktop-only custom cursor (ring + dot that follow the pointer and react
// to [data-cursor] targets). Automatically inert on touch devices: there is
// no persistent pointer to track, and rendering nothing there means no
// extra springs/listeners on the devices that need to stay lightest.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState('default')
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })
  const dotX = useSpring(x, { stiffness: 1200, damping: 50 })
  const dotY = useSpring(y, { stiffness: 1200, damping: 50 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-none-desktop')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) {
        setVariant(t.getAttribute('data-cursor') || 'link')
        setLabel(t.getAttribute('data-cursor-label') || '')
      } else {
        setVariant('default')
        setLabel('')
      }
    }
    const dn = () => setDown(true)
    const up = () => setDown(false)
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', dn)
      window.removeEventListener('mouseup', up)
      document.documentElement.classList.remove('cursor-none-desktop')
    }
  }, [x, y])

  if (!enabled) return null

  const isLabel = !!label
  const isLink = variant === 'link' || variant === 'view' || variant === 'open'
  const ringSize = isLabel ? 78 : isLink ? 54 : 32

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden>
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: isLabel ? 'rgba(109,141,255,0.96)' : 'rgba(109,141,255,0)',
          borderColor: isLabel ? 'rgba(109,141,255,0)' : 'rgba(140,150,190,0.6)',
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {isLabel && (
          <span className="text-[11px] font-semibold tracking-wide text-ink-950">{label}</span>
        )}
      </motion.div>
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isLabel ? 0 : 1, scale: isLink ? 0.5 : 1 }}
      />
    </div>
  )
}
