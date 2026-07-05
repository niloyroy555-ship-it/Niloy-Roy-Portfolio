'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, Loader2, Mail, Phone, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import { profile } from '@/lib/portfolio-data'
import Magnetic from './magnetic'
import { Reveal, TextReveal } from './reveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | done

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
      toast.success('Message sent \u2014 I\u2019ll get back to you soon!')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 2600)
    } catch (err) {
      setStatus('idle')
      toast.error('Something went wrong. Please email me directly.')
    }
  }

  const inputCls = 'w-full rounded-2xl glass-chip px-4 py-3.5 text-fg outline-none transition-all placeholder:text-fg/35 focus:ring-2 focus:ring-brand/60'

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand">
              Contact
            </span>
          </Reveal>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
            <TextReveal text="Let's create" />
            <br />
            <TextReveal text="something" wordClass="text-gradient" delay={0.1} />{' '}
            <TextReveal text="memorable." delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-fg/55">
              Have a brand, a film or an idea in mind? I'm open to freelance and full-time work.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-8 flex items-center gap-3">
              <span className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/portrait.jpg" alt="Niloy Roy" className="h-12 w-12 rounded-full object-cover object-top ring-2 ring-fg/15" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-base bg-emerald-400" />
              </span>
              <div>
                <p className="text-sm font-medium text-fg/90">Niloy Roy</p>
                <p className="text-xs text-emerald-500">Available for new projects</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 space-y-3">
            <a href={`mailto:${profile.email}`} data-cursor="link" className="flex items-center gap-3 text-fg/70 transition-colors hover:text-fg">
              <span className="grid h-10 w-10 place-items-center rounded-full glass-chip"><Mail size={17} /></span>
              {profile.email}
            </a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`} data-cursor="link" className="flex items-center gap-3 text-fg/70 transition-colors hover:text-fg">
              <span className="grid h-10 w-10 place-items-center rounded-full glass-chip"><Phone size={17} /></span>
              {profile.phone}
            </a>
          </div>

          <div className="mt-10 flex gap-3">
            {profile.socials.map((s) => (
              <Magnetic key={s.label} strength={0.5}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label={s.label}
                  className="grid h-12 w-12 place-items-center rounded-full glass-chip text-sm font-medium text-fg/80 transition-all hover:text-fg hover:shadow-[0_8px_30px_rgba(109,141,255,0.35)]"
                >
                  {s.label === 'Instagram' ? <Instagram size={18} /> : s.short}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <form onSubmit={submit} className="rounded-[2.5rem] glass-panel p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/45">Name</label>
                <input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={update('name')} placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/45">Email</label>
                <input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="off" autoCorrect="off" value={form.email} onChange={update('email')} placeholder="you@email.com" className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/45">Message</label>
                <textarea id="contact-message" name="message" value={form.message} onChange={update('message')} rows={4} placeholder="Tell me about your project…" className={`${inputCls} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={status !== 'idle'}
                data-cursor="link"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-violet2-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(109,141,255,0.35)] transition-all hover:shadow-[0_14px_54px_rgba(109,141,255,0.5)] disabled:opacity-90"
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                      Send message <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </motion.span>
                  )}
                  {status === 'loading' && (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </motion.span>
                  )}
                  {status === 'done' && (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Check size={16} /> Sent!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
