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
      className="px-4 pb-6 md:px-6"
    >
      <div className="mx-auto max-w-7xl rounded-[2rem] glass-card px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <button onClick={() => scrollToId('#top')} data-cursor="link" className="flex items-center gap-2.5">
            <span className="block h-8 w-8 overflow-hidden rounded-full ring-1 ring-fg/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait.jpg" alt="Niloy Roy" className="h-full w-full object-cover object-top" />
            </span>
            <span className="text-sm font-medium text-fg/80">{profile.name}</span>
          </button>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-light text-fg/50">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="link" className="transition-colors hover:text-fg">{s.label}</a>
            ))}
          </div>
          <p className="text-xs font-light text-fg/40">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
