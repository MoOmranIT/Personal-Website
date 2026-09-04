# Dr. Khaled Al Mohammad — Business Consultant Website

Astro + Tailwind CSS frontend converted from the original HTML prototype.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Start production server

```bash
npm start
```

This runs the Node.js server with the bundled `/api/contact` endpoint.

## Preview production build

```bash
npm run preview
```

## Configuration

### Site configuration
Edit `src/scripts/siteConfig.ts` to update:
- Site name, title, description
- Contact details (email, phone, WhatsApp)
- Social media links

### Contact form backend
The contact form submits to the built-in `/api/contact` API route.

Configure the following environment variables in `.env`:

```env
CONTACT_TO_EMAIL=info@dr-khaledalmohamad.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your_smtp_password
```

See `.env.example` for the full list of required variables.

## Placeholders

The following values are placeholders and should be replaced with real production data:
- LinkedIn, Instagram, Twitter URLs
- SMTP credentials in `.env`

## Testing

Playwright is configured (`playwright.config.ts`). Tests live in `tests/` and run against the production build:

```bash
npm run build
npx playwright test
```

If Playwright browsers are not installed yet:

```bash
npx playwright install chromium
```

## Images

All images are served locally from `public/images/`.

## Sections

- `src/components/Hero.astro` — Hero section
- `src/components/Services.astro` — Services section
- `src/components/Audience.astro` — Target audience section
- `src/components/About.astro` — About Dr. Khaled
- `src/components/Books.astro` — Published books (data in `src/data/books.ts`)
- `src/components/SuccessStories.astro` — Success stories with flip cards
- `src/components/Contact.astro` — Contact form and info
- `src/components/Header.astro` — Site header with navigation
- `src/components/Footer.astro` — Site footer
- `src/components/BackToTop.astro` — Back to top button
- `src/components/ScrollProgress.astro` — Scroll progress bar

## Bilingual support

- English: `/` (`src/pages/index.astro`, translations in `src/i18n/en.ts`)
- Arabic (RTL): `/ar/` (`src/pages/ar/index.astro`, translations in `src/i18n/ar.ts`)
- Sitemap is generated automatically by `@astrojs/sitemap` (`/sitemap-index.xml`)

## Tech Stack

- Astro 5.x
- @astrojs/node
- Tailwind CSS 3.x
- Nodemailer
- TypeScript
- Playwright (E2E tests)
