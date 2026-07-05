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
- Replace demo content inside the Vision Pro Spline scene (must be done in Spline editor by user; re-extract scene.splinecode)

## Update — HUD loader + cross-platform optimization (July 2025)
- Loader splash background replaced with user-uploaded HUD bionic-arm wallpaper: /public/loader/ has loader-bg-1900/-960 in WebP+JPEG, served via <picture>, preloaded high-priority from layout head; dark scrim + glass pills keep spinner/"Tap anywhere to skip" readable. Spline distortion still fades in on top on capable desktops.
- Optimizations: viewportFit cover + env(safe-area-inset-*) (nav, skip hint, hero arrow); 44px touch targets; tailwind future.hoverOnlyWhenSupported (iOS sticky hover); 16px inputs (iOS zoom); contact form id/label/autoComplete/inputMode; mobile shows video posters instead of autoplay mp4s (grid) and preload=none + controls in modal; spatial orb blur capped on mobile; 10 heavy JPGs recompressed (7.2MB→2.1MB); favicon app/icon.png + apple-icon.png generated; hero poster fixed (was 404); html/body overflow-x clip fix for mobile horizontal scroll (marquee).
- Frontend tested by testing agent: all pass incl. mobile 390px overflow retest. Production build passes.

## Update — Hero background swap to HUD image (July 2025)
- Hero no longer uses the Vision Pro Spline scene. Background is now the same HUD bionic-arm image as the loader (reuses /public/loader/ WebP+JPEG <picture>, cover/center), with counter-parallax translate + subtle 3D rotate driven by mouse position AND deviceorientation (gyroscope, Android/desktop; iOS may withhold events without permission — degrades to static). Glass panel tilt unchanged (same mx/my springs).
- Dark gradient + radial scrim over the image for text readability; tagline contrast bumped to fg/70.
- Loading screen untouched (only removed the invisible 30MB scene warm-fetch).
- Removed unused assets: /public/scenes/vision-pro.splinecode (30MB) and vision-pro-poster.jpg. Intro-distortion scene kept for the loader. To restore the 3D hero later, re-extract from https://my.spline.design/applevisionpro3dportfolioconcept-H1cXVDeIBhPqbNeliAxLVRWo/scene.splinecode.
- Production build passes.
