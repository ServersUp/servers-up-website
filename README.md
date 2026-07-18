## ServersUp Website

Canonical host: **`https://serversup.armasn.dev`** (S3 `serversup-site` + CloudFront; DNS at Cloudflare).

Source lives in this GitHub repo (`ServersUp/servers-up-website`) on **`main`**. On push to `main`, [`.github/workflows/publish-site.yml`](.github/workflows/publish-site.yml) syncs to S3 and invalidates CloudFront (OIDC).

GitHub Pages is **not** used. The repo was renamed away from `serversup.github.io` so `https://serversup.github.io/` is a 404 (by design).

### Stack

- Self-contained CSS + vanilla JS
- Live status on `/` via same-origin `/status/latest.json`
- Install/docs on `/install/`

### Local preview

```bash
python3 -m http.server 5173
```

Status fetch uses same-origin `/status/latest.json` on `serversup.armasn.dev`; elsewhere (local preview) it falls back to `https://serversup.armasn.dev/status/latest.json` (CloudFront CORS `*`).

### Data

- `data/wow-servers.json` and `data/ffxiv-servers.json` - source lists
- `data/games-data.js` - bundled for offline preview (regenerate when JSON changes)

### Repo variables (publish workflow)

- `AWS_ROLE_SITE_PUBLISH` - IAM role ARN (`site_publish_role_arn` from `website-cdn`)
- `CLOUDFRONT_DISTRIBUTION_ID` - distribution id from `website-cdn`
