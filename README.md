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

## Deploy to hanhduywedding.online (GitHub Pages)

Everything lives in `docs/`, and `docs/CNAME` already contains the domain, so the
site is ready for **GitHub Pages**. One-time setup, then every update is a
`git push`.

### 1. Create your GitHub repo & push (one time)

```bash
# from this folder
git remote add origin git@github.com:anhduy0911/HanhDuyWedding.git
git push -u origin main
```

### 2. Turn on GitHub Pages (one time)

Repo → **Settings → Pages**:
- **Source:** Deploy from a branch
- **Branch:** `main`  ·  **Folder:** `/docs`  → Save
- Under **Custom domain** it should already show `hanhduywedding.online`
  (from `docs/CNAME`). Leave it, and tick **Enforce HTTPS** once it's available.

### 3. Point the domain's DNS (one time)

At your domain registrar for **hanhduywedding.online**, add:

| Type | Host / Name | Value |
|------|-------------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `anhduy0911.github.io` |

(Optional IPv6 — add AAAA `@` records: `2606:50c0:8000::153`, `…8001::153`,
`…8002::153`, `…8003::153`.)

Or import **`dns/hanhduywedding.online.zone`** all at once if your provider
supports zone-file import.

DNS can take from minutes up to ~24h. GitHub then issues the HTTPS certificate
automatically.

### Updating the site (every time)

```bash
git add -A
git commit -m "update wedding card"
git push
```

Pages redeploys within ~1 minute. (Hard-refresh / open in a private window if you
still see an old version — the browser may cache CSS/JS.)

> Prefer **Netlify** or **Cloudflare Pages** instead? Both also work: connect this
> repo, set the publish directory to `docs`, and add `hanhduywedding.online` as a
> custom domain (they handle apex + HTTPS for you). The `docs/CNAME` file is
> harmless there.

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
