# Niloy Roy Portfolio — Vision Pro Spatial Redesign

## Source
Imported from GitHub repo niloyroy555-ship-it/Niloy-Roy-Portfolio, branch `stble` (previous cinematic monochrome build). All content preserved: bio, 7 projects, brands, skills, experience, media in /public/works.

## What was built (July 2025)
Apple Vision Pro–inspired spatial 3D redesign:

1. **Intro splash** (`components/site/intro-splash.js`): user's Spline "distorting intro" scene, extracted locally to `/public/scenes/intro-distortion.splinecode` (111KB). Plays once per session (sessionStorage `nr_intro_seen`), tap-anywhere skip, 2.8s post-load play timer + 7s hard cap, framer-motion blur/scale crossfade exit. Low-power/mobile devices get a CSS gradient distortion fallback (1.8s). Warm-fetches the hero scene during play.
2. **Hero** (`components/site/hero.js`): user's Vision Pro Spline scene, extracted to `/public/scenes/vision-pro.splinecode` (30MB), lazy-mounted after intro reveals; poster fallback `/public/scenes/vision-pro-poster.jpg` (generated screenshot) shown while loading and permanently on mobile/low-power. Floating glass overlay panel: name, morphing role, tagline, "View My Work" + "Contact Me" CTAs, cursor tilt parallax.
3. **Spatial background** (`components/site/spatial-background.js`): fixed layered blue/violet/silver orbs, 3 depth layers, mouse + scroll parallax, noise texture.
4. **Glassmorphism system** (`globals.css` + `tailwind.config.js`): `.glass-panel/.glass-card/.glass-chip` utilities with CSS-var tokens (`--fg`, `--base`, orb colors), dark default + `.light` overrides, reduced blur on mobile, Inter/SF-style typography, `text-gradient` blue→violet accent.
5. **Theme**: next-themes, attribute="class", defaultTheme="dark", Sun/Moon toggle in nav.
6. **Restyled sections**: nav (glass pill), marquee (glass strip), portfolio grid (glass cards + tilt), about (floating portrait + stats chips), skills (#skills glass panel badges), timeline (glass cards), contact (glass form), footer (glass bar), project modal (glass).

## Backend (unchanged logic)
- Email-only contact API: POST /api/contact via Resend → niloyroy555@gmail.com. RESEND_API_KEY (user-provided) in /app/.env. No MongoDB usage.
- Regression tested: all 6 tests pass, emailed:true.

## Key technical notes
- `@splinetool/react-spline` v4 exports map lacks "default" condition → webpack alias in next.config.js points to dist file directly. `transpilePackages` also set. Production `next build` verified passing.
- Spline scenes served locally (no watermark iframe, faster, offline-safe).
- Vision Pro scene contains the Spline template author's demo content ("Zeno Degenkamp" panels) — user may want to customize the scene in Spline and re-export.

## Not done / possible next steps
- Frontend automated testing (awaiting user permission)
- Replace demo content inside the Vision Pro Spline scene (must be done in Spline editor by user; re-extract scene.splinecode)
