// Real content sourced from Niloy Roy's CV + full curated portfolio assets.

export const profile = {
  name: 'Niloy Roy',
  firstName: 'Niloy',
  lastName: 'Roy',
  roles: ['AI Visual Designer', 'Creative Designer', 'Video Editor', 'Prompt Engineer'],
  tagline: 'Creative Graphic Designer & Video Editor crafting dynamic visuals across digital and print — now blending motion, light VFX and AI to elevate brand storytelling.',
  shortIntro:
    "I'm Niloy — a visual & motion designer with 5+ years turning brand narratives into cinematic visuals. I work across Adobe Creative Suite, DaVinci Resolve and a modern AI toolkit to desig[...]",
  location: 'Kolkata, India',
  email: 'niloyroy555@gmail.com',
  phone: '+91 7003664506',
  stats: [
    { value: 5, suffix: '+', label: 'Years experience' },
    { value: 25, suffix: '+', label: 'Brands worked with' },
    { value: 250, suffix: '+', label: 'Creatives shipped' },
    { value: 150, suffix: 'K+', label: 'Views on a single edit' },
  ],
  socials: [
    { label: 'LinkedIn', short: 'In', href: 'https://www.linkedin.com/in/niloy-roy-6770571b3/' },
    { label: 'Behance', short: 'Be', href: 'https://www.behance.net/niloyroy99' },
    { label: 'Instagram', short: 'Ig', href: 'https://www.instagram.com/niloyroy99/' },
    { label: 'Portfolio', short: 'Dr', href: 'https://drive.google.com/drive/folders/10YDLo5xkgaN8V2I2COgVx8KHETw6P7nd' },
  ],
}

export const brands = [
  'Tata Trusts', 'Senco Gold & Diamonds', 'AN Group', 'Nirmala Group', 'Zee Bangla',
  'ITC', 'Budweiser', 'Anaash Jewellery', 'Grandstreet', 'Aislinn',
  'Madhogarias Silver Art', 'Wonderlust Ink.', 'Premiers Tea', 'AVM Granite', 'Kalp Kids',
  'Indothai', 'Label YM', 'Sresth Products Pvt. Ltd.', 'Myrrah', 'Zee Cinema',
]

export const skills = {
  design: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Adobe Bridge'],
  motion: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Nuke', 'iClone', 'Silhouette', '3DEqualizer'],
  ai: ['ChatGPT', 'Google Gemini', 'ElevenLabs', 'Hailuo AI', 'Freepik AI', 'Higgsfield'],
}

export const experience = [
  { company: 'PR75K Media', role: 'Video Editor', period: 'May 2026 — Jul 2026', desc: 'Edited long-form technology content for YouTube in DaVinci Resolve — one video crossed 150K+ views[...]' },
  { company: 'Aspire Digital Media', role: 'Video / Photo Editor', period: 'Nov 2025 — May 2026', desc: 'Produced AI-driven assets using Higgsfield, ChatGPT & Gemini for multiple brands, coll[...]' },
  { company: 'Graphē', role: 'Video Editor & Graphic Designer', period: 'Aug 2025 — Oct 2025', desc: 'Developed creative assets and innovative social edits, leveraging ChatGPT, Gemini, E[...]' },
  { company: 'Wonderlust Ink.', role: 'Freelance Editor & Designer', period: 'Apr 2025 — Present', desc: "Creatives and reels for Wonderlust Ink's official Instagram and Facebook pages.", tag: 'cur' },
  { company: 'Swasti Ruia Consultancy', role: 'Freelance Editor & Designer', period: 'Oct 2024 — Apr 2025', desc: 'Creatives for Grandstreet shopping mall and reels for fashion brands Aislinn[...]' },
  { company: 'Law & Kenneth Saatchi & Saatchi', role: 'Account Executive Intern', period: 'Jun 2022 — Aug 2022', desc: 'Advertising campaigns for Zee Bangla & Zee Cinema; coordinated with cre[...]' },
  { company: 'Rediffusion Brand Solutions', role: 'Client Servicing Intern', period: 'Sep 2020 — Nov 2020', desc: 'Worked across Tata Trusts, Senco Gold & Diamonds and Ruchi Food Line — [...]' },
]

// ---- Full asset libraries (all extracted media) ----
const creatives = Array.from({ length: 131 }, (_, i) => `/works/creatives/creative-${i + 1}.jpg`)
const photography = Array.from({ length: 76 }, (_, i) => `/works/photography/photo-${i + 1}.jpg`)
const manip = Array.from({ length: 10 }, (_, i) => `/works/manipulation/manip-${i + 1}.jpg`)
const presentations = Array.from({ length: 17 }, (_, i) => `/works/presentations/pres-${i + 1}.jpg`)
const anfront = Array.from({ length: 4 }, (_, i) => `/works/motion/anfront-${i + 1}.mp4`)
const festival = Array.from({ length: 3 }, (_, i) => `/works/motion/festival-${i + 1}.mp4`)
const reels = Array.from({ length: 8 }, (_, i) => `/works/motion/reels-${i + 1}.mp4`)

