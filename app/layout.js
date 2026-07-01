import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', weight: ['400', '500', '600', '700'] })

export const metadata = {
  metadataBase: new URL('https://magic-studio-4.preview.emergentagent.com'),
  title: 'Niloy Roy — AI Visual Designer, Motion Designer & Video Editor',
  description: 'Portfolio of Niloy Roy — AI Visual Designer, Creative Designer, Video Editor & Prompt Engineer. Cinematic brand creatives, motion design and photography for premium brands.',
  keywords: ['Niloy Roy', 'AI Visual Designer', 'Motion Designer', 'Video Editor', 'Graphic Designer', 'Prompt Engineer', 'Portfolio', 'Kolkata'],
  authors: [{ name: 'Niloy Roy' }],
  openGraph: {
    title: 'Niloy Roy — AI Visual Designer & Motion Designer',
    description: 'Cinematic brand creatives, motion design and photography for premium brands.',
    type: 'website',
    images: ['/works/creatives/creative-1.jpg'],
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
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
