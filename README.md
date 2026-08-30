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

### Contact form API
Set the environment variable `PUBLIC_CONTACT_API_URL` to enable form submission to a backend endpoint.

Example:
```bash
PUBLIC_CONTACT_API_URL=https://api.example.com/contact npm run dev
```

If no API URL is configured, the form will display a message instructing users to use WhatsApp, email, or phone instead.

## Placeholders

The following values are placeholders and should be replaced with real production data:
- Phone: `+971500000000`
- WhatsApp: `971500000000`
- LinkedIn, Instagram, Twitter URLs

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
- Tailwind CSS 4.x
- TypeScript
- Vanilla JavaScript (minimal)
