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

## Images

All images are currently loaded from external Pexels URLs. To use local images:
1. Place images in `public/images/`
2. Update the `src` attributes in the components

## Sections

- `src/components/Hero.astro` — Hero section
- `src/components/Services.astro` — Services section
- `src/components/Audience.astro` — Target audience section
- `src/components/About.astro` — About Dr. Khaled
- `src/components/Books.astro` — Published books
- `src/components/SuccessStories.astro` — Success stories with flip cards
- `src/components/Contact.astro` — Contact form and info
- `src/components/Header.astro` — Site header with navigation
- `src/components/Footer.astro` — Site footer
- `src/components/BackToTop.astro` — Back to top button
- `src/components/ScrollProgress.astro` — Scroll progress bar

## Tech Stack

- Astro 5.x
- @astrojs/node
- Tailwind CSS 3.x
- Nodemailer
- TypeScript
- Vanilla JavaScript (minimal)
