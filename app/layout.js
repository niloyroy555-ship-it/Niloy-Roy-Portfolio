import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', weight: ['400', '500', '600', '700'] })
const graffiti = localFont({ src: '../public/fonts/adrip1.ttf', variable: '--font-graffiti', display: 'swap' })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://magic-studio-4.preview.emergentagent.com'),
  title: 'Niloy Roy — AI Visual Designer, Motion Designer & Video Editor',
  description: 'Portfolio of Niloy Roy — AI Visual Designer, Creative Designer, Video Editor & Prompt Engineer. Cinematic brand creatives, motion design and photography for premium brands.',
  keywords: ['Niloy Roy', 'AI Visual Designer', 'Motion Designer', 'Video Editor', 'Graphic Designer', 'Prompt Engineer', 'Portfolio', 'Kolkata'],
  authors: [{ name: 'Niloy Roy' }],
  openGraph: {
  url: 'https://niloy-roy-portfolio.vercel.app',
  title: 'Niloy Roy — AI Visual Designer & Motion Designer',
  description: 'Cinematic brand creatives, motion design and photography for premium brands.',
  type: 'website',
  images: ['/og-image.png'],
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
