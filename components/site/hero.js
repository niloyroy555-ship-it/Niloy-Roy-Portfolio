'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Magnetic from './magnetic'
import { profile } from '@/lib/portfolio-data'
import { scrollToId } from './smooth-scroll'

const ease = [0.22, 1, 0.36, 1]

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export default function Hero({ ready = true }) {
  const [roleIdx, setRoleIdx] = useState(0)
  const ref = useRef(null)
  const videoRef = useRef(null)
  // Respect prefers-reduced-motion: skip autoplay/loop for the background
  // video entirely and just leave the poster frame showing, same spirit as
  // the gyro listener below being skipped for the same media query.
  const [reduceMotion, setReduceMotion] = useState(false)
  // Phones/tablets have no mouse — gyro tilt is their *only* way to drive
  // this effect, so it needs a noticeably larger range than the desktop
  // mouse-parallax version to actually read as "the background reacts to
  // me" rather than a barely-there wobble.
  const [coarsePointer, setCoarsePointer] = useState(false)
  const gyroAmp = coarsePointer ? 1.9 : 1

  // shared pointer/gyro position (-0.5 .. 0.5)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // glass panel: gentle 3D tilt toward the cursor / device orientation
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5 * gyroAmp, -5 * gyroAmp]), { stiffness: 110, damping: 20 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7 * gyroAmp, 7 * gyroAmp]), { stiffness: 110, damping: 20 })
  const panelX = useSpring(useTransform(mx, [-0.5, 0.5], [-10 * gyroAmp, 10 * gyroAmp]), { stiffness: 60, damping: 20 })
  const panelY = useSpring(useTransform(my, [-0.5, 0.5], [-6 * gyroAmp, 6 * gyroAmp]), { stiffness: 60, damping: 20 })

  // background image: counter-parallax (moves opposite the panel for depth)
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [18 * gyroAmp, -18 * gyroAmp]), { stiffness: 50, damping: 22 })
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [12 * gyroAmp, -12 * gyroAmp]), { stiffness: 50, damping: 22 })
  const bgRotX = useSpring(useTransform(my, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 50, damping: 22 })
  const bgRotY = useSpring(useTransform(mx, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 50, damping: 22 })

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % profile.roles.length), 2400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // gyroscope tilt on devices that expose orientation (Android; iOS grants it
  // silently on some browsers — if the OS withholds events we simply stay static)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    setCoarsePointer(window.matchMedia('(pointer: coarse)').matches)
    let listening = false
    let active = true
    let pending = false
    let latest = null
    const onOrient = (e) => {
      if (e.gamma == null || e.beta == null) return
      latest = e
      // Android can fire deviceorientation 30-60x/sec; batching to one
      // update per animation frame avoids recomputing the spring chain
      // far more often than the screen can actually repaint.
      if (pending) return
      pending = true
      requestAnimationFrame(() => {
        pending = false
        if (!latest) return
        // gamma: left/right (-90..90), beta: front/back (-180..180, ~45 when held naturally).
        // Divisor of 38 (was 60) means a normal, comfortable hand-tilt while
        // reading the page reaches most of the -0.5..0.5 range — 60 required
        // an almost-flat-to-vertical swing that people don't casually make,
        // which is why the effect read as "not there" on a real device.
        mx.set(clamp(latest.gamma / 38, -0.5, 0.5))
        my.set(clamp((latest.beta - 45) / 38, -0.5, 0.5))
      })
    }
    const startListening = () => {
      if (listening || !active) return
      window.addEventListener('deviceorientation', onOrient, { passive: true })
      listening = true
    }

    const unlockOrientation = async () => {
      const Orientation = window.DeviceOrientationEvent
      if (Orientation && typeof Orientation.requestPermission === 'function') {
        try {
          const result = await Orientation.requestPermission()
          if (result === 'granted') startListening()
        } catch (e) {
          // If permission is denied or unavailable, pointer parallax still works.
        }
      } else {
        startListening()
      }
    }

    unlockOrientation()
    window.addEventListener('pointerdown', unlockOrientation, { passive: true, once: true })

    return () => {
      active = false
      window.removeEventListener('pointerdown', unlockOrientation)
      if (listening) window.removeEventListener('deviceorientation', onOrient)
    }
  }, [mx, my])

  // Seeking back a beat before the clip actually ends (instead of relying only
  // on native `loop`) avoids the single black frame most browsers flash when
  // `loop` tears the decoder down and restarts it — but `timeupdate` doesn't
  // fire on every frame, so this can occasionally miss its window and let the
  // clip hit its real end. `loop` stays on as a fallback for that case: on the
  // (common) frames where the seek lands in time, `ended` never fires and
  // `loop` never engages, so it costs nothing and just guarantees the video
  // never gets stuck on its last frame.
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    if (v.currentTime >= v.duration - 0.12) {
      v.currentTime = 0
    }
  }
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <section id="top" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-3">
      {/* ---- HUD wallpaper background with parallax/gyro tilt ---- */}
      <div className="absolute inset-0 [perspective:1200px]" aria-hidden>
        <motion.div
          className="absolute inset-0"
          style={{
            x: bgX,
            y: bgY,
            rotateX: bgRotX,
            rotateY: bgRotY,
            scale: 1.08,
            transformStyle: 'preserve-3d',
          }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            poster="/hero/hero-poster.jpg"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onTimeUpdate={handleTimeUpdate}
            aria-hidden="true"
          >
            {/* Phones get the lighter 720p renditions first; anything wider
                falls through to the sharper 1080p ones. WebM/VP9 is listed
                before MP4/H.264 in each tier since it's ~45% smaller at the
                same quality — browsers just use the first source they can
                decode, so this costs nothing on browsers that support it
                and silently falls back to H.264 on the ones that don't.
                4K is its own tier gated to min-width so phones/tablets never
                even consider downloading a ~24MB file for a screen that
                can't show the extra resolution anyway. */}
            <source media="(max-width: 767px)" src="/hero/cyber-arm-720.webm" type="video/webm" />
            <source media="(max-width: 767px)" src="/hero/cyber-arm-720.mp4" type="video/mp4" />
            <source media="(min-width: 1920px)" src="/hero/cyber-arm-2160.mp4" type="video/mp4" />
            <source src="/hero/cyber-arm-1080.webm" type="video/webm" />
            <source src="/hero/cyber-arm-1080.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* dark gradient scrim for text readability over the bright HUD areas */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30" />
        {/* tease, don't reveal: with the name panel's blur turned way down so the
            video reads clearly, this center-weighted scrim is what keeps the shot
            from fully uncovering itself behind the text — edges stay crisp and
            visible, the core stays a little withheld. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_52%_at_50%_50%,rgba(0,0,0,0.4),transparent_78%)]" />

        {/* blend edges into the page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-base to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-base/60 to-transparent" />
      </div>

      {/* ---- floating glass panel ---- */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, x: panelX, y: panelY, transformPerspective: 1400 }}
        className="relative z-10 mx-auto w-full max-w-2xl px-0 py-24 text-center sm:w-[92%] lg:px-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="hero-glass-panel rounded-[2rem] px-5 py-9 sm:px-6 md:rounded-[2.5rem] md:px-9 md:py-11 lg:px-14 lg:py-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs text-fg/70"
          >
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
            Available for freelance &amp; full-time · {profile.location}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ delay: 0.35, duration: 1, ease }}
            className="text-4xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl"
          >
            {profile.firstName} <span className="text-gradient">{profile.lastName}</span>
          </motion.h1>

          {/* morphing role */}
          <div className="mt-5 flex h-8 items-center justify-center overflow-hidden lg:h-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIdx}
                initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease }}
                className="text-lg font-light text-fg/75 lg:text-2xl"
              >
                {profile.roles[roleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="mx-auto mt-5 max-w-lg text-balance text-sm font-light leading-relaxed text-fg/70 lg:text-white/80 lg:text-base"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic strength={0.5}>
              <a
                href={profile.socials.find((s) => s.label === 'Behance')?.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet2-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(109,141,255,0.35)] transition-all hover:shadow-[0_14px_54px_rgba(109,141,255,0.5)]"
              >
                View My Work
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <button
                onClick={() => scrollToId('#contact')}
                data-cursor="link"
                className="rounded-full glass-chip px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-fg/5"
              >
                Contact Me
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId('#work')}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="absolute left-1/2 z-10 -translate-x-1/2 p-3 text-white/60"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="Scroll"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} className="block">
          <ArrowDown size={20} />
        </motion.span>
      </motion.button>
    </section>
  )
}
