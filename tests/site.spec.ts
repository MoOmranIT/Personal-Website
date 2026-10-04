import { expect, test } from '@playwright/test';

test.describe('Bilingual pages', () => {
  test('blog landing pages render localized collections', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-featured-slide]')).toHaveCount(3);
    await expect(page.locator('[data-featured-indicator]')).toHaveCount(3);
    await expect(page.locator('.blog-card')).toHaveCount(4);
    await expect(page.locator('#blog-grid-heading')).toHaveText('Browse Our Articles');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('footer a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow/);
    await expect(page.locator('.blog-card a[href="/blog/ai-brains-scalable-ecosystem-award/"]')).toBeVisible();
    await expect(page.locator('.blog-card img[src="/images/blog1.webp"]')).toBeVisible();

    await page.goto('/ar/blog/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('[data-featured-slide]')).toHaveCount(3);
    await expect(page.locator('[data-featured-indicator]')).toHaveCount(3);
    await expect(page.locator('.blog-card')).toHaveCount(4);
    await expect(page.locator('#blog-grid-heading')).toHaveText('تصفح المقالات');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/ar/blog/"]')).toHaveText('المدونة');
    await expect(page.locator('footer a[href="/ar/blog/"]')).toHaveText('المدونة');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow/);
    await expect(page.locator('.blog-card a[href="/ar/blog/ai-brains-award/"]')).toBeVisible();
    await expect(page.locator('.blog-card img[src="/images/blog1.webp"]')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow/);
  });

  test('blog featured slider auto-rotates every three seconds in EN and AR', async ({ page }) => {
    for (const path of ['/blog/', '/ar/blog/']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-featured-slider]')).toHaveAttribute('data-featured-slider-ready', 'true');
      await expect(page.locator('[data-featured-slide="0"]')).toHaveClass(/is-active/);
      await page.waitForTimeout(3400);
      await expect(page.locator('[data-featured-slide="1"]')).toHaveClass(/is-active/);
      await page.waitForTimeout(3200);
      await expect(page.locator('[data-featured-slide="2"]')).toHaveClass(/is-active/);
    }
  });

  test('blog autoplay continues while the pointer is over the Hero', async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-featured-slider]')).toHaveAttribute('data-featured-slider-ready', 'true');
    await expect(page.locator('[data-featured-slide="0"]')).toHaveClass(/is-active/);
    await page.locator('[data-featured-slider]').hover();
    await expect(page.locator('[data-featured-slide="0"]')).toHaveClass(/is-active/);
    await page.waitForTimeout(3400);
    await expect(page.locator('[data-featured-slide="1"]')).toHaveClass(/is-active/);
  });

  test('blog featured indicators match reference proportions', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('[data-featured-slider]')).toHaveAttribute('data-featured-slider-ready', 'true');
    const indicators = page.locator('[data-featured-indicator]');
    await expect(indicators).toHaveCount(3);
    const activeIndicator = page.locator('[data-featured-indicator].is-active');
    const inactiveIndicator = page.locator('[data-featured-indicator]:not(.is-active)').first();
    const inactiveBox = await inactiveIndicator.boundingBox();
    const activeBox = await activeIndicator.boundingBox();
    expect(inactiveBox).not.toBeNull();
    expect(activeBox).not.toBeNull();
    expect(activeBox!.width).toBeGreaterThanOrEqual(inactiveBox!.width! * 1.2);
    expect(activeBox!.height).toBeGreaterThanOrEqual(5);
    expect(activeBox!.height).toBeLessThanOrEqual(7);
    const sliderBox = await page.locator('[data-featured-slider]').boundingBox();
    const indicatorsBox = await page.locator('.blog-featured-indicators').boundingBox();
    expect(sliderBox).not.toBeNull();
    expect(indicatorsBox).not.toBeNull();
    const indicatorsCenter = indicatorsBox!.x + indicatorsBox!.width / 2;
    const sliderCenter = sliderBox!.x + sliderBox!.width / 2;
    expect(Math.abs(indicatorsCenter - sliderCenter)).toBeLessThan(8);
  });

  test('blog featured slider supports manual indicators and focus pause', async ({ page }) => {
    await page.goto('/blog/');
    await page.locator('[data-featured-indicator="1"]').click();
    await expect(page.locator('[data-featured-slide="1"]')).toHaveClass(/is-active/);
    await page.locator('[data-featured-indicator="1"]').focus();
    await page.waitForTimeout(3200);
    await expect(page.locator('[data-featured-slide="1"]')).toHaveClass(/is-active/);
    await page.locator('body').click({ position: { x: 8, y: 8 } });
    await page.waitForTimeout(3200);
    await expect(page.locator('[data-featured-slide="2"]')).toHaveClass(/is-active/);
  });

  test('featured CTA remains fully visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog/');
    const slider = page.locator('[data-featured-slider]');
    await expect(slider).toHaveAttribute('data-featured-slider-ready', 'true');
    const cta = slider.locator('[data-featured-slide="0"] .blog-visual-cta');
    await expect(cta).toBeVisible();
    const sliderBox = await slider.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(sliderBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(sliderBox!.y + sliderBox!.height + 1);
    expect(sliderBox!.height).toBeLessThanOrEqual(620);
  });

  test('blog respects reduced motion without auto rotation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ar/blog/');
    await expect(page.locator('[data-featured-slide="0"]')).toHaveClass(/is-active/);
    await page.waitForTimeout(3200);
    await expect(page.locator('[data-featured-slide="0"]')).toHaveClass(/is-active/);
  });

  test('blog article routes render localized content and counterpart links', async ({ page }) => {
    await page.goto('/blog/growth-starts-with-strategic-questions-en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.blog-article-page h1')).toHaveText('Growth That Starts With the Right Strategic Questions');
    await expect(page.locator('.blog-article-body')).toContainText('Growth');
    await expect(page.locator('.blog-article-hero')).toHaveAttribute('alt', 'Business growth strategy and market planning');
    await expect(page.locator('a.blog-back-link')).toHaveAttribute('href', '/blog/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /blog\/growth-starts-with-strategic-questions-en\//);
    await expect(page.locator('a.blog-language-link')).toHaveAttribute('href', '/ar/blog/growth-starts-with-strategic-questions-ar/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', /ar\/blog\/growth-starts-with-strategic-questions-ar\//);
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/blog/"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#site-header a.btn-navy').first()).toHaveAttribute('href', '/#contact');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/#services"]')).toBeAttached();
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/#about"]')).toBeAttached();
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/#ventures"]')).toBeAttached();
    await expect(page.locator('footer a[href="/#contact"]')).toBeAttached();
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('footer a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow/);
    await expect(page.locator('.blog-article-page h1')).toHaveText('Growth That Starts With the Right Strategic Questions');

    await page.goto('/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);

    await page.goto('/ar/blog/ai-brains-award/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);

    await page.goto('/ar/blog/growth-starts-with-strategic-questions-ar/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.blog-article-page h1')).toHaveText('النمو يبدأ من الأسئلة الاستراتيجية الصحيحة');
    await expect(page.locator('a.blog-back-link')).toHaveAttribute('href', '/ar/blog/');
    await expect(page.locator('a.blog-language-link')).toHaveAttribute('href', '/blog/growth-starts-with-strategic-questions-en/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /blog\/growth-starts-with-strategic-questions-en\//);
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/ar/blog/"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#site-header a.btn-navy').first()).toHaveAttribute('href', '/ar/#contact');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/ar/#services"]')).toBeAttached();
    await expect(page.locator('footer a[href="/ar/#contact"]')).toBeAttached();
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/ar/blog/"]')).toHaveText('المدونة');
    await expect(page.locator('footer a[href="/ar/blog/"]')).toHaveText('المدونة');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow/);

    await page.goto('/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('.blog-article-page h1')).toHaveText('AI Brains: From Ideas to a Scalable Ecosystem of Brands and Products');
    await expect(page.locator('.blog-article-hero')).toHaveAttribute('src', '/images/blog1.webp');
    await expect(page.locator('a.blog-language-link')).toHaveAttribute('href', '/ar/blog/ai-brains-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', /ar\/blog\/ai-brains-award\//);
    const enPosting = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(enPosting.some((content) => content.includes('"@type":"BlogPosting"') && content.includes('"inLanguage":"en"'))).toBe(true);

    await page.goto('/ar/blog/ai-brains-award/');
    await expect(page.locator('.blog-article-hero')).toHaveAttribute('src', '/images/blog1.webp');
    await expect(page.locator('a.blog-language-link')).toHaveAttribute('href', '/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /blog\/ai-brains-scalable-ecosystem-award\//);
    const arPosting = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(arPosting.some((content) => content.includes('"@type":"BlogPosting"') && content.includes('"inLanguage":"ar"'))).toBe(true);

    await page.goto('/blog/growth-starts-with-strategic-questions-en/');
    const demoPosting = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(demoPosting.some((content) => content.includes('"@type":"BlogPosting"'))).toBe(false);
  });

  test('selective Blog sitemap exposes only indexable articles', async ({ request }) => {
    const response = await request.get('/blog-sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');
    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.match(/<url>/g)?.length).toBe(2);
    expect(xml).toContain('https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');
    expect(xml).toContain('https://dr-khaledalmohamad.com/ar/blog/ai-brains-award/');
    expect(xml).not.toContain('growth-starts-with-strategic-questions');
    expect(xml).not.toContain('strategy-meets-the-market');
    expect(xml).not.toContain('https://dr-khaledalmohamad.com/blog/</loc>');
    expect(xml).not.toContain('https://dr-khaledalmohamad.com/ar/blog/</loc>');
  });

  test('robots declares both base and selective Blog sitemaps without blocking Blog', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const robots = await response.text();
    expect(robots).toContain('Sitemap: https://dr-khaledalmohamad.com/sitemap-index.xml');
    expect(robots).toContain('Sitemap: https://dr-khaledalmohamad.com/blog-sitemap.xml');
    expect(robots).not.toContain('Disallow: /blog/');
    expect(robots).not.toContain('Disallow: /ar/blog/');
  });

  test('indexable article social images use absolute WebP URLs', async ({ page }) => {
    for (const path of ['/blog/ai-brains-scalable-ecosystem-award/', '/ar/blog/ai-brains-award/']) {
      await page.goto(path);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://dr-khaledalmohamad.com/images/blog1.webp');
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://dr-khaledalmohamad.com/images/blog1.webp');
    }
  });

  test('English homepage renders main sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dr\. Khaled Al Mohammad/i);
    for (const id of ['home', 'services', 'training', 'about', 'books', 'success', 'video-testimonials', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('Arabic homepage is RTL and localized', async ({ page }) => {
    await page.goto('/ar/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveTitle(/د\. خالد المحمد/);
  });

  test('security headers are present', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
  });

  test('footer year is current', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#year')).toHaveText(String(new Date().getFullYear()));
  });

  test('training profile CTA downloads the supplied PDF', async ({ page, request }) => {
    await page.goto('/');
    const cta = page.locator('#training a[download="Dr-Khaled-Al-Mohammad-Executive-Training-Profile.pdf"]');
    await expect(cta).toHaveAttribute('href', '/downloads/dr-khaled-al-mohammad-executive-training-profile.pdf');

    const response = await request.get('/downloads/dr-khaled-al-mohammad-executive-training-profile.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const downloadPromise = page.waitForEvent('download');
    await cta.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Dr-Khaled-Al-Mohammad-Executive-Training-Profile.pdf');
  });

  test('training counters start at final values and animate on viewport entry', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const counters = page.locator('#training .counter-num');
    await expect(counters).toHaveCount(3);
    await expect(counters.nth(0)).toHaveText('+18');
    await expect(counters.nth(1)).toHaveText('+6250');
    await expect(counters.nth(2)).toHaveText('+22');

    await expect(counters.nth(0)).toHaveAttribute('data-training-counter', '18');
    await expect(counters.nth(1)).toHaveAttribute('data-training-counter', '6250');
    await expect(counters.nth(2)).toHaveAttribute('data-training-counter', '22');

    await counters.nth(0).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(counters.nth(0)).toHaveText('+18');

    await counters.nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(counters.nth(1)).toHaveText('+6250');
  });

  test('training counters respect reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const counters = page.locator('#training .counter-num');
    await expect(counters).toHaveCount(3);
    await expect(counters.nth(0)).toHaveText('+18');
    await expect(counters.nth(1)).toHaveText('+6250');
    await expect(counters.nth(2)).toHaveText('+22');

    await counters.nth(0).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(counters.nth(0)).toHaveText('+18');
  });

  test('MotorK copy uses approved wording', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ventures')).toBeAttached();
    const motorKCard = page.locator('#ventures .ventures-product').filter({ hasText: 'MotorK' });
    await expect(motorKCard).toBeAttached();
    await expect(motorKCard.locator('.ventures-product-caption')).toHaveText('AI-powered mobile app that helps you understand your car and maintenance costs before you pay.');
  });

  test('success stories render exactly 5 cards and first card spans wider on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const cards = page.locator('#success .flip-card');
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toHaveClass(/sm:col-span-2/);
  });

  test('video testimonials render 2 posters and open modal on click', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#video-testimonials')).toBeAttached();
    const triggers = page.locator('#video-testimonials .video-testimonial-tile');
    await expect(triggers).toHaveCount(2);

    const posters = page.locator('#video-testimonials .video-testimonial-tile img');
    await expect(posters).toHaveCount(2);
    for (let i = 0; i < 2; i += 1) {
      const img = posters.nth(i);
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('decoding', 'async');
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => el.complete), { timeout: 10000 }).toBe(true);
      await expect.poll(() => img.evaluate((el) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
    }

    const failedLocal: string[] = [];
    page.on('response', (res) => {
      if (res.url().startsWith('http://localhost:4321/videos/testimonials') && res.status() >= 400) {
        failedLocal.push(`${res.status()} ${res.url()}`);
      }
    });

    await triggers.first().click();
    await expect(page.locator('#video-modal')).toHaveClass(/open/);
    await expect(page.locator('#video-modal-player')).toHaveAttribute('src', /video-testimonial-01\.mp4$/);

    await page.locator('#video-modal-close').click();
    await expect(page.locator('#video-modal')).not.toHaveClass(/open/);
    await expect(page.locator('#video-modal-player')).not.toHaveAttribute('src');

    expect(failedLocal, `failed local requests: ${failedLocal.join(', ')}`).toEqual([]);
  });

  test('video testimonials do not request videos on initial load', async ({ page, request }) => {
    const videoRequests: string[] = [];
    page.on('response', (res) => {
      if (res.url().includes('/videos/testimonials/')) {
        videoRequests.push(res.url());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(500);
    expect(videoRequests.length, `unexpected video requests: ${videoRequests.join(', ')}`).toBe(0);
  });
});
