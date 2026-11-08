# Waquar Shaikh — Portfolio

A personal portfolio built with static HTML, CSS, and vanilla JavaScript. No framework, build step, or package manager is required.

**Live site:** https://eternalz.me
**Email:** waquarsk1@gmail.com

## Site contents

- `index.html` — hero, About, Skills, Projects, Experience, Contact, and footer.
- `css/style.css` and `css/redesign.css` — component behavior and the responsive world-builder's atlas design system.
- `css/shortlink.css` — the shared visual system for APK redirect pages.
- `js/theme-init.js` and `js/main.js` — theme, navigation, scroll behavior, form validation, and small interactions.
- `assets/og-image-v2.png` — the 1200 × 630 social sharing image used by Open Graph and Twitter cards.
- `assets/` — site icons and the featured project's visual assets.
- `download/`, `apk/`, `shaikhs/`, `projects/shaikhs/` — short links that redirect to the latest Shaikh's Android release.
- `_headers`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, and `CNAME` — deployment and site metadata.

## About the content

- **About** tells Waquar's story, including the path from Minecraft servers and plugins to bots, websites, automation, and AI-assisted development. It also explains what the name Eternalz means, without presenting it as an existing company.
- **Skills** covers AI and automation, web and frontend work, and configuration and setup.
- **Projects** features Shaikh's for Android. The download points to GitHub's latest-release URL, and the page describes Focus Mode as it is described in the release.
- **Experience** describes the learning path through personal projects. It does not claim employers, qualifications, or job titles.
- **Contact** lists the two supplied email addresses, Instagram, GitHub, and Discord. The message form validates the fields and opens a prefilled draft in the visitor's email app; it does not silently send or store messages.
- The site does not publish Waquar's age.

No profile placeholders remain. The contact form requires no hosted service or private key.

## Contact form behavior

Submitting the form opens a `mailto:` draft addressed to `waquarsk1@gmail.com`. The visitor reviews the draft and chooses whether to send it. If no email app is configured, use the email links shown on the page instead.

## Run locally

Serve the repository over HTTP so relative paths and security rules behave like production:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

This is a static site. On GitHub Pages, choose the deployment branch and `/ (root)` folder in **Settings → Pages**; use the branch currently configured for this repository unless you intentionally change the Pages source. The included `CNAME` is `eternalz.me`. GitHub Pages does not apply `_headers`, so the CSP meta tag in `index.html` remains important there.

For Netlify or Cloudflare Pages, publish the repository root without a build command. Those hosts can apply `_headers` as well.

## Engineering notes

- The only third-party requests are the Google Fonts stylesheet and its font files. UI icons use the inline SVG sprite in `index.html`.
- The Content Security Policy has no `unsafe-inline`. It permits the site's own scripts, Google Fonts, and the `mailto:` form fallback.
- Navigation supports keyboard use, Escape to close, and reduced-motion preferences. The mobile menu preserves the page's scroll position when it opens and closes.
- If JavaScript is disabled, the page content remains visible and the form retains its native `mailto:` fallback.

## Design system — World-builder's atlas

The portfolio is art-directed from the site's real origin in Minecraft server setup: deep obsidian, moss, sandstone, redstone orange, and signal green; block geometry, terrain grids, inventory-like facts, and a connected experience map. Chakra Petch carries the display type, IBM Plex Sans the reading text, and IBM Plex Mono short technical labels. The existing text, routes, navigation, and form behavior remain in place. `css/redesign.css` owns the homepage's complete composition; `css/shortlink.css` adapts its visual language to APK redirect pages.
