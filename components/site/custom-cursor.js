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
<<<<<<< HEAD
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
=======
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* Desktop cursor (unchanged) */}
      {enabled && (
        <div className="hidden md:block pointer-events-none fixed inset-0">
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
      )}

      {/* Touch cursor: only on small screens, only when active/visible */}
      {touchEnabled && touchVisible && (
        <div className="md:hidden fixed inset-0 pointer-events-none">
          {/* Particle / glow trail */}
          {trailXs.map((tx, i) => {
            const ty = trailYs[i]
            const size = 18 - i * 3
            const opacity = 0.18 - i * 0.03
            const blur = 12 + i * 4
            return (
              <motion.div
                key={`trail-${i}`}
                style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%', width: size, height: size, borderRadius: 9999 }}
                animate={{ opacity: touchActive ? opacity : 0 }}
                transition={{ type: 'spring', stiffness: 200 - i * 20, damping: 30 }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 9999,
                    background: 'rgba(91,140,255,0.18)',
                    filter: `blur(${blur}px)`,
                    boxShadow: `0 6px ${blur * 1.5}px rgba(91,140,255,0.18)`,
                  }}
                />
              </motion.div>
            )
          })}

          {/* Main orb */}
          <motion.div
            className="absolute"
            style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: touchActive ? 1 : 0, scale: touchActive ? 1 : 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 9999,
                background: 'linear-gradient(180deg, rgba(91,140,255,0.14), rgba(91,140,255,0.06))',
                boxShadow: '0 10px 40px rgba(16,24,40,0.6), 0 0 60px rgba(91,140,255,0.38)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 9999,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(91,140,255,0.9) 40%, rgba(91,140,255,0.2) 70%, rgba(91,140,255,0) 100%)',
                  filter: 'blur(1px)'
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
>>>>>>> e4e5c0790b84505e04ce215325278357d3e46051
    </div>
  )
}
