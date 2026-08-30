# Burgundy Wedding Invitation

A modern, artistic single-page online wedding card — a vertical scroll
"invitation card" inspired by [yenstudio](https://yenstudio.com.vn/ninh-hong/thiepmoi.html),
dressed in a **burgundy · cream · champagne-gold** palette.

Pure static site — no build step, no frameworks. Just HTML, CSS and vanilla JS.

## Run it locally

```bash
# option A (Node)
npm start          # → http://localhost:8000

# option B (Python, no install)
npm run dev        # → http://localhost:8000
# or directly:
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000.

## Deploy

Everything lives in `docs/`, so it works out-of-the-box with **GitHub Pages**
(set Pages source to `/docs`), Netlify, Vercel, or any static host — just upload
the `docs/` folder.

## Sections

Hero → Save the Date (+ live countdown) → Wedding Details → Bride & Groom →
Photo Album (click to open lightbox) → Our Day (itinerary) → RSVP → Venue map →
Footer. Plus a floating **music toggle** (`docs/mus.mp3`) and back-to-top button.

## How to personalise

| What | Where |
|------|-------|
| Names, tagline, dates, all copy | `docs/index.html` (plain text — search & replace) |
| Wedding date used by the **countdown** & footer year | `CONFIG.weddingDate` in `docs/scripts/wedding.js` |
| **RSVP** destination email (opens guest's mail app) | `CONFIG.rsvpEmail` in `docs/scripts/wedding.js` |
| Photos | drop your files in `docs/images/` and update the `src`/`href` in `index.html` |
| Colors & fonts | CSS variables at the top of `docs/styles/wedding.css` (`--burgundy`, `--cream`, `--gold`, `--serif`, `--script`, …) |
| Venue map | the `<iframe>` and the two map links in the **Location** section of `index.html` |

> The RSVP form is front-end only: on submit it opens the guest's email client
> with a pre-filled message to `CONFIG.rsvpEmail`. For collecting responses in a
> spreadsheet instead, point the `<form>` at a service like Formspree or a Google
> Form (see `scripts/wedding.js`).

## Fonts used

Playfair Display (display serif) and EB Garamond (body serif) — both with full
Vietnamese diacritics — plus Pinyon Script / Great Vibes (script) and Jost
(labels), loaded from Google Fonts. Icons from Font Awesome 6.
