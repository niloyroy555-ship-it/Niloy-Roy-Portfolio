'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const curtainEase = [0.85, 0, 0.15, 1]

// Cinematic media reveal: scale + blur-out with a curtain wipe, on enter-view + load.
// Optimized for smooth 60fps performance
export default function RevealMedia({
  src,
  type = 'image',
  poster,
  alt = '',
  className = '',
  wrapperClassName = 'h-full w-full',
  videoProps = {},
  delay = 0,
}) {
  const ref = useRef(null)
  const mediaRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [loaded, setLoaded] = useState(false)
  const show = inView && loaded

  useEffect(() => {
    // Handle already-cached/complete media that won't fire load events.
    const el = mediaRef.current
    if (el) {
      if (type === 'image' && el.complete && el.naturalWidth > 0) setLoaded(true)
      if (type === 'video' && el.readyState >= 2) setLoaded(true)
    }
    // Safety net: never leave media hidden behind the curtain.
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [type, src])

  return (
    <div ref={ref} className={`relative overflow-hidden ${wrapperClassName}`}>
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
animate={show ? { opacity: 1 } : {}}
transition={{ duration: 0.25, ease, delay }}
        style={{ willChange: 'transform, opacity' }}
      >
        {type === 'video' ? (
          <video
            ref={mediaRef}
            src={src}
            poster={poster}
            onLoadedData={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={className}
            {...videoProps}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={mediaRef}
            src={src}
            alt={alt}
            loading="eager"
fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={className}
          />
        )}
      </motion.div>

      {/* curtain wipe - optimized for GPU acceleration */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ink-950"
        style={{ transformOrigin: 'bottom', willChange: 'transform' }}
        initial={false}
animate={{ scaleY: 0 }}
transition={{ duration: 0.2 }}
      />
    </div>
  )
}
