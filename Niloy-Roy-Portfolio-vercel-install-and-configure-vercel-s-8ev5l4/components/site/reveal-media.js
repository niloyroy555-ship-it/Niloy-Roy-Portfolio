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
  style,
  mediaRef: externalMediaRef,
}) {
  const coarse = useCoarsePointer()
  const ref = useRef(null)
  const internalMediaRef = useRef(null)
  const setMediaRef = (el) => {
    internalMediaRef.current = el
    if (typeof externalMediaRef === 'function') externalMediaRef(el)
    else if (externalMediaRef) externalMediaRef.current = el
  }
  const mediaRef = internalMediaRef
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

  if (coarse) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${wrapperClassName}`}>
        {type === 'video' ? (
          <video ref={setMediaRef} src={src} poster={poster} className={className} style={style} {...videoProps} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={setMediaRef}
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
            ref={setMediaRef}
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
            ref={setMediaRef}
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
