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
│   ├── favicon.svg     Ember-tile monogram (scales to any size)
│   ├── favicon-32.png  Raster fallback for older browsers
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png   PWA / manifest icons
│   ├── og-image.png    1200×630 Open Graph card, set in Geist
│   └── project-1|2|3.svg   Abstract plates for the three project entries
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
  consistency, a **Gaming & tinkering** subsection that carries the Minecraft
  and server/plugin/permissions part separately from the developer story, and a
  closing **Eternalz** subsection explaining the brand name: a name for
  everything you build, drawn as a ladder of what exists (solid) and what does
  not exist yet (hollow and dashed) — Eternalz, Eternalz Studios, Eternalz Tech.
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
| `[FOOTER_TAGLINE]` | Footer |
| `[GITHUB_PROFILE_URL]`, `[GITHUB_HANDLE]`, `[LINKEDIN_PROFILE_URL]`, `[LINKEDIN_HANDLE]` | Contact, footer, structured data |
| `[FORMSPREE_ACTION_ID]` | Contact form `action` (see below) |

Once those are in, there is nothing else left to fill in.

**Two things left out on purpose.** You described yourself as a 15-year-old tech
enthusiast; that detail is *not* on the page. There is a marked comment in the
About section where it would go — tell me and it goes in, or leave it out if you
would rather not publish your age, which is a perfectly sensible choice.

Nothing about your work history has been invented. **Projects** and
**Experience** hold no entries at all — each is a single "coming soon" band
(the mono `COMING SOON` marker beside the section label), so they read as
deliberate rather than unfinished. Both keep their section id, their numbering
and their place in the navigation, so real entries can drop straight in later.

**Skills** are three areas named as plainly as they could be — *AI & Automation*,
*Web & Frontend*, *Configuration & Setup*. These were phrased from the areas you
gave me and the vocabulary already in your About text; every line is a one-word
edit if something reads wrong.

Location shows as **Maharashtra, India** (state level, not a city) in the hero,
the About quick-facts list and the structured data. Availability reads
**"Available for opportunities"** in the hero and the quick-facts list — tell me
if you would rather say something more specific, such as "open to
collaborations", "open to freelance work" or "just here to learn".

`assets/project-1.svg`, `project-2.svg` and `project-3.svg` are the abstract
plates in the projects band. They are deliberately labelled "Plate 01/02/03"
rather than pretending to be finished work — swap them for real screenshots at
1200×750 when the projects are written up, keeping the `width`/`height`
attributes so the layout does not shift while loading. The plate frames tilt and
raise a "Coming soon" bar on hover, so they work as either.

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

- **No dependencies.** The only external request is the Geist / Geist Mono
  webfont from Google Fonts. Everything else — icons included — is inline SVG in
  one sprite at the bottom of `index.html`, so there are no icon fonts or image
  requests for UI chrome.
- **Security.** Strict CSP with no `unsafe-inline`: there is not one inline
  `<script>`, `<style>` or `style` attribute on the page. External links use
  `rel="noopener noreferrer"`. `frame-ancestors` lives in `_headers` only,
  because browsers ignore it in a `<meta>` tag.
- **Accessibility.** Semantic landmarks, a skip link, visible focus rings,
  `aria-expanded`/`aria-controls` on the menu, a focus trap and Escape-to-close
  in the mobile panel, `aria-current` scroll-spy highlighting, `aria-live`
  form status, and labels tied to every input. Every text element is verified at
  or above WCAG AA in both themes (lowest measured: 4.53:1), input boundaries
  clear the 3:1 non-text requirement in both directions, and the dark footer
  swaps in its own focus-ring colour. See *Design system* below for how the
  accent is split between decorative and text use.
- **Motion.** A short, section-level scroll reveal, gentle hover states and
  smooth scrolling only. Nothing animates item by item, no animation delays
  access to content, and all of it is disabled under
  `prefers-reduced-motion: reduce`.
- **No-JavaScript fallback.** `<html>` is only flagged `.js` by the theme
  script, so with scripting disabled nothing is hidden, and the contact form
  falls back to a normal POST.
- **Age and privacy.** No personal details were invented or inferred. There are
  no dates, employers or qualifications on the page at all: Projects and
  Experience are explicitly marked as coming soon, and the four remaining
  placeholders are all external identifiers you have not sent yet.
- **Theming.** The paper theme is the identity and the default; the ink theme
  follows `prefers-color-scheme` and the visitor's explicit choice is remembered
  in `localStorage`. Because the toggle only ever records a preference, the page
  stays correct if storage is blocked.

---

## Design system — "Signal & Grain"

The page is art-directed like a printed object: warm bone paper, deep ink, one
hot ember accent, an acid highlight used only as a spark, and a film-grain
texture over everything. Type is the loudest thing on the page; colour is the
second loudest. Motion responds to the pointer and to scroll.

Everything is defined once in `:root` and re-pointed for the ink theme. The two
loud bands are token scopes: `.section--ink` and `.section--ember` each redefine
`--fg`, `--muted`, `--line`, `--accent-text` and `--ghost-line`, so every
component inside them flips automatically — in the ink theme the skills band
inverts to bone-on-black, so the page keeps its rhythm whichever theme you land
in.

| Token | Paper theme | Ink theme |
| --- | --- | --- |
| `--bg` | `#efe9dc` | `#0f0f0c` |
| `--fg` | `#15140f` | `#f3efe6` |
| `--muted` | `#665f53` | `#a6a294` |
| `--card` | `#f7f3ea` | `#1b1a14` |
| `--accent` (ember) | `#f04e23` | `#ff6b3d` |
| `--accent-text` | `#ae3510` | `#ff6b3d` |
| `--acid` | `#d4f04a` | `#d4f04a` |

**Why the accent splits in two.** `#F04E23` is the brand colour, but as text on
the bone ground it only reaches 2.98:1. It therefore stays the decorative colour
(rules, wipes, fills, the marquee) while `--accent-text` carries links, indices
and status text at 5.23:1. On the ember band the relationship flips: ink on
ember is 5.11:1.

**Type.** Geist for everything structural, Geist Mono for labels and numerals,
Instrument Serif italic for the two editorial registers — inline emphasis in the
hero subtitle and the "Lets Connect!" footer headline. Hero display is 152px at
desktop, `clamp()` all the way down.

**Interactions** (all of them additive, and all switched off for a coarse
pointer or `prefers-reduced-motion`):

- hero spotlight and a dot grid that counter-drifts with the pointer
- words in the intro that fill with ember on hover
- magnetic buttons that lean a few pixels toward the cursor
- project plates that tilt toward the pointer, with a cursor chip and a status
  bar that rises out of the plate edge on hover
- skill panels that flood with ember and step their list in on hover or
  keyboard focus
- a sliding nav indicator that follows hover and scroll
- a reading-progress bar, ghost numerals that drift against the scroll, and a
  marquee band whose colour comes from the page's own copy
- a full-screen clip-path navigation overlay with staggered links on mobile

All of it is measured at 60fps-friendly cost: transforms and opacity only, one
`requestAnimationFrame` per gesture, and a single scroll listener.

**Layout.** 1240px content column, an 8px spacing scale, fluid `clamp()` rhythm,
and composition breakpoints at 480 / 600 / 768 / 900 / 1120px.

