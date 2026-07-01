// Real content sourced from Niloy Roy's CV + curated portfolio assets.

export const profile = {
  name: 'Niloy Roy',
  firstName: 'Niloy',
  lastName: 'Roy',
  roles: ['AI Visual Designer', 'Creative Designer', 'Video Editor', 'Prompt Engineer'],
  tagline: 'Creative Graphic Designer & Video Editor crafting dynamic visuals across digital and print — now blending motion, light VFX and AI to elevate brand storytelling.',
  shortIntro:
    "I'm Niloy — a visual & motion designer with 5+ years turning brand narratives into cinematic visuals. I work across Adobe Creative Suite, DaVinci Resolve and a modern AI toolkit to design, animate and edit content that moves people.",
  location: 'Kolkata, India',
  email: 'niloyroy555@gmail.com',
  phone: '+91 7003664506',
  stats: [
    { value: 5, suffix: '+', label: 'Years experience' },
    { value: 25, suffix: '+', label: 'Brands worked with' },
    { value: 300, suffix: '+', label: 'Creatives shipped' },
    { value: 150, suffix: 'K+', label: 'Views on a single edit' },
  ],
  socials: [
    { label: 'LinkedIn', short: 'In', href: 'https://www.linkedin.com/in/niloy-roy-6770571b3/' },
    { label: 'Behance', short: 'Be', href: 'https://www.behance.net/niloyroy99' },
    { label: 'Portfolio', short: 'Dr', href: 'https://drive.google.com/drive/folders/10YDLo5xkgaN8V2I2COgVx8KHETw6P7nd' },
    { label: 'Email', short: '@', href: 'mailto:niloyroy555@gmail.com' },
  ],
}

export const brands = [
  'Tata Trusts', 'Senco Gold & Diamonds', 'AN Group', 'Nirmala Group', 'Zee Bangla',
  'ITC', 'Budweiser', 'Anaash Jewellery', 'Grandstreet', 'Aislinn',
  'Madhogarias Silver Art', 'Wonderlust Ink.', 'Premiers Tea', 'AVM Granite', 'Kalp Kids',
  'Indothai', 'Label YM', 'Sreshth ORA', 'Myrrah', 'Zee Cinema',
]

export const skills = {
  design: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Adobe Bridge'],
  motion: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Nuke', 'iClone', 'Silhouette', '3DEqualizer'],
  ai: ['ChatGPT', 'Google Gemini', 'ElevenLabs', 'Hailuo AI', 'Freepik AI', 'Higgsfield'],
}

export const experience = [
  { company: 'PR75K Media', role: 'Video Editor', period: 'May 2026 — Jul 2026', desc: 'Edited long-form technology content for YouTube in DaVinci Resolve — one video crossed 150K+ views in under a month.', tags: ['DaVinci Resolve', 'YouTube'] },
  { company: 'Aspire Digital Media', role: 'Video / Photo Editor', period: 'Nov 2025 — May 2026', desc: 'Produced AI-driven assets using Higgsfield, ChatGPT & Gemini for multiple brands, collaborating with the team to polish final creatives.', tags: ['Higgsfield', 'AI Assets'] },
  { company: 'Graph\u0113', role: 'Video Editor & Graphic Designer', period: 'Aug 2025 — Oct 2025', desc: 'Developed creative assets and innovative social edits, leveraging ChatGPT, Gemini, ElevenLabs, Hailuo AI & Freepik AI.', tags: ['Motion', 'Social'] },
  { company: 'Wonderlust Ink.', role: 'Freelance Editor & Designer', period: 'Apr 2025 — Present', desc: "Creatives and reels for Wonderlust Ink's official Instagram and Facebook pages.", tags: ['Reels', 'Branding'] },
  { company: 'Swasti Ruia Consultancy', role: 'Freelance Editor & Designer', period: 'Oct 2024 — Apr 2025', desc: 'Creatives for Grandstreet shopping mall and reels for fashion brands Aislinn & Anaash Jewellery.', tags: ['Retail', 'Fashion'] },
  { company: 'Law & Kenneth Saatchi & Saatchi', role: 'Account Executive Intern', period: 'Jun 2022 — Aug 2022', desc: 'Advertising campaigns for Zee Bangla & Zee Cinema; coordinated with creative teams for ITC and Teas of India.', tags: ['Advertising', 'Zee'] },
  { company: 'Rediffusion Brand Solutions', role: 'Client Servicing Intern', period: 'Sep 2020 — Nov 2020', desc: 'Worked across Tata Trusts, Senco Gold & Diamonds and Ruchi Food Line — briefs, research and competitor analysis.', tags: ['Strategy', 'Research'] },
]

