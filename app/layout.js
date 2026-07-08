import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import { Providers } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', weight: ['400', '500', '600', '700'] })
const graffiti = localFont({ src: '../public/fonts/adrip1.ttf', variable: '--font-graffiti', display: 'swap' })

// Single source of truth for the site's public URL.
// Set NEXT_PUBLIC_BASE_URL in your Vercel project's Environment Variables
// to your real production domain (e.g. https://niloyroy.com).
// Everything below reads from this constant so it can never drift out of sync.
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://niloy-roy-portfolio.vercel.app'

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Niloy Roy — AI Visual Designer, Motion Designer & Video Editor',
  description: 'Portfolio of Niloy Roy — AI Visual Designer, Creative Designer, Video Editor & Prompt Engineer. Cinematic brand creatives, motion design and photography for premium brands.',
  keywords: ['Niloy Roy', 'AI Visual Designer', 'Motion Designer', 'Video Editor', 'Graphic Designer', 'Prompt Engineer', 'Portfolio', 'Kolkata'],
  authors: [{ name: 'Niloy Roy' }],
  openGraph: {
    url: baseUrl,
    title: 'Niloy Roy — AI Visual Designer & Motion Designer',
    description: 'Cinematic brand creatives, motion design and photography for premium brands.',
    type: 'website',
    siteName: 'Niloy Roy Portfolio',
    images: [
      {
        // Resolved against metadataBase -> `${baseUrl}/og-image.png`
        url: '/og-image.png',
        // Must match the actual file's real pixel dimensions or some
        // crawlers (Facebook/LinkedIn) will reject or mis-render the image.
        width: 1728,
        height: 910,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Niloy Roy — AI Visual Designer & Motion Designer',
    description: 'Cinematic brand creatives, motion design and photography for premium brands.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${graffiti.variable}`}>
      <head>
        {/* Preload the loader wallpaper so the splash paints instantly (WebP; JPEG fallback is only fetched by legacy browsers) */}
        <link
          rel="preload"
          as="image"
          imageSrcSet="/loader/loader-bg-960.webp 960w, /loader/loader-bg-1900.webp 1900w"
          imageSizes="100vw"
          fetchPriority="high"
        />
        {/* Poster frame for the hero background video — paints immediately
            behind the glass panel while the video itself buffers in */}
        <link
          rel="preload"
          as="image"
          imageSrcSet="/hero/cyber-arm-poster-960.webp 960w, /hero/cyber-arm-poster-1900.webp 1900w"
          imageSizes="100vw"
        />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
