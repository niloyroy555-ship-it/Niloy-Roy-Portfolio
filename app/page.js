'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/site/smooth-scroll'
import CustomCursor from '@/components/site/custom-cursor'
import SpatialBackground from '@/components/site/spatial-background'
import IntroSplash from '@/components/site/intro-splash'
import Nav from '@/components/site/nav'
import NowPlaying from '@/components/site/now-playing'
import Hero from '@/components/site/hero'
import Marquee from '@/components/site/marquee'
import Portfolio from '@/components/site/portfolio'

// Below-the-fold / interaction-gated sections are code-split so the initial
// bundle the browser has to parse and execute before the page is
// interactive is smaller — this matters most on mobile CPUs, where JS
// parse/execute time (not just network) is a real chunk of "time until
// scrolling feels responsive". These still render their HTML normally;
// only the JS module loading is deferred.
const About = dynamic(() => import('@/components/site/about'))
const Timeline = dynamic(() => import('@/components/site/timeline'))
const Contact = dynamic(() => import('@/components/site/contact'))
const Footer = dynamic(() => import('@/components/site/footer'))
// The project modal is fully interaction-gated (nothing renders until a
// card is tapped), so it's safe to skip SSR for it entirely.
const ProjectModal = dynamic(() => import('@/components/site/project-modal'), { ssr: false })

function App() {
  const [active, setActive] = useState(null)
  // becomes true the moment the intro starts revealing the hero
  const [heroReady, setHeroReady] = useState(false)

  return (
    <SmoothScroll>
      <div className="relative min-h-screen">
        <SpatialBackground />
        <CustomCursor />
        <Toaster position="bottom-center" richColors />
        <IntroSplash onReveal={() => setHeroReady(true)} />
        <NowPlaying />
        <Nav />
        <main>
          <Hero ready={heroReady} />
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

export default App
