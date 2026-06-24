# Qiao Li Website Replica Notes

Source inspected: https://qiaooli.com/
Published source marker: Framer, published May 29, 2026.

## Implemented

- Fixed translucent header with brand mark, Gallery Modern font, home/work/art navigation, orange selected-state stars, and mobile menu.
- Hero layout with background portrait, Spline iframe, central "I AM A(N)" role loop, resume button, coordinate/school/location panels, skill pills, and scroll hint.
- Chrome-pass hero calibration: changed the central typography to the original Valky-style 64px Product / Designer composition, with smaller support copy and edge-aligned metadata.
- Chrome-pass work calibration: added the original-style featured work area with diagonal orbit text, centered 576x360 project preview, pill tags, title, date, and role metadata.
- Recording-pass calibration: sampled the provided 64s Chrome recording to match the homepage role-word cadence, rotating work carousel feel, art collage behavior, work index list, Grantx detail dark page, and art WIP page.
- Added local routes for `/work/`, `/work/grantx-marketing-website/`, and `/art/`.
- Opening cinematic transition using GSAP timeline.
- Framer-style appear animations: opacity, upward reveal, scale-in, stagger, and delayed Spline reveal.
- Continuous role-word loop and horizontal selected-work ticker.
- Scroll-linked parallax on the portrait and Spline layer via GSAP ScrollTrigger.
- Work list with large typographic rows, metadata, hover color shift, and cursor-following image preview.
- Art/glimpse section with original Framer-hosted image assets, asymmetric grid, and hover treatment.
- Back-to-top interaction and footer contact layout.
- Reduced-motion fallback and GSAP load fallback.

## Not One-to-One / Why

- Original source is a compiled Framer site. Class names and components are generated, and the original editable Framer project, component variants, and canvas constraints are not available from the public page.
- The original does not appear to use GSAP. It uses Framer/Motion runtime and `framer/appear` animation JSON. This replica uses GSAP to recreate equivalent motion language because the user explicitly requested GSAP behavior.
- The Spline scene is embedded as a third-party iframe. Its internal 3D objects, camera controls, shaders, and event handlers cannot be cloned from the host page. The replica embeds the same public Spline URL.
- Exact image loading behavior from Framer's responsive image pipeline is approximated by referencing the same Framer-hosted image URLs directly.
- Subpage content for `/work` and `/art` is not rebuilt here; this replica focuses on the supplied homepage URL and mirrors its visible homepage sections.
- Analytics scripts from Microsoft Clarity and PostHog were intentionally not copied because they are tracking integrations, not visual or interaction requirements.
- The second-pass calibration used Chrome remote debugging, not the private Framer/Spline editors. It improves observable layout and motion but still cannot recover hidden Framer component definitions.
- The local `/work/grantx-marketing-website/` page reproduces the visible structure and main assets from the public page, but does not rebuild every deeper image/metric section from the 9,571px original in full detail yet.
