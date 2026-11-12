# Eternalz portfolio — sculptural folio

## Direction

This version keeps the palette the user liked and replaces the prior page format. The portfolio is composed as a personal folio: an image-led opening poster, long editorial story bands, an uneven skill triptych, a full-width Android project stage, a four-part experience route, and a broad contact desk. It is not an agency or SaaS template. Existing copy, order, project facts, routes, links, forms, and behavior remain locked.

## Palette — retained

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#F3F1E8` | Main reading canvas |
| Paper 2 | `#E8E9DF` | Alternating story surface |
| Evergreen ink | `#17251F` | Hero, skills and footer |
| Muted | `#59665E` | Supporting copy |
| Leaf | `#24543F` | Links and actions |
| Signal lime | `#D7F56A` | Contact field and small emphasis |
| Warm orange | `#E3784D` | Small punctuation and focus in light mode |

Dark mode keeps the same relationships with deeper green-black surfaces and pale type.

## Type and visuals

- **Barlow Condensed** carries the large name, section titles, project title, and closing call.
- **IBM Plex Sans** carries paragraphs, form labels, and controls.
- **IBM Plex Mono** carries the existing metadata and compact labels.
- `assets/workbench-sculpture.jpg` is a decorative, generated abstract sculpture for the hero. It contains no type, logo, UI, or factual claims. The HTML marks its containing field as decorative for assistive technology.
- The Shaikh's Android interface remains the existing HTML-drawn mockup, not a screenshot or invented product image.

## Composition

- The opening is a full-height poster: the existing name runs as one line across the lower part of an abstract sculpture, with the original introduction, links, and facts set into a lower information rail.
- About is an open sequence of full-width reading bands, not a chapter timeline. The existing quick facts become one horizontal facts strip. Gaming and Eternalz each get a distinct full-bleed ground.
- Skills become an asymmetric triptych while keeping the three original native, initially open `<details>` disclosures.
- The project mockup becomes a full-width stage; project description, Focus Mode explanation, metadata, actions, and links form a separate information spread below it.
- Experience is a four-column progression that stacks on smaller screens.
- Contact changes from a side-by-side pair into a full-width contact strip followed by a two-column form; the existing mail-draft validation and copy controls stay intact.
- Existing decorative section numbers remain visually hidden; the page does not use the rejected 01–05 section pattern.
- Small screens recompose the visual bands, stage, and form into a single readable sequence.

## Invariants

No age display, LinkedIn link, new facts, replacement wording, or new project claims. Keep the current GitHub profile URL, all existing routes and project links, all interaction behavior, and the plain “Built with HTML…” footer wording. `tests/content-lock.json` is the authority for text and content order across the home page and four release routes; run `python3 tests/check_content_lock.py` after edits.
