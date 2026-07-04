'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import RevealMedia from './reveal-media'

const ease = [0.22, 1, 0.36, 1]

function GalleryItem({ src, i }) {
  const isVideo = src.endsWith('.mp4')
  const poster = isVideo ? src.replace('/motion/', '/motion/posters/').replace('.mp4', '.jpg') : undefined
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
      {isVideo ? (
        <RevealMedia
          type="video"
          src={src}
          poster={poster}
          delay={(i % 2) * 0.08}
          className="h-full w-full object-cover"
          videoProps={{ controls: true, muted: true, loop: true, playsInline: true, preload: 'metadata' }}
        />
      ) : (
        <RevealMedia
          type="image"
          src={src}
          delay={(i % 2) * 0.08}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
    </div>
  )
}

function Meta({ label, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/35">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75">{s}</span>
        ))}
      </div>
    </div>
  )
}

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
      if (window.__lenis) window.__lenis.stop()
    }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      if (window.__lenis) window.__lenis.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  const heroIsVideo = project && project.type === 'video'

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop - optimized: no blur, simple fade */}
          <motion.div
            className="absolute inset-0 bg-ink-950/80"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease }}
            className="relative mx-auto my-6 w-[94%] max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0E] md:my-12"
            style={{ willChange: 'transform, opacity' }}
          >
            <button
              onClick={onClose}
              data-cursor="link"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full glass text-white transition-colors hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Hero media */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {heroIsVideo ? (
                <RevealMedia
                  type="video"
                  src={project.cover}
                  poster={project.cover.replace('/motion/', '/motion/posters/').replace('.mp4', '.jpg')}
                  className="h-full w-full object-cover"
                  videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true }}
                />
              ) : (
                <RevealMedia type="image" src={project.cover} alt={project.title} className="h-full w-full object-cover" />
              )}

              <div className="absolute bottom-6 left-6 right-6" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.5)' }}>
                <span className="mb-3 inline-block rounded-full glass px-3 py-1 text-[11px] tracking-wide text-white/80">{project.category} · {project.year}</span>
                <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">{project.title}</h2>
              </div>
            </div>

            <div className="space-y-12 p-6 md:p-10">
              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand">Overview</p>
                  <p className="text-lg leading-relaxed text-white/70">{project.overview}</p>
                </div>
                <div className="space-y-6">
                  <Meta label="My Role" items={[project.role]} />
                  <Meta label="Software" items={project.software} />
                  <Meta label="AI Tools" items={project.aiTools} />
                </div>
              </div>

              {/* Process */}
              <div>
                <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/35">Process</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {project.process.map((step, i) => (
                    <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                      <span className="font-display text-2xl font-bold text-brand/70">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="mt-3 font-medium text-white">{step.t}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/50">{step.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/35">Gallery</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.gallery.map((src, i) => (
                    <GalleryItem key={src + i} src={src} i={i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop - optimized: no blur, simple fade */}
          <motion.div
            className="absolute inset-0 bg-ink-950/80"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease }}
            className="relative mx-auto my-6 w-[94%] max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0E] md:my-12"
            style={{ willChange: 'transform, opacity' }}
          >
            <button
              onClick={onClose}
              data-cursor="link"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full glass text-white transition-colors hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Hero media */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {heroIsVideo ? (
                <RevealMedia
                  type="video"
                  src={project.cover}
                  poster={project.cover.replace('/motion/', '/motion/posters/').replace('.mp4', '.jpg')}
                  className="h-full w-full object-cover"
                  videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true }}
                />
              ) : (
                <RevealMedia type="image" src={project.cover} alt={project.title} className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="mb-3 inline-block rounded-full glass px-3 py-1 text-[11px] tracking-wide text-white/80">{project.category} · {project.year}</span>
                <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">{project.title}</h2>
              </div>
            </div>

            <div className="space-y-12 p-6 md:p-10">
              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand">Overview</p>
                  <p className="text-lg leading-relaxed text-white/70">{project.overview}</p>
                </div>
                <div className="space-y-6">
                  <Meta label="My Role" items={[project.role]} />
                  <Meta label="Software" items={project.software} />
                  <Meta label="AI Tools" items={project.aiTools} />
                </div>
              </div>

              {/* Process */}
              <div>
                <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/35">Process</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {project.process.map((step, i) => (
                    <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                      <span className="font-display text-2xl font-bold text-brand/70">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="mt-3 font-medium text-white">{step.t}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/50">{step.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/35">Gallery</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.gallery.map((src, i) => (
                    <GalleryItem key={src + i} src={src} i={i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
