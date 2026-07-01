'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/portfolio-data'
import { Reveal, TextReveal } from './reveal'

function posterFor(src) {
  return src.replace('/motion/', '/motion/posters/').replace('.mp4', '.jpg')
}

function Media({ project, className }) {
  if (project.type === 'video') {
    return (
      <video
        className={className}
        src={project.cover}
        poster={posterFor(project.cover)}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={project.cover} alt={project.title} loading="lazy" decoding="async" className={className} />
}

function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 ? 60 : 28, index % 2 ? -60 : -28])

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * 12)
    rx.set(-py * 12)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div style={{ y }} className="[perspective:1400px]">
      <Reveal delay={(index % 2) * 0.08}>
        <motion.button
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={() => onOpen(project)}
          data-cursor="open"
          data-cursor-label="View"
          style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
          className="group relative block w-full overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] text-left transition-shadow duration-500 hover:border-brand/40 hover:shadow-[0_30px_80px_-20px_rgba(91,140,255,0.35)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Media
              project={project}
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
            <div className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full glass opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={18} className="text-white" />
            </div>
            <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[11px] font-medium tracking-wide text-white/80">{project.category}</span>
          </div>

          <div className="relative p-6" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{project.title}</h3>
              <span className="shrink-0 text-sm text-white/40">{project.year}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">{project.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand">
              View case study
              <span className="h-px w-8 origin-left bg-brand transition-all duration-500 group-hover:w-14" />
            </span>
          </div>
        </motion.button>
      </Reveal>
    </motion.div>
  )
}

export default function Portfolio({ onOpen }) {
  return (
    <section id="work" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand">
              <span className="h-px w-8 bg-brand" /> Selected Work
            </span>
          </Reveal>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            <TextReveal text="Projects that" /> <br className="hidden md:block" />
            <TextReveal text="move people." wordClass="text-white/40" delay={0.15} />
          </h2>
        </div>
        <Reveal delay={0.1} className="max-w-sm text-sm leading-relaxed text-white/50 md:text-right">
          Brand campaigns, motion films, photo manipulation and photography — crafted across design, video and AI.
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
