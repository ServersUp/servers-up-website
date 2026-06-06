## ServersUp Website (GitHub Pages)

Premium single-page landing site for **ServersUp**.

### Stack

- Tailwind CSS (CDN) + minimal custom CSS
- Vanilla JS — game browser loads realms from `data/*.json`
- GitHub Pages with `.nojekyll`

### Local preview

```bash
python3 -m http.server 5173
```

Open `http://localhost:5173` (JSON fetch requires a local server).

### Data files

- `data/wow-servers.json` — WoW realm slugs by region
- `data/ffxiv-servers.json` — FFXIV world slugs by region
