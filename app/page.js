'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/site/smooth-scroll'
import CustomCursor from '@/components/site/custom-cursor'
import LoadingScreen from '@/components/site/loading-screen'
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
  const [appReady, setAppReady] = useState(false)

  // Lock scroll while the loading screen is up so nothing shifts behind it
  useEffect(() => {
    document.documentElement.style.overflow = appReady ? '' : 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [appReady])

  return (
    <SmoothScroll>
      <div className="relative bg-ink-950">
        {!appReady && <LoadingScreen onDone={() => setAppReady(true)} />}
        <div className="grain" aria-hidden />
        <CustomCursor />
        <Toaster theme="dark" position="bottom-center" richColors />
        <Nav />
        <main>
          <Hero videoActive={appReady} />
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
