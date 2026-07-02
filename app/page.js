'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'sonner'

const SmoothScroll = dynamic(() => import('@/components/site/smooth-scroll'), { ssr: false, loading: () => null })
const CustomCursor = dynamic(() => import('@/components/site/custom-cursor'), { ssr: false, loading: () => null })

import Nav from '@/components/site/nav'
import Hero from '@/components/site/hero'
import Marquee from '@/components/site/marquee'
import Portfolio from '@/components/site/portfolio'
import ProjectModal from '@/components/site/project-modal'
import About from '@/components/site/about'
import Timeline from '@/components/site/timeline'
import Contact from '@/components/site/contact'
import Footer from '@/components/site/footer'

export default function App() {
  const [active, setActive] = useState(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
    setIsTouch(!!touch)
  }, [])

  return (
    <SmoothScroll>
      <div className="relative bg-ink-950">
        <div className="grain" aria-hidden />
        {!isTouch && <CustomCursor />}
        <Toaster theme="dark" position="bottom-center" richColors />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Portfolio onOpen={setActive} />
          <About />
          <Timeline />
          <Contact />
        </main>
        <Footer />
        <ProjectModal project={active} onClose={() => setActive(null)} />
      </div>
    </SmoothScroll>
  )
}
