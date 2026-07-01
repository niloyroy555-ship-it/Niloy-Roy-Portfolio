'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export function Reveal({ children, className = '', delay = 0, y = 28, once = true }) {
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

// Word-by-word reveal for headlines
export function TextReveal({ text, className = '', wordClass = '', delay = 0, stagger = 0.05 }) {
  const words = String(text).split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.08em' }}>
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
