# Deployment Guide

## Prerequisites

- Node.js >= 18.17.0
- npm >= 9.x
- A hosting provider that supports Node.js server applications (e.g., VPS, AWS EC2, Render, Fly.io, DigitalOcean App Platform)
- SMTP provider credentials (Gmail, Outlook, SendGrid, Mailgun, Postmark, etc.)

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
- `dist/server/` — server entrypoint and bundled API routes

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
CONTACT_TO_EMAIL=info@dr-khaledalmohamad.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your_smtp_password
PUBLIC_CONTACT_API_URL=/api/contact
```

### Variable Descriptions

| Variable | Purpose | Example |
|----------|---------|---------|
| `CONTACT_TO_EMAIL` | Recipient address for contact form submissions | `info@dr-khaledalmohamad.com` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (use `587` for TLS, `465` for SSL) | `587` |
| `SMTP_USER` | SMTP username / email | `user@example.com` |
| `SMTP_PASS` | SMTP password or app-specific password | `your_app_password` |
| `PUBLIC_CONTACT_API_URL` | Public API URL override (optional, defaults to `/api/contact`) | `/api/contact` |

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
https://www.dr-khaledalmohamad.com/
```

Configure your DNS and hosting platform to:
1. Serve the site over HTTPS.
2. Redirect non-www to www (or vice versa) at the platform level if desired.
3. Ensure HTTP requests are redirected to HTTPS.

The exact redirect configuration depends on your hosting platform:
- **VPS / Nginx:** Use Nginx `server` blocks with `return 301` redirects.
- **Render / Fly.io / DigitalOcean:** Use the platform's built-in domain/redirect settings.
- **Vercel / Netlify:** Use their redirect configuration files (`_redirects`, `vercel.json`, `netlify.toml`).

## Contact Form Backend

The contact form submits to `/api/contact` (server-side API route).

### Verification

Test the API locally:

```bash
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello","website":""}'
```

Expected responses:
- `200 OK` — `{ "ok": true }` (when SMTP is configured)
- `400 Bad Request` — validation error details
- `404/405` — invalid method
- `429 Too Many Requests` — rate limit exceeded
- `500` — SMTP misconfiguration or server error

### SMTP Notes

- Ensure your SMTP provider allows connections from your server IP.
- For Gmail/Google Workspace, use an App Password if 2FA is enabled.
- Some providers require enabling "Less secure app access" or using OAuth2.
- Test SMTP connectivity before deploying:

```bash
node -e "const nodemailer=require('nodemailer');const t=nodemailer.createTransport({host:'your-smtp-host',port:587,auth:{user:'your-user',pass:'your-pass'}});t.verify().then(()=>console.log('SMTP OK')).catch(e=>console.error('SMTP FAIL',e.message));"
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
- Never commit SMTP passwords or API keys.

## Updating Contact Information

Edit `src/scripts/siteConfig.ts` to update contact details. The contact form recipient is controlled by `CONTACT_TO_EMAIL` in `.env`.

## Troubleshooting

- **API returns 500 "Server configuration error":** `CONTACT_TO_EMAIL` is not set.
- **API returns 500 "Failed to send email":** Check SMTP credentials and network connectivity.
- **Build fails:** Ensure Node.js version is >= 18.17.0 and dependencies are installed.
- **Site loads but API 404s:** Ensure the server is started with `npm start`, not just serving static files from `dist/client/`.