export const projects = [
  {
    id: 'silver',
    title: 'Timeless Adornments',
    brand: 'Silver Art',
    category: 'Brand · Social Creatives',
    year: '2026',
    type: 'image',
    cover: creatives[16],
    description: 'Every project begins with understanding the story behind the product rather than simply showcasing it. This campaign focused on crafting a refined visual language through intenti[...]',
    overview: 'Every project begins with understanding the story behind the product rather than simply showcasing it. This campaign focused on crafting a refined visual language through intentiona[...]',
    role: 'Visual Designer & Art Director',
    software: ['Photoshop', 'Illustrator', 'InDesign'],
    aiTools: ['higgsfield', 'ChatGPT', 'Google Gemini'],
    process: [
      { t: 'Concept', d: 'Defined an emotive, gift-led narrative and a minimal editorial art direction.' },
      { t: 'Design', d: 'Crafted a scalable template system across product, lifestyle and copy-led frames.' },
      { t: 'AI Assist', d: 'Used generative tools to explore backgrounds and speed up variant production.' },
      { t: 'Delivery', d: 'Shipped a consistent monthly grid across Instagram & Facebook.' },
    ],
    gallery: creatives.slice(0, 65),
  },
  {
    id: 'anfront',
    title: 'Visual Storytelling',
    brand: 'AN Group',
    category: 'AI Visual Design',
    year: '2026',
    type: 'video',
    cover: anfront[0],
    description: 'An end-to-end creative exploration spanning concept development, visual design, motion graphics, editing, and AI-assisted production. The project focuses on transforming ideas in[...]',
    overview: 'An end-to-end creative exploration spanning concept development, visual design, motion graphics, editing, and AI-assisted production. The project focuses on transforming ideas into [...]',
    role: 'Motion Designer & Editor',
    software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    aiTools: ['Higgsfield', 'Hailuo AI', 'Freepik AI'],
    process: [
      { t: 'Storyboard', d: 'Mapped a teaser → reveal narrative around a single colour mood.' },
      { t: 'Motion', d: 'Animated fluid transitions, light leaks and kinetic type in After Effects.' },
      { t: 'Grade', d: 'Colour-graded for a soft, oceanic, premium feel in DaVinci Resolve.' },
      { t: 'Cutdowns', d: 'Delivered reel, story and feed edits for rollout.' },
    ],
    gallery: anfront,
  },
  {
    id: 'campaigns',
    title: 'Retail, Lifestyle & Festive',
    brand: 'Multiple Brands',
    category: 'Brand · Social Creatives',
    year: '2025',
    type: 'image',
    cover: creatives[67],
    description: 'A broad run of social creatives for retail, real-estate and lifestyle brands — festive greetings, launches and always-on content.',
    overview: 'An always-on creative stream across a range of clients — Grandstreet, Aislinn, AN Group, Nirmala Group and more. The work spans festive greetings, product launches and campaig[...]',
    role: 'Graphic Designer',
    software: ['Photoshop', 'Illustrator', 'InDesign'],
    aiTools: ['Freepik AI', 'ChatGPT', 'Google Gemini'],
    process: [
      { t: 'Brief', d: 'Aligned each brand on tone, occasion and message.' },
      { t: 'System', d: 'Built reusable layouts for speed and consistency.' },
      { t: 'Craft', d: 'Polished type, colour and composition on every frame.' },
      { t: 'Ship', d: 'Delivered a steady, on-brand social cadence.' },
    ],
    gallery: creatives.slice(65),
  },
  {
    id: 'composite',
    title: 'Surreal Composites',
    brand: 'Concept · Personal',
    category: 'Photo Manipulation',
    year: '2024',
    type: 'image',
    cover: manip[0],
    description: 'Dreamlike composites where photography, light and imagination blend into impossible, cinematic scenes.',
    overview: 'A personal series exploring photo manipulation and matte-painting techniques. Multiple plates, hand-painted light and AI-assisted elements are blended into surreal, emotive frames [...]',
    role: 'Digital Artist & Retoucher',
    software: ['Photoshop', 'Adobe Bridge'],
    aiTools: ['ChatGPT', 'Freepik AI'],
    process: [
      { t: 'Collect', d: 'Sourced and shot plates with matching light direction.' },
      { t: 'Composite', d: 'Blended layers, masks and hand-painted light in Photoshop.' },
      { t: 'Grade', d: 'Unified colour and atmosphere for a cinematic finish.' },
    ],
    gallery: manip,
  },
  {
    id: 'reels',
    title: 'Social Reels & Edits',
    brand: 'Wonderlust · Aislinn · Anaash',
    category: 'Video · Social',
    year: '2025',
    type: 'video',
    cover: reels[0],
    description: 'Fast, rhythmic social reels for fashion, lifestyle and retail brands — built to stop the scroll. A collection spanning festival films and short-form vertical edits.',
    overview: 'Short-form vertical edits for a range of fashion and lifestyle brands, combined with emotive festival greeting films. The focus: punchy pacing, kinetic type and trend-aware transitions that still feel on-brand and premium.',
    role: 'Video Editor & Motion Designer',
    software: ['Premiere Pro', 'After Effects'],
    aiTools: ['ChatGPT', 'ElevenLabs', 'Freepik AI'],
    process: [
      { t: 'Brief', d: 'Aligned on tone, hook and CTA per brand.' },
      { t: 'Edit & Motion', d: 'Beat-matched cuts, kinetic type, colour grade and festival animations.' },
      { t: 'Publish', d: 'Optimised for Instagram, Facebook reels and festival deliverables.' },
    ],
    gallery: reels.concat(festival),
  },
  {
    id: 'frames',
    title: 'Frames of Kolkata',
    brand: 'Personal',
    category: 'Photography',
    year: '2023',
    type: 'image',
    cover: photography[0],
    description: 'Street, low-light and fine-art photography — the city, its people and quiet in-between moments.',
    overview: 'An ongoing photographic study of Kolkata — from Victoria Memorial and Park Street to market labourers and low-light experiments. The series is about patience, light and findin[...]',
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
]
