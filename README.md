## ServersUp Website (GitHub Pages)

Premium single-page landing site for **ServersUp**.

### Stack

- Self-contained CSS (no Tailwind CDN — works via `file://` and GitHub Pages)
- Vanilla JS — game browser uses `data/games-data.js` locally, fetches JSON when served over HTTP
- GitHub Pages with `.nojekyll`

### Local preview

Open `index.html` directly in a browser, or run a static server:

```bash
python3 -m http.server 5173
```

### Data files

- `data/wow-servers.json` — WoW realm slugs by region
- `data/ffxiv-servers.json` — FFXIV world slugs by region
