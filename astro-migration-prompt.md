# Convert Existing HTML Prototype to Astro — Dr. Khaled Al Mohammad

## Objective

Convert the provided single-file HTML prototype:

`dr-khaled-al-mohammad.html`

into a clean, production-ready **Astro + Tailwind CSS** frontend project.

The goal is **not to redesign the website**. Preserve the current visual design, content, layout, responsive behavior, interactions, SEO intent, and information architecture as closely as possible while replacing the monolithic HTML file with a maintainable Astro project structure.

---

## Source of Truth

The existing HTML file is the primary source of truth for:

- Visual design
- Copy/content
- Sections
- Navigation
- Existing interactions
- SEO metadata
- Structured data
- Existing responsive behavior
- Colors, spacing, typography, cards, buttons, and animations

Do not invent new sections, copy, business claims, social accounts, contact details, testimonials, statistics, services, or functionality that are not present in the prototype.

If something is unclear, preserve the existing behavior/content rather than inventing a replacement.

---

# 1. Target Stack

Use:

- Astro
- Tailwind CSS
- TypeScript where useful
- Minimal client-side JavaScript
- Astro components for reusable UI
- Static rendering by default

Do **not** convert this into a React SPA.

Use React only if there is a demonstrated need for a genuinely interactive component that is awkward to implement otherwise. Prefer native Astro + browser JavaScript.

---

# 2. Recommended Project Structure

Create a structure similar to:

```text
/
├── public/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── MobileMenu.astro
│   │   ├── Hero.astro
│   │   ├── Stats.astro
│   │   ├── Services.astro
│   │   ├── About.astro
│   │   ├── Books.astro
│   │   ├── SuccessStories.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro
│   │   └── BackToTop.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │
│   ├── pages/
│   │   └── index.astro
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   └── scripts/
│       └── site.ts
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

Adjust the structure if the existing prototype contains a better logical grouping, but keep components reasonably granular.

---

# 3. Main Page

Create:

`src/pages/index.astro`

It should assemble the page approximately as:

```astro
<BaseLayout>
  <Header />
  <main>
    <Hero />
    <Stats />
    <Services />
    <About />
    <Books />
    <SuccessStories />
    <Contact />
  </main>
  <Footer />
  <BackToTop />
</BaseLayout>
```

Preserve the existing section IDs so current anchor navigation continues to work:

- `home`
- `services`
- `about`
- `books`
- `success`
- `contact`

If the source contains additional IDs, preserve those too.

---

# 4. Layout and SEO

Create:

`src/layouts/BaseLayout.astro`

Move the document-level metadata from the existing HTML into the Astro layout.

Preserve the intent and values of:

- `<html lang="en">`
- charset
- viewport
- title
- meta description
- keywords
- author
- robots
- theme-color
- geo metadata if present
- canonical URL
- Open Graph metadata
- Twitter metadata
- favicon
- preconnect/dns-prefetch where useful

The source currently targets:

`https://www.drkhaledalmohammad.com/`

Keep this canonical URL unless an environment/configuration approach is needed.

Do not remove existing SEO metadata merely because it is not required for rendering.

---

# 5. JSON-LD / Structured Data

The source contains Schema.org JSON-LD for:

- Person
- ProfessionalService
- WebSite

Preserve this structured data in the Astro layout/page.

Use a safe Astro implementation such as:

