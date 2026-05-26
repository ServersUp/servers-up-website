## ServersUp Website (GitHub Pages)

Minimal one-page marketing site for **ServersUp** (GitHub Pages).

### What’s Included

- Smooth-scroll navbar with mobile menu
- Hero section with “Add to Discord” CTA
- How It Works (two mini diagrams)
- Instructions section for Discord setup + `/subscribe` (game → region → server)
- Supported Games section:
  - World of Warcraft **(wow)** with US/EU/KR/TW region tabs and searchable realm list (realms in `index.html`; `data/wow-servers.json` is the canonical name list when updating)

### `script.js`

Small client-side helpers for the static site (no build step):

- **Footer year** — sets the copyright year automatically
- **Mobile nav** — open/close menu, Escape and outside-click to dismiss
- **Smooth scroll** — in-page anchor links offset for the fixed header
- **External links** — ensures `rel="noreferrer"` on `target="_blank"` links
- **WoW realm browser** — US/EU/KR/TW tab switching, search filter, and visible/total count over the lists already in `index.html`

### `data/wow-servers.json`

Sorted realm slugs per region (`us`, `eu`, `kr`, `tw`). Use this when adding or checking realms; the Supported Games section renders the same names inline in HTML for fast load (no fetch).
- Ko-fi support section
  - Link: `https://ko-fi.com/R6R71Z1SRN`

### Local preview

- Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

