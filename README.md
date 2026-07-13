## ServersUp Website

Canonical host: **`https://serversup.armasn.dev`** (S3 `serversup-site` + CloudFront; DNS at Cloudflare).

Source still lives in this GitHub repo. On push to `main`, [`.github/workflows/publish-site.yml`](.github/workflows/publish-site.yml) syncs to S3 and invalidates CloudFront (OIDC). GitHub Pages may 301 `serversup.github.io` → the custom domain.

### Stack

- Self-contained CSS + vanilla JS
- Live status on `/` via same-origin `/status/latest.json`
- Install/docs on `/install/`

### Local preview

```bash
python3 -m http.server 5173
```

Status fetch uses `/status/latest.json` (needs the CloudFront dual-origin, or temporarily point `STATUS_URL` at the CloudFront URL for local/github.io-only preview).

### Data

- `data/wow-servers.json` and `data/ffxiv-servers.json` — source lists
- `data/games-data.js` — bundled for offline preview (regenerate when JSON changes)

### Repo variables (publish workflow)

- `AWS_ROLE_SITE_PUBLISH` — IAM role ARN (`site_publish_role_arn` from `website-cdn`)
- `CLOUDFRONT_DISTRIBUTION_ID` — distribution id from `website-cdn`
