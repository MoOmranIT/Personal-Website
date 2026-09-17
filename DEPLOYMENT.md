# Deployment Guide

## Prerequisites

- Node.js >= 22.12.0 (Astro 7 requirement)
- npm >= 9.6.5
- A hosting provider that supports Node.js server applications (e.g., VPS, AWS EC2, Render, Fly.io, DigitalOcean App Platform)

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

This creates a `dist/` directory containing:
- `dist/client/` — static assets and pre-rendered HTML
- `dist/server/` — server entrypoint

## Environment Variables

No environment variables are required. The site uses direct contact links (WhatsApp, email, phone, office) configured in `src/scripts/siteConfig.ts`.

The hosting platform sets `PORT` automatically; do not override it.

## Production Start

```bash
npm start
```

This runs `node dist/server/entry.mjs` and starts the Node.js server on the port defined by the `PORT` environment variable (default: 4321).

### Using PM2 (recommended for production)

```bash
npm install -g pm2
pm2 start dist/server/entry.mjs --name "dr-khaled-website"
pm2 save
pm2 startup
```

## Domain Configuration

The site is configured with the canonical URL:

```
https://dr-khaledalmohamad.com/
```

Configure your DNS and hosting platform to:
1. Serve the site over HTTPS.
2. Redirect non-www to www (or vice versa) at the platform level if desired.
3. Ensure HTTP requests are redirected to HTTPS.

The exact redirect configuration depends on your hosting platform:
- **VPS / Nginx:** Use Nginx `server` blocks with `return 301` redirects.
- **Render / Fly.io / DigitalOcean:** Use the platform's built-in domain/redirect settings.
- **Vercel / Netlify:** Use their redirect configuration files (`_redirects`, `vercel.json`, `netlify.toml`).
- **GoDaddy / cPanel:** Use the Redirect Manager in cPanel or `.htaccess` rules.

## GoDaddy Node.js Hosting

This project is compatible with **GoDaddy Node.js Hosting** (cPanel/Plesk-based).

### Deployment Steps

1. **Build locally or in CI:**
   ```bash
   npm install
   npm run build
   ```
   This produces `dist/server/entry.mjs` (server entrypoint) and `dist/client/` (static assets).

2. **Upload files** to your GoDaddy Node.js hosting:
   - Upload the entire `dist/` directory.
   - Upload `node_modules/` (or run `npm install --omit=dev` on the server).
   - Upload `package.json`.

3. **Configure startup file:**
   GoDaddy Node.js hosting typically expects a startup entry point. Create or update the startup file
   (often configured via the cPanel "Setup Node.js App" panel) to run:
   ```bash
   node dist/server/entry.mjs
   ```
   Alternatively, add a `server.js` in the project root that requires the Astro entrypoint:
   ```js
   // server.js
   require('./dist/server/entry.mjs');
   ```
   *(Note: since the project is `type: "module"`, use a `.mjs` startup file or set `"type": "module"` in a `package.json` inside `dist/`).*

4. **Set environment variables** via the cPanel "Setup Node.js App" panel or `.env` file:
   - `PORT` (GoDaddy sets this automatically; do not override)

5. **Restart** the Node.js application from the cPanel panel.

### Node.js Version

- Minimum: **Node.js 22.12.0** (Astro 7 requirement)
- Recommended: **Node.js 22.x LTS** (22.12.0+)
- The project uses ESM (`"type": "module"`) and requires Node.js ≥ 22.12.

### GoDaddy-Specific Notes

- GoDaddy sets the `PORT` environment variable automatically. Do **not** hardcode a port.
- Static assets (CSS, JS, images) are served from `dist/client/` automatically by the Node adapter.
- The `@astrojs/node` adapter with `mode: "standalone"` bundles everything needed — no separate web server (nginx/Apache) is required for the application to run.
- Use **PM2** (if available) or GoDaddy's built-in process manager for uptime/restart:
  ```bash
  pm2 start dist/server/entry.mjs --name "dr-khaled-website" --env production
  ```

## Security Headers

The application includes a basic security header middleware:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Additional headers (e.g., HSTS, CSP) should be configured at the hosting/proxy level.

## Git Safety

- `.env` is gitignored and must never be committed.
- `.env.example` documents required variables without secrets.
- Never commit secrets or API keys.

## Updating Contact Information

Edit `src/scripts/siteConfig.ts` to update contact details (email, phone, WhatsApp, office address).

## Troubleshooting

- **Build fails:** Ensure Node.js version is >= 22.12.0 and dependencies are installed.
- **Site loads but pages 404:** Ensure the server is started with `npm start`, not just serving static files from `dist/client/`.
