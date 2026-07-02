'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/site/smooth-scroll'
import CustomCursor from '@/components/site/custom-cursor'
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

  return (
    <SmoothScroll>
      <div className="relative bg-ink-950">
        <div className="grain" aria-hidden />
        <CustomCursor />
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

export default App
