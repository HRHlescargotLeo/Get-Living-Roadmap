# Get Living — greyscale prototypes (V1.2)

Five clickable, greyscale prototypes for improvements to getliving.com, prepared by ClerksWell
following the phase 1 review (28 September 2026). Structure and behaviour only; the visual
design layer (Get Living's colours, type and imagery) comes next and goes in `src/css/theme.css`.

## View
Live: https://hrhlescargotleo.github.io/Get-Living-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages is set to publish from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Prototypes
1. Find a home — `pages/find-a-home.html`
2. Property page — `pages/home.html` (opens any home via `?home=<id>`)
3. Book a viewing — `pages/book-a-viewing.html`, plus the short enquiry at `pages/enquiry.html`
4. Renting with us — `pages/renting-with-us.html`
5. Neighbourhood template — `pages/neighbourhood.html` (Sherlock Quarter)

Module library: `modules/library.html`. Requirements: `requirements/requirements.md`.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it). The prototype navigator (top bar with the Notes switch) and the previous/next footer live in `src/includes/`.
Listings are sample data in `src/js/data.js`.

## Status
V1.2, internal review. Get Living's own header and footer are replaced by a prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each prototype proposes and why, plus in-page annotations.
