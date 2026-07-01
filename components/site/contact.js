'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, Loader2, Mail, Phone } from 'lucide-react'
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

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand">
              <span className="h-px w-8 bg-brand" /> Contact
            </span>
          </Reveal>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            <TextReveal text="Let's create" />
            <br />
            <TextReveal text="something" wordClass="text-white/40" delay={0.1} />{' '}
            <TextReveal text="memorable." delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
              Have a brand, a film or an idea in mind? I'm open to freelance and full-time work.
            </p>
          </Reveal>

          <div className="mt-10 space-y-3">
            <a href={`mailto:${profile.email}`} data-cursor="link" className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
              <span className="grid h-10 w-10 place-items-center rounded-full glass"><Mail size={17} /></span>
              {profile.email}
            </a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`} data-cursor="link" className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
              <span className="grid h-10 w-10 place-items-center rounded-full glass"><Phone size={17} /></span>
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
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/12 text-sm font-medium text-white/80 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {s.short}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <form onSubmit={submit} className="rounded-3xl border border-white/10 glass p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">Name</label>
                <input value={form.name} onChange={update('name')} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">Email</label>
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">Message</label>
                <textarea value={form.message} onChange={update('message')} rows={4} placeholder="Tell me about your project…" className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand" />
              </div>
              <button
                type="submit"
                disabled={status !== 'idle'}
                data-cursor="link"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-4 text-sm font-semibold text-ink-950 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-90"
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
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-brand-700">
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