const photography = [
  '/works/photography/photo-1.jpg', '/works/photography/photo-2.png', '/works/photography/photo-3.jpg',
  '/works/photography/photo-4.png', '/works/photography/photo-5.jpg', '/works/photography/photo-6.png',
  '/works/photography/photo-7.png', '/works/photography/photo-8.png', '/works/photography/photo-9.png',
  '/works/photography/photo-10.png', '/works/photography/photo-11.jpg', '/works/photography/photo-12.png',
  '/works/photography/photo-13.png', '/works/photography/photo-14.png',
]
const creatives = Array.from({ length: 16 }, (_, i) => `/works/creatives/creative-${i + 1}.jpg`)
const manip = Array.from({ length: 10 }, (_, i) => `/works/manipulation/manip-${i + 1}.jpg`)
const motion = Array.from({ length: 8 }, (_, i) => `/works/motion/motion-${i + 1}.mp4`)

export const projects = [
  {
    id: 'silver',
    title: 'Madhogarias Silver Art',
    brand: 'Silver Art',
    category: 'Brand \u00b7 Social Creatives',
    year: '2025',
    type: 'image',
    cover: creatives[0],
    description: 'A luxury silver-jewellery campaign built around quiet emotion and light — where every frame feels like a keepsake.',
    overview: 'A full social campaign for a premium silver jewellery house. The brief: make silver feel intimate and modern rather than loud. We built a restrained visual language — soft light, editorial typography and emotive copy — that scaled across festive moments like Valentine\u2019s and gifting seasons.',
    role: 'Visual Designer & Art Director',
    software: ['Photoshop', 'Illustrator', 'InDesign'],
    aiTools: ['Freepik AI', 'ChatGPT', 'Google Gemini'],
    process: [
      { t: 'Concept', d: 'Defined an emotive, gift-led narrative and a minimal editorial art direction.' },
      { t: 'Design', d: 'Crafted a scalable template system across product, lifestyle and copy-led frames.' },
      { t: 'AI Assist', d: 'Used generative tools to explore backgrounds and speed up variant production.' },
      { t: 'Delivery', d: 'Shipped a consistent monthly grid across Instagram & Facebook.' },
    ],
    gallery: creatives.slice(0, 6),
  },
  {
    id: 'anfront',
    title: 'AN Group \u2014 Ocean Blush',
    brand: 'AN Group',
    category: 'Real Estate \u00b7 Motion',
    year: '2026',
    type: 'video',
    cover: motion[0],
    description: 'A cinematic colour-story launch film for a real-estate collection — soft florals, ocean skies and slow summer motion.',
    overview: 'Motion-led launch campaign for AN Group\u2019s \u201cOcean Blush\u201d colour story. The goal was to make a paint / interior collection feel aspirational and calm. We designed a teaser-to-reveal sequence with fluid transitions, ambient light and gentle type animation.',
    role: 'Motion Designer & Editor',
    software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    aiTools: ['Higgsfield', 'Hailuo AI', 'Freepik AI'],
    process: [
      { t: 'Storyboard', d: 'Mapped a teaser \u2192 reveal narrative around a single colour mood.' },
      { t: 'Motion', d: 'Animated fluid transitions, light leaks and kinetic type in After Effects.' },
      { t: 'Grade', d: 'Colour-graded for a soft, oceanic, premium feel in DaVinci Resolve.' },
      { t: 'Cutdowns', d: 'Delivered reel, story and feed edits for rollout.' },
    ],
    gallery: [motion[0], motion[1], motion[2]],
  },
  {
    id: 'festival',
    title: 'Festival Film Series',
    brand: 'Multiple Brands',
    category: 'Motion Design',
    year: '2026',
    type: 'video',
    cover: motion[3],
    description: 'A run of festive greeting films — Republic Day, Ram Navami & Maha Shivratri — each a small, self-contained moment.',
    overview: 'A series of short, emotive greeting films spanning Indian festivals. Each film balances cultural warmth with brand restraint — kinetic typography, subtle particles and music-timed cuts, kept elegant rather than loud.',
    role: 'Motion Designer',
    software: ['After Effects', 'Premiere Pro'],
    aiTools: ['ChatGPT', 'ElevenLabs', 'Freepik AI'],
    process: [
      { t: 'Direction', d: 'A shared motion language across festivals for brand consistency.' },
      { t: 'Animate', d: 'Type, particles and light animated to a musical beat.' },
      { t: 'Sound', d: 'AI voice & ambient beds layered for atmosphere.' },
      { t: 'Export', d: 'Optimised vertical + square deliverables.' },
    ],
    gallery: [motion[3], motion[4], motion[5]],
  },
  {
    id: 'composite',
    title: 'Surreal Composites',
    brand: 'Concept \u00b7 Personal',
    category: 'Photo Manipulation',
    year: '2024',
    type: 'image',
    cover: manip[0],
    description: 'Dreamlike composites where photography, light and imagination blend into impossible, cinematic scenes.',
    overview: 'A personal series exploring photo manipulation and matte-painting techniques. Multiple plates, hand-painted light and AI-assisted elements are blended into surreal, emotive frames — a playground for testing composition and mood.',
    role: 'Digital Artist & Retoucher',
    software: ['Photoshop', 'Adobe Bridge'],
    aiTools: ['ChatGPT', 'Freepik AI'],
    process: [
      { t: 'Collect', d: 'Sourced and shot plates with matching light direction.' },
      { t: 'Composite', d: 'Blended layers, masks and hand-painted light in Photoshop.' },
      { t: 'Grade', d: 'Unified colour and atmosphere for a cinematic finish.' },
    ],
    gallery: manip.slice(0, 8),
  },
  {
    id: 'frames',
    title: 'Frames of Kolkata',
    brand: 'Personal',
    category: 'Photography',
    year: '2023',
    type: 'image',
    cover: '/works/photography/photo-1.jpg',
    description: 'Street, low-light and fine-art photography — the city, its people and quiet in-between moments.',
    overview: 'An ongoing photographic study of Kolkata — from Victoria Memorial and Park Street to market labourers and low-light experiments. The series is about patience, light and finding stillness in a restless city.',
    role: 'Photographer',
    software: ['Lightroom', 'Photoshop'],
    aiTools: [],
    process: [
      { t: 'Shoot', d: 'Long walks, natural light, candid and long-exposure frames.' },
      { t: 'Curate', d: 'Edited down to the strongest, most honest moments.' },
      { t: 'Grade', d: 'Subtle, filmic colour treatment.' },
    ],
    gallery: photography,
  },
  {
    id: 'reels',
    title: 'Brand Reel Edits',
    brand: 'Wonderlust \u00b7 Aislinn \u00b7 Anaash',
    category: 'Video \u00b7 Social',
    year: '2025',
    type: 'video',
    cover: motion[6],
    description: 'Fast, rhythmic social reels for fashion, lifestyle and retail brands — built to stop the scroll.',
    overview: 'Short-form vertical edits for a range of fashion and lifestyle brands. The focus: punchy pacing, clean type and trend-aware transitions that still feel on-brand and premium.',
    role: 'Video Editor',
    software: ['Premiere Pro', 'After Effects'],
    aiTools: ['ChatGPT', 'Freepik AI'],
    process: [
      { t: 'Brief', d: 'Aligned on tone, hook and CTA per brand.' },
      { t: 'Edit', d: 'Beat-matched cuts, kinetic type and colour grade.' },
      { t: 'Publish', d: 'Optimised for Instagram & Facebook reels.' },
    ],
    gallery: [motion[6], motion[7], creatives[6], creatives[7]],
  },
]
