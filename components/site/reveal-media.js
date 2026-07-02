'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const curtainEase = [0.85, 0, 0.15, 1]

// Cinematic media reveal: scale + blur-out with a curtain wipe, on enter-view + load.
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
    const t = setTimeout(() => setLoaded(true), 1200)
    return () => clearTimeout(t)
  }, [type, src])

  return (
    <div ref={ref} className={`relative overflow-hidden ${wrapperClassName}`}>
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.14, opacity: 0, filter: 'blur(16px)' }}
        animate={show ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.15, ease, delay }}
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
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={className}
          />
        )}
      </motion.div>

      {/* curtain wipe */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ink-950"
        style={{ transformOrigin: 'bottom' }}
        initial={{ scaleY: 1 }}
        animate={show ? { scaleY: 0 } : {}}
        transition={{ duration: 0.95, ease: curtainEase, delay: delay + 0.05 }}
      />
    </div>
  )
}
