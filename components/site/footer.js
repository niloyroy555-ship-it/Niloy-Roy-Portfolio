'use client'

import { motion } from 'framer-motion'
import { profile } from '@/lib/portfolio-data'
import { scrollToId } from './smooth-scroll'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="border-t border-white/8 px-5 py-10 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <button onClick={() => scrollToId('#top')} data-cursor="link" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-bold text-ink-950">NR</span>
          <span className="text-sm font-medium text-white/80">{profile.name}</span>
        </button>
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-white/45">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="link" className="transition-colors hover:text-white">{s.label}</a>
          ))}
        </div>
        <p className="text-xs text-white/35">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}
