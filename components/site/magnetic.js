'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCoarsePointer } from '@/hooks/use-coarse-pointer'

export default function Magnetic({ children, strength = 0.35, className = '', as = 'div' }) {
  const ref = useRef(null)
  const coarse = useCoarsePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  // Touch devices don't get real mousemove drags, only a single synthetic
  // mousemove/mouseover fired at the tap point right before click — which
  // without this guard yanks the button toward the tap and leaves it
  // displaced until the next unrelated mouse event resets it.
  const onMove = (e) => {
    if (coarse) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
