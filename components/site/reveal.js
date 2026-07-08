'use client'

import { motion } from 'framer-motion'
import { useCoarsePointer } from '@/hooks/use-coarse-pointer'

const ease = [0.22, 1, 0.36, 1]

// On touch devices, skip the scroll-triggered slide/fade entirely — content
// is simply visible from the start. This removes a per-element
// IntersectionObserver plus an animated transform/opacity write for every
// card and heading, which is the classic source of stutter when someone
// flick-scrolls through a grid of cards on a phone. Desktop keeps the full
// animated reveal.
export function Reveal({ children, className = '', delay = 0, y = 28, once = true }) {
  const coarse = useCoarsePointer()

  if (coarse) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

// Word-by-word reveal for headlines (opacity + pixel rise inside an overflow mask)
export function TextReveal({ text, className = '', wordClass = '', delay = 0, stagger = 0.05 }) {
  const coarse = useCoarsePointer()
  const words = String(text).split(' ')

  if (coarse) {
    return (
      <span className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={i} className={`inline-block ${wordClass}`}>
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={{ y: 44, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