```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

Do not accidentally HTML-escape the JSON-LD into invalid structured data.

Do not invent or modify business facts.

Important: values that are clearly placeholders in the source, such as placeholder phone/social URLs, should remain identifiable as placeholders and must NOT be presented as verified production data.

---

# 6. Components

Break the existing monolithic markup into reusable Astro components.

At minimum:

### Header.astro

Responsible for:

- Logo/brand
- Desktop navigation
- Mobile navigation trigger
- CTA
- Existing header scroll behavior

### Hero.astro

Preserve:

- Hero content
- Headline
- Supporting copy
- CTA buttons
- Hero image
- Existing visual effects

### Stats.astro

Preserve the existing statistics and animated counters.

Do not alter the numbers.

### Services.astro

Preserve all service cards/content from the prototype.

### About.astro

Preserve:

- About copy
- Credentials
- Experience information
- Existing visual layout
- Images

### Books.astro

Preserve the existing books section and all book content.

### SuccessStories.astro

Preserve the existing success-story cards, including the flip-card interaction.

The cards should remain keyboard accessible.

### Contact.astro

Preserve the current contact form UI and fields.

IMPORTANT:
The frontend conversion should NOT pretend that the form is connected to a backend.

For this task, keep the form UI production-ready but leave the submission endpoint configurable, e.g.:

```text
PUBLIC_CONTACT_API_URL
```

or use a clearly documented placeholder endpoint.

Do not fake successful submission.

### Footer.astro

Preserve all existing footer content and links.

---

# 7. Existing JavaScript Interactions

Preserve the behavior already present in the prototype.

The source includes interactions such as:

- Smooth scrolling
- Header/navigation behavior
- Scroll spy / active navigation
- Mobile menu
- Back-to-top
- Scroll progress
- Reveal animations
- Reveal-left
- Reveal-right
- Reveal-scale
- Animated statistics/counters
- Success-story flip cards
- Keyboard interaction for flip cards

Move the JavaScript out of the giant HTML file.

Prefer:

`src/scripts/site.ts`

or small component-local scripts where appropriate.

Do not add unnecessary JavaScript.

---

# 8. Client-Side JavaScript Rules

Astro should ship as little JavaScript as possible.

Do NOT add a frontend framework globally.

Use:

```html
<script>
  ...
</script>
```

or imported TypeScript for lightweight DOM interactions.

Only hydrate a component if hydration is genuinely required.

The resulting page should remain mostly static HTML.

---

# 9. Tailwind CSS

The existing HTML contains generated Tailwind CSS.

Do NOT copy the giant generated Tailwind stylesheet into the new project.

Instead:

1. Configure Tailwind correctly for Astro.
2. Recreate the required design tokens/utilities using normal Tailwind classes and/or custom CSS.
3. Put true global styles in:

`src/styles/global.css`

Preserve the prototype's visual system, especially:

- Navy
- Gold
- Paper/light background
- Typography
- Borders
- Shadows
- Radii
- Focus states
- Selection styling
- Scroll behavior
- Animation timing

The source uses CSS variables such as:

- `--navy`
- `--gold`
- `--paper`
- `--ink`
- `--font-sans`
- `--font-serif`

Preserve their conceptual usage.

---

# 10. Typography

Inspect the source carefully for the intended typography.

Do not replace the typography with arbitrary fonts.

If the source references external fonts, determine exactly which ones are actually used and configure them properly.

Prefer self-hosting fonts if appropriate for production, but do not introduce a visually different font.

---

# 11. Images and Assets

The prototype currently references external Pexels images.

For the Astro project:

- Identify every image used.
- Preserve the correct image/content mapping.
- Do not replace images with random alternatives.
- Prefer optimized local assets or Astro image optimization where practical.
- Use appropriate `alt` text.
- Preserve the visual crop/aspect ratio.

If the source only has remote image URLs and no local image files are available, document the required assets rather than inventing replacements.

Do not silently change the hero image.

---

# 12. Favicon

The source currently has an inline SVG favicon.

Extract it into:

`public/favicon.svg`

and reference it from the layout.

Do not redesign the favicon during this conversion.

---

# 13. Accessibility

Preserve and improve accessibility without changing the visual design.

Ensure:

- Semantic HTML
- Correct heading hierarchy
- Navigation landmarks
- Accessible buttons
- Keyboard-accessible mobile menu
- Keyboard-accessible flip cards
- Visible focus states
- Form labels
- Appropriate input types
- Meaningful alt text
- `aria-expanded` / `aria-controls` where appropriate
- Escape-key handling for overlays/menus if applicable
- No keyboard traps

Do not remove existing accessibility behavior.

---

# 14. Responsive Design

The new Astro version must visually match the existing prototype at:

- Desktop
- Tablet
- Mobile

Do not redesign responsive breakpoints unless necessary to fix a genuine implementation issue.

Test:

- 320px
- 375px
- 390px
- 768px
- 1024px
- 1280px
- 1440px+

Pay particular attention to:

- Header/mobile menu
- Hero image/text
- Statistics
- Service cards
- Book cards
- Flip cards
- Contact form
- Footer

---

# 15. Contact Form

The current prototype's form is frontend-only.

Do NOT retain fake behavior such as:

```js
preventDefault();
form.reset();
showSuccessMessage();
```

if that falsely implies the message was actually sent.

Instead:

- Build a proper form component.
- Add client-side validation.
- Add accessible error states.
- Make the API URL configurable.
- Keep the submission implementation ready for a future serverless endpoint.

Expected conceptual flow:

```text
Contact Form
     ↓
