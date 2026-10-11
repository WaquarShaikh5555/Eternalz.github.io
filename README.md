# Waquar Shaikh — Portfolio

A fast, accessible, dependency-free personal portfolio for **Waquar Shaikh**.
Static HTML5, CSS3 and vanilla JavaScript — there is no build step, no framework
and no package manager, so the repository deploys exactly as it sits.

**Live:** https://eternalz.me · **Contact:** waquarsk1@gmail.com

---

## What's in here

```
.
├── index.html          Single page: hero, about, skills, projects, experience, contact
├── css/
│   └── style.css       Design tokens, layout, components (one stylesheet, commented)
├── js/
│   ├── theme-init.js   Pre-paint colour-scheme switch (blocking, ~20 lines)
│   └── main.js         Menu, scroll spy, reveal, smooth scroll, form validation
├── assets/
│   ├── favicon.svg     Indigo→violet monogram (scales to any size)
│   ├── favicon-32.png  Raster fallback for older browsers
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png   PWA / manifest icons
│   ├── og-image.png    1200×630 Open Graph card
│   └── project-1|2|3.svg   Abstract cover art for the three project cards
├── _headers            Netlify / Cloudflare Pages security + cache headers
├── site.webmanifest    PWA metadata
├── robots.txt
├── sitemap.xml
└── CNAME               Custom domain for GitHub Pages (eternalz.me)
```

## What is filled in

Your real content is live in these places:

- **Hero** — name, tagline ("AI, software development, web and automation"), intro
  paragraph, and quick facts: exploring tech since 2020, Maharashtra (India), email,
  and availability.
- **About** — the full story in four parts (where it started, from curiosity to
  craft, where you are today, what is ahead), the closing note about curiosity and
  consistency, and a **Gaming & tinkering** card that carries the Minecraft and
  server/plugin/permissions part separately from the developer story.
- **Contact** — both addresses (`waquarsk1@gmail.com`, `waquarsk2@gmail.com`),
  Instagram (`@waquarsk1`), and a Discord row that copies `waquar5555` to the
  clipboard, since Discord has no public profile URL.
- **Footer** — Instagram, Discord copy button and email alongside the icon links.
- **SEO** — description, Open Graph copy, the social card image, and the
  `Person` structured data now include the Instagram URL and the address region.

## Before you publish

Remaining placeholders, all marked in `index.html`. Search for `[` and replace:

| Placeholder | Where |
| --- | --- |
| `[SKILLS_INTRO_TEXT]`, `[SKILL_GROUP_1..3_TITLE/DESCRIPTION]`, `[SKILL_1_1]` … | Skills |
| `[PROJECTS_INTRO_TEXT]`, `[PROJECT_1..3_TITLE/DESCRIPTION]`, `[TAG]` | Projects |
| `[EXPERIENCE_INTRO_TEXT]`, `[ROLE_TITLE_1..3]`, `[COMPANY_OR_ORGANISATION_1..3]`, `[WORK_TYPE_1..3]`, `[START_DATE]`, `[END_DATE]`, `[EDUCATION_QUALIFICATION]`, `[INSTITUTION_NAME]`, `[EDUCATION_TYPE]`, `[EDUCATION_DESCRIPTION]` | Experience |
| `[FOOTER_TAGLINE]` | Footer |
| `[GITHUB_PROFILE_URL]`, `[GITHUB_HANDLE]`, `[LINKEDIN_PROFILE_URL]`, `[LINKEDIN_HANDLE]` | Contact, footer, structured data |
| `[FORMSPREE_ACTION_ID]` | Contact form `action` (see below) |

**Two things left out on purpose.** You described yourself as a 15-year-old tech
enthusiast; that detail is *not* on the page. There is a marked comment in the
About section where it would go — tell me and it goes in, or leave it out if you
would rather not publish your age, which is a perfectly sensible choice. The
Skills, Projects and Experience sections still hold neutral placeholders because
you have not sent that content yet; nothing about your work history has been
invented.

Location shows as **Maharashtra, India** (state level, not a city) in the hero,
the About quick-facts list and the structured data. Availability reads
**"Available for opportunities"** in the hero and the quick-facts list — tell me
if you would rather say something more specific, such as "open to
collaborations", "open to freelance work" or "just here to learn".

Project covers are abstract SVG placeholders — swap in real screenshots at
1200×750 if you prefer, keeping the `width`/`height` attributes so the layout
does not shift while loading.

### Connecting the contact form

1. Create a form at [formspree.io](https://formspree.io) and copy its id.
2. In `index.html`, replace `[FORMSPREE_ACTION_ID]` in the form's `action`
   attribute: `https://formspree.io/f/yourid`.
3. If you use a different service, add its origin to `form-action` and
   `connect-src` in **both** `_headers` and the CSP `<meta>` tag in
   `index.html`.

Until then the form validates normally and shows a friendly "not wired up yet"
message instead of silently posting nowhere. It includes a `_gotcha` honeypot
field and no secrets — the endpoint id is public by design.

## Run it locally

No tooling required; serve the folder over HTTP so the CSP and relative paths
behave exactly as in production:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

### GitHub Pages

1. Push to the `main` branch of `WaquarShaikh5555/Eternalz.github.io`.
2. **Settings → Pages → Source:** deploy from branch `main`, folder `/ (root)`.
3. The included `CNAME` sets the custom domain to `eternalz.me`. Point the
   domain's DNS at GitHub Pages and enable **Enforce HTTPS**.
4. `_headers` is *not* read by GitHub Pages, so the CSP `<meta>` tag in
   `index.html` is what protects the site there.

### Netlify

1. **Add new site → Import an existing project**, pick this repository, leave
   the build command empty and the publish directory as `/`.
2. `_headers` applies the full header set (CSP with `frame-ancestors`,
   HSTS, `X-Frame-Options`, caching).

### Cloudflare Pages / Vercel

Same story: no build command, output directory `.`. Cloudflare Pages honours
`_headers`; on Vercel convert the contents of `_headers` into a `vercel.json`
`headers` array or a `next.config` rule.

---

## Engineering notes

- **No dependencies.** The only external request is the Inter webfont from
  Google Fonts. Everything else — icons included — is inline SVG in one sprite
  at the bottom of `index.html`, so there are no icon fonts or image requests
  for UI chrome.
- **Security.** Strict CSP with no `unsafe-inline`: there is not one inline
  `<script>`, `<style>` or `style` attribute on the page. External links use
  `rel="noopener noreferrer"`. `frame-ancestors` lives in `_headers` only,
  because browsers ignore it in a `<meta>` tag.
- **Accessibility.** Semantic landmarks, a skip link, visible focus rings,
  `aria-expanded`/`aria-controls` on the menu, a focus trap and Escape-to-close
  in the mobile panel, `aria-current` scroll-spy highlighting, `aria-live`
  form status, and labels tied to every input. Text meets WCAG AA contrast in
  both themes; the primary button uses a slightly darker indigo→violet ramp
  than the decorative one specifically so white label text stays above 4.5:1.
- **Motion.** Scroll reveal, hover lift and smooth scrolling only — all of it
  disabled under `prefers-reduced-motion: reduce`.
- **No-JavaScript fallback.** `<html>` is only flagged `.js` by the theme
  script, so with scripting disabled nothing is hidden, and the contact form
  falls back to a normal POST.
- **Age and privacy.** No personal details were invented or inferred: dates,
  employers, qualifications and handles are all still explicit placeholders.
- **Theming.** Dark by default, follows `prefers-color-scheme`, and the visitor's
  explicit choice is remembered in `localStorage`. Because the toggle only ever
  records a preference, the page stays correct if storage is blocked.
