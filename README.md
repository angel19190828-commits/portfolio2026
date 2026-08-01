# Angel Yu Portfolio 2026

Personal portfolio site for Angel Yu, focused on interactive product case studies, motion-led web experiences, visual systems, and artwork.

The site is a static HTML/CSS/JavaScript portfolio. It is designed to run on GitHub Pages or any static host without a build step.

## Live Sections

- `index.html` - homepage with hero motion, featured work, artwork preview, and contact footer.
- `work/` - selected case studies and project index.
- `art/` - artwork gallery.
- `assets/` - shared portfolio images, stickers, posters, demo videos, and optimized artwork.
- `scripts/` - shared interaction scripts for the homepage and section-specific motion.
- `vendor/` - vendored browser libraries used by the site, including GSAP, ScrollTrigger, and Matter.js.
- `plugins/` - small reusable front-end modules, including the hero role loop.

## Featured Work

- Fableware Impact Engine - AI/product design prototype and impact summary experience.
- Trash Talk with Rumi - interactive waste-sorting installation case study.
- Baby Steps - AR and visual storytelling case study.
- FlyLens - AI-assisted travel product case study.
- AI Workflow - experimental AI-assisted web and motion design process.
- Artist Portfolio - external artwork and personal portfolio system.

## Running Locally

Because this is a static site, the simplest local preview is:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

If Python is unavailable, any static server works. Opening `index.html` directly may work for many pages, but a local server is safer for video, relative paths, and browser security behavior.

## Repository Map

```text
.
|-- index.html                  # Homepage
|-- styles.css                  # Shared global styles
|-- script.js                   # Shared site behavior
|-- art/                        # Artwork gallery page
|-- assets/                     # Shared media and optimized assets
|-- plugins/                    # Reusable front-end modules
|-- scripts/                    # Motion, i18n, and page interaction scripts
|-- vendor/                     # Vendored browser libraries
|-- work/                       # Project index and case studies
`-- .github/                    # GitHub collaboration templates
```

## Asset Notes

- Optimized `.web.mp4` files are used for live video playback where possible.
- Large source media archives are ignored when the live site already uses optimized proxies.
- Git LFS is configured for large video formats through `.gitattributes`.
- Local agent state such as `.claude/` is intentionally ignored and should not be committed.

## Git Hygiene

Before pushing, check:

```powershell
git status --short
git diff --stat
```

Do not commit local AI/editor state directories such as `.claude/`. For larger content updates, use a clean branch from the latest `origin/main` and open a pull request instead of pushing directly to `main`.

## Deployment

This repo is suitable for GitHub Pages. The `.nojekyll` file is included so folders and vendored assets are served as-is.