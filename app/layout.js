import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', weight: ['400', '500', '600', '700'] })
const graffiti = localFont({ src: '../public/fonts/adrip1.ttf', variable: '--font-graffiti', display: 'swap' })

export const metadata = {
  // IMPORTANT: set NEXT_PUBLIC_BASE_URL in your deployment to your real site URL (https://example.com)
  // Fallback below points to the GitHub Pages URL for this repo so social scrapers get an absolute origin.
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://niloyroy555-ship-it.github.io/Niloy-Roy-Portfolio'),
  title: 'Niloy Roy — AI Visual Designer, Motion Designer & Video Editor',
  description: 'Portfolio of Niloy Roy — AI Visual Designer, Creative Designer, Video Editor & Prompt Engineer. Cinematic brand creatives, motion design and photography for premium brands.',
  keywords: ['Niloy Roy', 'AI Visual Designer', 'Motion Designer', 'Video Editor', 'Graphic Designer', 'Prompt Engineer', 'Portfolio', 'Kolkata'],
  authors: [{ name: 'Niloy Roy' }],
  openGraph: {
    title: 'Niloy Roy — AI Visual Designer & Motion Designer',
    description: 'Cinematic brand creatives, motion design and photography for premium brands.',
    type: 'website',
    // Use the portrait.jpg that already exists in /public — avoid spaces in filenames for social scrapers
    images: ['/portrait.jpg'],
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${graffiti.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