POST to configured API endpoint
     ↓
API validates
     ↓
Email/CRM service
     ↓
Success response
```

For this frontend migration, only implement the frontend side unless explicitly instructed to build the backend.

---

# 16. Placeholder / Unverified Information

Do not fabricate real contact information.

The source contains information that appears to be placeholder or generic, including:

- `+971500000000`
- Generic LinkedIn/Instagram/X URLs

Keep these values isolated/configurable where possible.

For example:

```ts
const siteConfig = {
  phone: '...',
  email: '...',
  linkedin: '...',
  instagram: '...',
  twitter: '...'
};
```

Do not replace them with invented real accounts.

---

# 17. Performance

The finished Astro site should aim for:

- Minimal JS
- No unnecessary dependencies
- Optimized images
- No giant generated CSS copied from the prototype
- Correct lazy-loading for below-the-fold images
- Preload only genuinely critical assets
- No layout shift caused by images
- Fast first render

Do not sacrifice visual fidelity for arbitrary performance optimization.

---

# 18. SEO Technical Requirements

Preserve the existing SEO foundation and ensure:

- One canonical URL
- One primary `<h1>`
- Correct heading hierarchy
- Descriptive title
- Description
- Open Graph
- Twitter card
- JSON-LD
- Semantic links
- Image alt text
- `robots.txt`
- Sitemap configuration if appropriate

Do not keyword-stuff the page.

Do not invent SEO copy.

---

# 19. Verification

After implementation:

1. Run the Astro dev server.
2. Verify the page renders without console errors.
3. Verify every navigation anchor.
4. Verify mobile menu.
5. Verify scroll behavior.
6. Verify counters.
7. Verify reveal animations.
8. Verify flip cards.
9. Verify keyboard interactions.
10. Verify form validation.
11. Verify images.
12. Verify responsive layouts.
13. Verify metadata.
14. Verify JSON-LD.
15. Run the production build.

The project must successfully run:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# 20. Visual Fidelity Requirement

This is a migration, not a redesign.

Target:

**Pixel-close reproduction of the existing prototype.**

Do not:

- Change the color palette
- Rewrite the copy
- Remove sections
- Add new sections
- Change CTA wording
- Change card design
- Change spacing arbitrarily
- Replace the overall visual language
- Add unnecessary UI

If the prototype has a visual or UX bug, fix it only when the fix is clearly necessary for production quality, and document the change.

---

# 21. Expected Deliverables

Produce:

```text
Astro project
├── Working responsive homepage
├── Reusable components
├── Global styling
├── Preserved interactions
├── Preserved SEO
├── Preserved JSON-LD
├── Optimized asset handling
├── Accessible markup
├── Configurable contact form endpoint
└── README with setup/build instructions
```

The README should explain:

- How to install
- How to run locally
- How to build
- How to preview
- Where to change site/contact configuration
- Where to add/replace images
- Where to configure the contact API
- Which values from the prototype are placeholders and need real production data

---

# 22. Important Scope Boundary

For this task, do NOT implement:

- Database
- Authentication
- Admin dashboard
- CMS
- CRM
- Payments
- Booking engine
- Email backend
- Server-side business logic

Those are separate phases.

This task is specifically:

**Existing HTML prototype → clean Astro production frontend.**

---

# 23. Final Acceptance Criteria

The migration is complete only when:

- The Astro project builds successfully.
- The homepage looks substantially identical to the source prototype.
- All existing sections are present.
- Existing navigation works.
- Existing animations/interactions work.
- Mobile behavior works.
- Flip cards remain accessible.
- SEO metadata is preserved.
- JSON-LD is preserved.
- No fake contact submission success remains.
- No giant generated Tailwind stylesheet is copied from the source.
- Code is split into maintainable Astro components.
- JavaScript is minimized.
- No invented business information has been added.
- README documents setup and remaining production configuration.

## Source file

Use the uploaded:

`dr-khaled-al-mohammad.html`

as the authoritative implementation reference.
