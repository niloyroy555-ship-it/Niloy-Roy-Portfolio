'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/site/smooth-scroll'
import CustomCursor from '@/components/site/custom-cursor'
import SpatialBackground from '@/components/site/spatial-background'
import IntroSplash from '@/components/site/intro-splash'
import Nav from '@/components/site/nav'
import Hero from '@/components/site/hero'
import Marquee from '@/components/site/marquee'
import Portfolio from '@/components/site/portfolio'
import ProjectModal from '@/components/site/project-modal'
import About from '@/components/site/about'
import Timeline from '@/components/site/timeline'
import Contact from '@/components/site/contact'
import Footer from '@/components/site/footer'

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
