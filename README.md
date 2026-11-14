# Savvy Signature · Homepage redesign (sections 1 to 3)

Two design directions for the first three sections of savvysignatureindia.com, with a
switch at the bottom of the page to flip between them.

- **A · Growth Engine** — calm and technical. Schibsted Grotesk + Hanken Grotesk + JetBrains Mono,
  line-art isometric illustration, dark Savvy Software band, one accent (#285771).
- **B · Editorial** — Newsreader serif headlines with italic teal emphasis, Geist + Geist Mono,
  animated multicolour light-ray hero with grain, hairline grids, six-colour graphic palette.

Copy and brand assets are Savvy Signature's own. Design tokens mirror the Figma variables 1:1
(`src/styles/tokens.css`).

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build into dist/ (fetches partner badges + logo mark first)
npm run preview    # serve the production build
```

## Switching variants

- The pill at the bottom of the page, or **Alt + A / Alt + B**.
- Deep links: `/?v=a` or `/?v=b`. The last choice is remembered per browser.

## Deploy to Vercel

```bash
npx vercel          # first time: sign in, accept the defaults (framework: Vite)
npx vercel --prod   # production deploy
```

`vercel.json` already sets the build command and `dist` output. The prebuild step downloads
Savvy's partner badges and logo mark from savvysignatureindia.com; if that site is unreachable
the build still succeeds and the badges show as text labels.

## Hero video (Variant B)

The hero uses a CSS light-ray animation by default. To use the Magnific video loop instead,
put `hero-rays.mp4` (and optionally `hero-rays.webm`) in `public/media/`. It is picked up
automatically, autoplays muted and loops, pauses off screen, and is skipped for people who
prefer reduced motion.

## Structure

```
index.html                     both variants' markup + menu sheet + variant switch
src/main.js                    variant switch, menu, dropdown, toggle, reveals, count-ups
src/components/dashboard.js    Savvy Software dashboard (shared, tabs work)
src/components/iso-illustration.js  Variant A isometric scene (inline SVG)
src/styles/tokens.css          A + B tokens, Dark mode, responsive modes
src/styles/variant-a.css       Variant A
src/styles/variant-b.css       Variant B
src/styles/dashboard.css       dashboard component
scripts/fetch-brand.mjs        downloads Savvy's own badges before build
public/brand/clients/          client logos (Kikai Learn shows as a wordmark until its file is added)
```

## Accessibility & motion

Keyboard reachable throughout (visible focus rings, arrow keys on tabs and the toggle, Escape
closes the menu and dropdown). Everything respects `prefers-reduced-motion`.
