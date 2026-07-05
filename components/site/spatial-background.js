'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'

// Deep, layered spatial background: soft ambient orbs on multiple depth layers
// that drift with mouse movement + scroll, like looking through a visionOS window.
export default function SpatialBackground() {
  const [parallax, setParallax] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })

  const { scrollYProgress } = useScroll()

  // three depth layers, each moving at a different rate
  const l1x = useTransform(sx, (v) => v * 40)
  const l1y = useTransform(sy, (v) => v * 40)
  const l2x = useTransform(sx, (v) => v * -26)
  const l2y = useTransform(sy, (v) => v * -26)
  const l3x = useTransform(sx, (v) => v * 14)
  const l3y = useTransform(sy, (v) => v * 14)

  const scroll1 = useTransform(scrollYProgress, [0, 1], [0, -180])
  const scroll2 = useTransform(scrollYProgress, [0, 1], [0, 140])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setParallax(true)
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% -10%, hsl(var(--fg) / 0.04) 0%, transparent 55%), hsl(var(--base))',
        }}
      />

      {/* depth layer 1 - far */}
      <motion.div style={parallax ? { x: l3x, y: l3y } : undefined} className="absolute inset-0">
        <motion.div style={{ y: scroll2 }} className="absolute inset-0">
          <div
            className="spatial-orb absolute left-[8%] top-[55%] h-[46vh] w-[46vh] rounded-full blur-[90px]"
            style={{ background: 'var(--orb-silver)' }}
          />
        </motion.div>
      </motion.div>

      {/* depth layer 2 - mid */}
      <motion.div style={parallax ? { x: l2x, y: l2y } : undefined} className="absolute inset-0">
        <motion.div style={{ y: scroll1 }} className="absolute inset-0">
          <div
            className="spatial-orb absolute right-[6%] top-[12%] h-[52vh] w-[52vh] rounded-full blur-[100px] animate-aurora"
            style={{ background: 'var(--orb-violet)', animationDelay: '-7s' }}
          />
        </motion.div>
      </motion.div>

      {/* depth layer 3 - near */}
      <motion.div style={parallax ? { x: l1x, y: l1y } : undefined} className="absolute inset-0">
        <div
          className="spatial-orb absolute left-[38%] top-[4%] h-[64vh] w-[64vh] -translate-x-1/2 rounded-full blur-[110px] animate-aurora"
          style={{ background: 'var(--orb-blue)' }}
        />
        <div
          className="spatial-orb absolute bottom-[-12%] left-[52%] h-[42vh] w-[42vh] rounded-full blur-[100px] animate-aurora"
          style={{ background: 'var(--orb-violet)', animationDelay: '-12s' }}
        />
      </motion.div>

      {/* fine noise for texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
