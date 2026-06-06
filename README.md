## ServersUp Website (GitHub Pages)

Plain documentation-style page for the **ServersUp** Discord bot.

### Stack

- Self-contained CSS (white background, document layout)
- Vanilla JS with `data/games-data.js` for local `file://` preview
- GitHub Pages with `.nojekyll`

### Local preview

Open `index.html` directly, or:

```bash
python3 -m http.server 5173
```

### Data

- `data/wow-servers.json` and `data/ffxiv-servers.json` — source lists
- `data/games-data.js` — bundled for offline preview (regenerate when JSON changes)
