'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/portfolio-data'
import { Reveal, TextReveal } from './reveal'
import RevealMedia from './reveal-media'

function posterFor(src) {
  return src.replace('/motion/', '/motion/posters/').replace('.mp4', '.jpg')
}

// true on touch devices — used to avoid autoplaying heavy videos on mobile data
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
  }, [])
  return coarse
}

function Media({ project, className }) {
  const coarse = useCoarsePointer()
  const style = { objectPosition: project.coverPosition || 'center' }

  if (project.type === 'video') {
    // Mobile: show the lightweight poster instead of autoplaying the mp4.
    // Tapping the card opens the case study where the video can be played.
    if (coarse) {
      return <RevealMedia type="image" src={posterFor(project.cover)} alt={project.title} className={className} style={style} />
    }
    return (
      <RevealMedia
        type="video"
        src={project.cover}
        poster={posterFor(project.cover)}
        className={className}
        style={style}
        videoProps={{ muted: true, loop: true, playsInline: true, autoPlay: true, preload: 'metadata' }}
      />
    )
  }
  return <RevealMedia type="image" src={project.cover} alt={project.title} className={className} style={style} />
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
    ry.set(px * 10)
    rx.set(-py * 10)
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
          className="group relative block w-full overflow-hidden rounded-[2rem] glass-card text-left transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(109,141,255,0.18)]"
        >
          <div className="relative m-2.5 overflow-hidden rounded-[1.5rem]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Media
                project={project}
                className="h-full w-full scale-[1.02] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full glass-chip opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={18} className="text-white" />
              </div>
              <span className="absolute left-4 top-4 rounded-full glass-chip px-3 py-1 text-[11px] font-medium tracking-wide text-white/90">{project.category}</span>
            </div>
          </div>

          <div className="relative px-6 pb-6 pt-2" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold tracking-tight text-fg md:text-2xl">{project.title}</h3>
              <span className="shrink-0 text-sm text-fg/40">{project.year}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-fg/55">{project.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand">
              View case study
              <span className="h-px w-8 origin-left bg-gradient-to-r from-brand to-violet2 transition-all duration-500 group-hover:w-14" />
            </span>
          </div>
        </motion.button>
      </Reveal>
    </motion.div>
  )
}

export default function Portfolio({ onOpen }) {
  return (
    <section id="work" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand">
              Selected Work
            </span>
          </Reveal>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-fg md:text-6xl">
            <TextReveal text="Projects that" /> <br className="hidden md:block" />
            <TextReveal text="move people." wordClass="text-gradient" delay={0.15} />
          </h2>
        </div>
        <Reveal delay={0.1} className="max-w-sm text-sm font-light leading-relaxed text-fg/50 md:text-right">
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
