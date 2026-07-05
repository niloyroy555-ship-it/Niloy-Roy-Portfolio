'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useCoarsePointer } from '@/hooks/use-coarse-pointer'

const ease = [0.22, 1, 0.36, 1]

// Cinematic media reveal: opacity fade-in on enter-view + load, on desktop.
//
// On touch devices the fade is skipped entirely and media just renders
// normally — no motion.div wrapper, no loaded-state gate. This matters most
// for the case-study galleries, where dozens of images/videos can mount at
// once; removing the per-item animated state there is a meaningful chunk of
// avoidable JS work on a phone opening that modal.
export default function RevealMedia({
  src,
  type = 'image',
  poster,
  alt = '',
  className = '',
  wrapperClassName = 'h-full w-full',
  videoProps = {},
  delay = 0,
  priority = false,
  alwaysPlay = false,
  style,
}) {
  const coarse = useCoarsePointer()
  const ref = useRef(null)
  const mediaRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const show = loaded

  useEffect(() => {
    if (coarse) return // mobile renders immediately, no load-gating needed
    // Handle already-cached/complete media that won't fire load events.
    const el = mediaRef.current
    if (el) {
      if (type === 'image' && el.complete && el.naturalWidth > 0) setLoaded(true)
      if (type === 'video' && el.readyState >= 2) setLoaded(true)
    }
    // Safety net: never leave media hidden behind the curtain.
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [type, src, coarse])

  useEffect(() => {
<<<<<<< HEAD
    // alwaysPlay videos (currently: the two hero case-study covers called
    // out by name) skip this entirely — no pausing when scrolled out of
    // view, they just run on their native autoPlay+loop attributes forever.
    if (type !== 'video' || alwaysPlay) return
=======
    if (type !== 'video') return
>>>>>>> f69771874bd7f9404430d48b232de109ece0a6f9
    const el = mediaRef.current
    const wrapper = ref.current
    if (!el || !wrapper) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {}) // autoplay can be blocked pre-interaction; muted+playsInline covers most cases
        } else {
          el.pause()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(wrapper)
    return () => io.disconnect()
<<<<<<< HEAD
  }, [type, src, alwaysPlay])
=======
  }, [type, src])
>>>>>>> f69771874bd7f9404430d48b232de109ece0a6f9

  if (coarse) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${wrapperClassName}`}>
        {type === 'video' ? (
          <video ref={mediaRef} src={src} poster={poster} className={className} style={style} {...videoProps} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={mediaRef}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className={className}
            style={style}
          />
        )}
      </div>
    )
  }

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
            style={style}
            {...videoProps}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={mediaRef}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={className}
            style={style}
          />
        )}
      </motion.div>
    </div>
  )
}
