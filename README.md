# Waquar Shaikh — Portfolio

A personal portfolio built with static HTML, CSS, and vanilla JavaScript. No framework, build step, or package manager is required.

**Live site:** https://eternalz.me
**Email:** waquarsk1@gmail.com

## Site contents

- `index.html` — hero, About, Skills, Projects, Experience, Contact, and footer.
- `css/style.css` — the portfolio design tokens, responsive layout, and component styling.
- `css/redirect.css` — shared styling for the four Android release redirect routes.
- `js/theme-init.js` and `js/main.js` — theme, navigation, scroll behavior, form validation, and small interactions.
- `js/redirect.js` — release redirect and footer-year behavior, loaded externally to satisfy the site CSP.
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
- Motion is limited to a short hero entrance, small state feedback, and the mobile menu transition; repeated scroll reveals, pointer tracking, magnetic movement, and parallax are intentionally absent.
- `python3 tests/check_content_lock.py` verifies the exact source-order text/accessibility/SEO baseline across the home page and four release routes.

## Design system — Sculptural folio

See [ART-DIRECTION.md](ART-DIRECTION.md) for the retained palette, typography, responsive compositions, and interaction constraints. The revised portfolio uses an image-led opening poster, full-width editorial story bands, an asymmetric skills triptych, a full-width Android project stage, and a broad contact desk. Existing copy, project details, routes, links, and behaviors are preserved.
