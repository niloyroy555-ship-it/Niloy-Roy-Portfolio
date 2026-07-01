'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Magnetic from './magnetic'
import { scrollToId } from './smooth-scroll'

const links = [
  { label: 'Work', id: '#work' },
  { label: 'About', id: '#about' },
  { label: 'Experience', id: '#experience' },
  { label: 'Contact', id: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 py-4 transition-all duration-500 md:px-8 ${scrolled ? 'mt-2 md:mt-3' : ''}`}>
        <div className={`flex w-full items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-5 ${scrolled ? 'glass' : ''}`}>
          <button onClick={() => go('#top')} data-cursor="link" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-bold text-ink-950 transition-transform duration-500 group-hover:rotate-[360deg]">NR</span>
            <span className="text-sm font-medium tracking-tight text-white/90">Niloy Roy</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-cursor="link"
                className="group relative rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <Magnetic strength={0.4}>
              <button
                onClick={() => go('#contact')}
                data-cursor="link"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Let's talk
              </button>
            </Magnetic>
          </div>

          <button onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full text-white md:hidden" aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-5 mt-1 overflow-hidden rounded-2xl glass p-2 md:hidden"
          >
            {links.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="block w-full rounded-xl px-4 py-3 text-left text-base text-white/80 hover:bg-white/5">
                {l.label}
              </button>
            ))}
            <button onClick={() => go('#contact')} className="mt-1 block w-full rounded-xl bg-brand px-4 py-3 text-left text-base font-medium text-white">Let's talk</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
