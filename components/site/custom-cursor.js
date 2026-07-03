'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  // Desktop cursor state (existing)
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState('default')
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  // Touch / Mobile cursor state
  const [touchEnabled, setTouchEnabled] = useState(false)
  const [touchActive, setTouchActive] = useState(false)
  const [touchVisible, setTouchVisible] = useState(false)

  // Motion values (shared)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })
  const dotX = useSpring(x, { stiffness: 1200, damping: 50 })
  const dotY = useSpring(y, { stiffness: 1200, damping: 50 })

  // --- Desktop: preserve existing logic exactly ---
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

  // --- Touch: mobile cursor implementation ---
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    // Detect touch-capable devices (capability checks preferred)
    const touchCapable = 'ontouchstart' in window || (navigator && navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
    if (!touchCapable) return

    setTouchEnabled(true)

    let fadeTimeout = null

    const onTouchStart = (e) => {
      const t = e.touches && e.touches[0]
      if (!t) return
      x.set(t.clientX)
      y.set(t.clientY)
      setTouchActive(true)
      setTouchVisible(true)
      if (fadeTimeout) {
        clearTimeout(fadeTimeout)
        fadeTimeout = null
      }
    }

    const onTouchMove = (e) => {
      const t = e.touches && e.touches[0]
      if (!t) return
      x.set(t.clientX)
      y.set(t.clientY)
    }

    const onTouchEnd = () => {
      setTouchActive(false)
      fadeTimeout = setTimeout(() => {
        setTouchVisible(false)
      }, 300)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      if (fadeTimeout) clearTimeout(fadeTimeout)
      setTouchEnabled(false)
      setTouchActive(false)
      setTouchVisible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled && !touchEnabled) return null

  const isLabel = !!label
  const isLink = variant === 'link' || variant === 'view' || variant === 'open'
  const ringSize = isLabel ? 78 : isLink ? 54 : 32

  // --- Trail springs (explicit top-level hooks to respect rules of hooks) ---
  const trail0X = useSpring(x, { stiffness: 600, damping: 45 })
  const trail0Y = useSpring(y, { stiffness: 600, damping: 45 })
  const trail1X = useSpring(x, { stiffness: 480, damping: 39 })
  const trail1Y = useSpring(y, { stiffness: 480, damping: 39 })
  const trail2X = useSpring(x, { stiffness: 360, damping: 33 })
  const trail2Y = useSpring(y, { stiffness: 360, damping: 33 })
  const trail3X = useSpring(x, { stiffness: 240, damping: 27 })
  const trail3Y = useSpring(y, { stiffness: 240, damping: 27 })

  const trailXs = [trail0X, trail1X, trail2X, trail3X]
  const trailYs = [trail0Y, trail1Y, trail2Y, trail3Y]

  return (
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
              backgroundColor: isLabel ? 'rgba(91,140,255,0.96)' : 'rgba(91,140,255,0)',
              borderColor: isLabel ? 'rgba(91,140,255,0)' : 'rgba(255,255,255,0.5)',
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
    </div>
  )
}
