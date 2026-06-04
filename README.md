## ServersUp Website (GitHub Pages)

Minimal one-page marketing site for **ServersUp** (GitHub Pages).

### What’s Included

- Smooth-scroll navbar with mobile menu
- Hero section with “Add to Discord” CTA
- How It Works (two mini diagrams)
- Instructions section for Discord setup + `/subscribe` (game → region → server)
- Supported Games section:
  - World of Warcraft **(wow)** — US/EU/KR/TW region tabs and searchable realm list (`data/wow-servers.json`)
  - Final Fantasy XIV **(ffxiv)** — NA/EU/JP/OCE region tabs and searchable world list (`data/ffxiv-servers.json`)

### `script.js`

Small client-side helpers for the static site (no build step):

- **Footer year** — sets the copyright year automatically
- **Mobile nav** — open/close menu, Escape and outside-click to dismiss
- **Smooth scroll** — in-page anchor links offset for the fixed header
- **External links** — ensures `rel="noreferrer"` on `target="_blank"` links
- **Game realm/world browsers** — region tab switching, search filter, and visible/total count over the lists in `index.html` (WoW and FFXIV)

### `data/*.json`

- **`wow-servers.json`** — realm slugs per region (`us`, `eu`, `kr`, `tw`)
- **`ffxiv-servers.json`** — world slugs per region (`na`, `eu`, `jp`, `oce`)

Use these when adding or checking servers; Supported Games renders the same names inline in HTML for fast load (no fetch).
- Ko-fi support section
  - Link: `https://ko-fi.com/R6R71Z1SRN`

### Local preview

- Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

