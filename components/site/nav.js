'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Magnetic from './magnetic'
import { scrollToId } from './smooth-scroll'
import { useActiveSection } from '@/hooks/use-active-section'

const links = [
  { label: 'Work', id: '#work' },
  { label: 'About', id: '#about' },
  { label: 'Skills', id: '#skills' },
  { label: 'Experience', id: '#experience' },
  { label: 'Contact', id: '#contact' },
]
const sectionIds = links.map((l) => l.id)

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="grid h-11 w-11 place-items-center rounded-full glass-chip lg:h-9 lg:w-9" />
  const dark = resolvedTheme === 'dark'
  return (
    <button
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      data-cursor="link"
      aria-label="Toggle theme"
      className="grid h-11 w-11 place-items-center rounded-full glass-chip text-fg/80 transition-colors hover:text-fg lg:h-9 lg:w-9"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.3 }}
          className="block"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 lg:px-6" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
        <div className="flex w-full items-center justify-between rounded-full glass-panel px-4 py-2.5 lg:px-5" style={{ borderRadius: 999 }}>
          <button onClick={() => go('#top')} data-cursor="link" className="group flex items-center gap-2.5">
            <span className="block h-8 w-8 overflow-hidden rounded-full ring-1 ring-fg/20 transition-transform duration-700 group-hover:rotate-[360deg]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait.jpg" alt="Niloy Roy" className="h-full w-full object-cover object-top" />
            </span>
            <span className="text-sm font-medium tracking-tight text-fg/90">Niloy Roy</span>
          </button>

          <nav className="hidden items-center gap-0.5 md:flex md:gap-1">
            {links.map((l) => {
              const isActive = active === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  data-cursor="link"
                  className={`group relative rounded-full px-3 py-2 text-sm transition-colors lg:px-4 ${isActive ? 'text-fg' : 'text-fg/60 hover:text-fg'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-fg/8"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gradient-to-r from-brand to-violet2 transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden lg:block">
              <Magnetic strength={0.4}>
                <button
                  onClick={() => go('#contact')}
                  data-cursor="link"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-violet2-500 px-5 py-2 text-sm font-medium text-white shadow-[0_6px_24px_rgba(109,141,255,0.35)] transition-shadow hover:shadow-[0_8px_32px_rgba(109,141,255,0.5)]"
                >
                  Let's talk
                </button>
              </Magnetic>
            </div>
            <button onClick={() => setOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-full text-fg md:hidden" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-4 mt-2 overflow-hidden rounded-3xl glass-panel p-2 md:hidden"
          >
            {links.map((l) => {
              const isActive = active === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`block w-full rounded-2xl px-4 py-3 text-left text-base transition-colors ${
                    isActive ? 'bg-fg/8 text-fg' : 'text-fg/80 hover:bg-fg/5'
                  }`}
                >
                  {l.label}
                </button>
              )
            })}
            <button onClick={() => go('#contact')} className="mt-1 block w-full rounded-2xl bg-gradient-to-r from-brand-500 to-violet2-500 px-4 py-3 text-left text-base font-medium text-white">Let's talk</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
