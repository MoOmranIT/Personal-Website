import { expect, test } from '@playwright/test';

test.describe('Bilingual pages', () => {
  test('blog landing pages render localized collections', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-featured-slide]')).toHaveCount(3);
    await expect(page.locator('[data-featured-indicator]')).toHaveCount(3);
    await expect(page.locator('.blog-card')).toHaveCount(6);
    await expect(page.locator('#blog-grid-heading')).toHaveText('Browse Our Articles');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('footer a[href="/blog/"]')).toHaveText('Blog');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
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

  test('selective Blog sitemap exposes indexable landing and articles', async ({ request }) => {
    const response = await request.get('/blog-sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');
    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.match(/<url>/g)?.length).toBe(5);
    expect(xml).toContain('https://dr-khaledalmohamad.com/blog/');
    expect(xml).toContain('https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');
    expect(xml).toContain('https://dr-khaledalmohamad.com/blog/business-growth-strategy-practical-guide/');
    expect(xml).toContain('https://dr-khaledalmohamad.com/blog/how-to-build-business-growth-strategy-step-by-step/');
    expect(xml).toContain('https://dr-khaledalmohamad.com/ar/blog/ai-brains-award/');
    expect(xml).not.toContain('growth-starts-with-strategic-questions');
    expect(xml).not.toContain('strategy-meets-the-market');
    expect(xml).not.toContain('https://dr-khaledalmohamad.com/ar/blog/</loc>');
    for (const url of [
      'https://dr-khaledalmohamad.com/blog/',
      'https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/',
      'https://dr-khaledalmohamad.com/ar/blog/ai-brains-award/',
      'https://dr-khaledalmohamad.com/blog/business-growth-strategy-practical-guide/',
      'https://dr-khaledalmohamad.com/blog/how-to-build-business-growth-strategy-step-by-step/',
    ]) {
      expect(xml.match(new RegExp(`<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`, 'g'))?.length).toBe(1);
    }
  });

  test('English blog landing indexing, canonical, and hreflang', async ({ page, request }) => {
    const response = await page.goto('/blog/');
    expect(response?.status()).toBe(200);
    const xRobots = response?.headers()['x-robots-tag'];
    expect(xRobots ?? '').not.toMatch(/noindex/i);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/');
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).not.toContain('[');
    expect(canonicalHref).not.toContain(']');
    expect(canonicalHref).not.toContain('https\\://');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://dr-khaledalmohamad.com/blog/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/');

    const sitemapResponse = await request.get('/blog-sitemap.xml');
    expect(await sitemapResponse.text()).toContain('https://dr-khaledalmohamad.com/blog/');
  });

  test('Arabic blog landing remains noindex and out of Blog sitemap', async ({ page, request }) => {
    const response = await page.goto('/ar/blog/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow, max-image-preview:large/);
    const xml = await (await request.get('/blog-sitemap.xml')).text();
    expect(xml).not.toContain('https://dr-khaledalmohamad.com/ar/blog/</loc>');
  });

  test('Blog production articles indexing headers and hreflang clusters', async ({ page }) => {
    const assertNoNoindexHeader = async (path: string) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex/i);
    };

    await assertNoNoindexHeader('/blog/business-growth-strategy-practical-guide/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow, max-image-preview:large/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/business-growth-strategy-practical-guide/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/business-growth-strategy-practical-guide/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/business-growth-strategy-practical-guide/');

    await assertNoNoindexHeader('/blog/how-to-build-business-growth-strategy-step-by-step/');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/how-to-build-business-growth-strategy-step-by-step/');

    await page.goto('/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/ar/blog/ai-brains-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');

    await page.goto('/ar/blog/ai-brains-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/ar/blog/ai-brains-award/');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://dr-khaledalmohamad.com/blog/ai-brains-scalable-ecosystem-award/');

    await page.goto('/blog/growth-starts-with-strategic-questions-en/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, follow, max-image-preview:large/);
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

  test('business growth strategy article integrates responsive image and callouts', async ({ page }) => {
    await page.goto('/blog/business-growth-strategy-practical-guide/');

    const articleImages = page.locator('.blog-article-body img');
    await expect(articleImages).toHaveCount(1);

    const figure = page.locator('.blog-article-body figure.blog-article-inline-image');
    await expect(figure).toHaveCount(1);
    const figureImg = figure.locator('img');
    await expect(figureImg).toHaveAttribute('src', '/images/business-growth-strategy-practical-guide.webp');
    await expect(figureImg).toHaveAttribute('alt', 'Glass presentation board displaying a comprehensive Business Growth Strategy diagram in a modern corporate meeting room.');
    const srcset = await figureImg.getAttribute('srcset');
    expect(srcset).toContain('/images/business-growth-strategy-practical-guide-480.webp 480w');
    expect(srcset).toContain('/images/business-growth-strategy-practical-guide-640.webp 640w');
    expect(srcset).toContain('/images/business-growth-strategy-practical-guide-960.webp 960w');
    expect(srcset).toContain('/images/business-growth-strategy-practical-guide-1280.webp 1280w');

    const previousText = await figure.evaluate((el) => el.previousElementSibling?.textContent ?? '');
    const nextText = await figure.evaluate((el) => el.nextElementSibling?.textContent ?? '');
    expect(previousText).toContain('The goal is not to grow in every possible direction. It is to identify the most appropriate path to sustainable business growth.');
    expect(nextText).toContain('Ready to turn growth priorities into measurable results?');

    await figureImg.scrollIntoViewIfNeeded();
    await expect.poll(() => figureImg.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://dr-khaledalmohamad.com/images/business-growth-strategy-practical-guide.webp');
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'Glass presentation board displaying a comprehensive Business Growth Strategy diagram in a modern corporate meeting room.');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://dr-khaledalmohamad.com/images/business-growth-strategy-practical-guide.webp');
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', 'Glass presentation board displaying a comprehensive Business Growth Strategy diagram in a modern corporate meeting room.');

    const postingScript = (await page.locator('script[type="application/ld+json"]').allTextContents()).find((content) => content.includes('"@type":"BlogPosting"'));
    expect(postingScript).toBeTruthy();
    const posting = JSON.parse(postingScript!);
    expect(posting.image['@type']).toBe('ImageObject');
    expect(posting.image.url).toBe('https://dr-khaledalmohamad.com/images/business-growth-strategy-practical-guide.webp');
    expect(posting.image.contentUrl).toBe('https://dr-khaledalmohamad.com/images/business-growth-strategy-practical-guide.webp');
    expect(posting.image.width).toBe(1280);
    expect(posting.image.height).toBe(698);
    expect(posting.image.name).toBe('Glass presentation board displaying a comprehensive Business Growth Strategy diagram in a modern corporate meeting room.');
    expect(posting.image.description).toBe('sleek presentation of a Business Growth Strategy diagram displayed on a transparent glass board inside a modern executive boardroom. The flowchart illustrates key strategic pathways for revenue expansion, market presence, and sustainable enterprise growth.');

    const blockquotes = page.locator('.blog-article-body blockquote');
    await expect(blockquotes).toHaveCount(6);
    await expect(page.locator('[data-article-prose]')).toHaveCount(1);
    await expect(page.locator('[data-article-prose] blockquote')).toHaveCount(6);

    await page.setViewportSize({ width: 375, height: 812 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);

    await page.goto('/blog/');
    const cardImage = page.locator('.blog-card img[src="/images/business-growth-strategy-practical-guide.webp"]');
    await expect(cardImage).toBeVisible();
  });
  test('second business growth strategy article is English-only and renders responsive image', async ({ page }) => {
    await page.goto('/blog/how-to-build-business-growth-strategy-step-by-step/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.blog-article-page h1')).toHaveText('How to Build a Business Growth Strategy: A Step-by-Step Guide');
    await expect(page.locator('.blog-article-body')).toContainText('business growth strategy');
    await expect(page.locator('.blog-article-body img')).toHaveCount(1);
    await expect(page.locator('.blog-article-hero')).toHaveCount(0);
    await expect(page.locator('a.blog-back-link')).toHaveAttribute('href', '/blog/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /blog\/how-to-build-business-growth-strategy-step-by-step\//);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /blog\/how-to-build-business-growth-strategy-step-by-step\//);
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveCount(0);
    await expect(page.locator('a.blog-language-link')).toHaveCount(0);
    await expect(page.locator('[data-language-switch]')).toHaveAttribute('href', '/ar/blog/');
    await expect(page.locator('header nav[aria-label="Primary"] a[href="/blog/"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);

    const figure = page.locator('.blog-article-body figure.blog-article-inline-image');
    await expect(figure).toHaveCount(1);
    const figureImg = figure.locator('img');
    await expect(figureImg).toHaveAttribute('src', '/images/build-business-growth-strategy-step-by-step.webp');
    await expect(figureImg).toHaveAttribute('alt', 'An isometric step-by-step workflow diagram outlining the process of Building a Business Growth Strategy in 7 key steps.');
    const srcset = await figureImg.getAttribute('srcset');
    expect(srcset).toContain('/images/build-business-growth-strategy-step-by-step-480.webp 480w');
    expect(srcset).toContain('/images/build-business-growth-strategy-step-by-step-640.webp 640w');
    expect(srcset).toContain('/images/build-business-growth-strategy-step-by-step-960.webp 960w');
    expect(srcset).toContain('/images/build-business-growth-strategy-step-by-step-1280.webp 1280w');

    const postingScript = (await page.locator('script[type="application/ld+json"]').allTextContents()).find((content) => content.includes('"@type":"BlogPosting"'));
    expect(postingScript).toBeTruthy();
    const posting = JSON.parse(postingScript!);
    expect(posting.image['@type']).toBe('ImageObject');
    expect(posting.image.url).toBe('https://dr-khaledalmohamad.com/images/build-business-growth-strategy-step-by-step.webp');
    expect(posting.image.width).toBe(1280);
    expect(posting.image.height).toBe(698);
    expect(posting.image.name).toBe('An isometric step-by-step workflow diagram outlining the process of Building a Business Growth Strategy in 7 key steps.');
    expect(posting.image.description).toBe('An isometric infographic on a glass display illustrating the 7-step process for Building a Business Growth Strategy to achieve sustainable corporate expansion.');

    await expect(page.locator('.blog-article-body blockquote')).toHaveCount(5);
    await expect(page.locator('[data-article-prose]')).toHaveCount(1);
    await expect(page.locator('[data-article-prose] blockquote')).toHaveCount(5);

    const articleBodyText = await page.locator('.blog-article-body').innerText();
    expect(articleBodyText.split(/\r?\n/).some((line) => line.trimStart().startsWith('? '))).toBe(false);

    const dataDrivenCallout = page.locator('.blog-article-body blockquote').filter({ hasText: 'Make Data-Driven Growth Decisions' });
    await expect(dataDrivenCallout).toContainText('💡 Make Data-Driven Growth Decisions:');
    await expect(dataDrivenCallout).toContainText(/Don['\u2019]t rely on guesswork when selecting your expansion path\./);

    await expect(page.locator('.blog-article-body h3').filter({ hasText: '1. Business Performance Assessment: Understanding Your Current Position' })).toHaveCount(1);

    await page.setViewportSize({ width: 375, height: 812 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);

    await page.goto('/blog/');
    await expect(page.locator('.blog-card img[src="/images/build-business-growth-strategy-step-by-step.webp"]')).toBeVisible();
  });



  test('business growth strategy article 1 restores approved hyperlinks', async ({ page }) => {
    await page.goto('/blog/business-growth-strategy-practical-guide/');
    const prose = page.locator('[data-article-prose]');
    const approvedLinks = [
      { text: 'Dr. Khaled Al Mohammad’s website', href: 'https://dr-khaledalmohamad.com/#home' },
      { text: 'business development and strategic advisory services', href: 'https://dr-khaledalmohamad.com/#services' },
      { text: 'strategic advisory and business development', href: 'https://dr-khaledalmohamad.com/#contact' },
      { text: 'executive coaching', href: 'https://dr-khaledalmohamad.com/#training' },
      { text: 'real business transformation stories', href: 'https://dr-khaledalmohamad.com/#success' },
      { text: 'strategic advisory and executive training programs', href: 'https://dr-khaledalmohamad.com/#training' },
      { text: 'Book a strategic consultation', href: 'https://dr-khaledalmohamad.com/#contact' },
    ];

    await expect(prose.locator('a')).toHaveCount(approvedLinks.length);
    for (const link of approvedLinks) {
      const anchor = prose.locator(`a[href="${link.href}"]`).filter({ hasText: link.text });
      await expect(anchor).toHaveCount(1);
    }

    const emptyAnchorCount = await prose.locator('a').evaluateAll((anchors) => anchors.filter((anchor) => !anchor.textContent?.trim()).length);
    expect(emptyAnchorCount).toBe(0);

    const firstLink = prose.locator('a').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
    const linkStyles = await firstLink.evaluate((el) => getComputedStyle(el));
    expect(linkStyles.textDecorationLine).toContain('underline');
  });

  test('business growth strategy article 2 restores approved hyperlinks', async ({ page }) => {
    await page.goto('/blog/how-to-build-business-growth-strategy-step-by-step/');
    const prose = page.locator('[data-article-prose]');
    const approvedLinks = [
      { text: /Dr\. Khaled Al Mohammad['\u2019]s professional profile/, href: 'https://dr-khaledalmohamad.com/' },
      { text: 'business strategy consulting', href: 'https://dr-khaledalmohamad.com/#contact' },
      { text: 'tailored strategic advisory and corporate performance services', href: 'https://dr-khaledalmohamad.com/#services' },
      { text: 'tailored business development and strategic framework training', href: 'https://dr-khaledalmohamad.com/#training' },
      { text: 'Contact Dr. Khaled Al-Mohamad to schedule a consultation.', href: 'https://dr-khaledalmohamad.com/#contact' },
    ];

    await expect(prose.locator('a')).toHaveCount(approvedLinks.length);
    for (const link of approvedLinks) {
      const anchor = prose.locator(`a[href="${link.href}"]`).filter({ hasText: link.text });
      await expect(anchor).toHaveCount(1);
    }

    const emptyAnchorCount = await prose.locator('a').evaluateAll((anchors) => anchors.filter((anchor) => !anchor.textContent?.trim()).length);
    expect(emptyAnchorCount).toBe(0);
  });

  test('business growth strategy article 1 semantic structure', async ({ page }) => {
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/blog/business-growth-strategy-practical-guide/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `overflow at ${width}px`).toBe(false);
    }

    await page.goto('/blog/business-growth-strategy-practical-guide/');
    const prose = page.locator('[data-article-prose]');
    await expect(page.locator('.blog-article-page h1')).toHaveCount(1);
    await expect(page.locator('.blog-article-page h1')).toHaveText('What Is a Business Growth Strategy: A Practical Guide');
    await expect(prose.locator('h2', { hasText: 'What Is a Business Growth Strategy?' })).toHaveCount(1);
    await expect(prose.locator('h3', { hasText: 'What Are the Components of a Business Growth Strategy?' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'Why Is a Business Growth Framework Important?' })).toHaveCount(1);
    await expect(prose.locator('h3', { hasText: 'How Does Strategic Growth Planning Align Business Goals and Resources?' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'What Are the Main Types of Business Growth Strategies?' })).toHaveCount(1);
    await expect(prose.locator('h3', { hasText: 'Market Penetration: Growing Within Existing Markets' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'How to Develop Business Growth Planning?' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'Conclusion: Building a Business Growth Strategy That Creates Lasting Value' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'Frequently Asked Questions About Business Growth Strategy' })).toHaveCount(1);
    await expect(prose.locator('blockquote')).toHaveCount(6);

    await expect(prose.locator('ul')).toHaveCount(10);
    await expect(prose.locator('ol')).toHaveCount(2);
    await expect(prose.locator('ul').first().locator('li')).toHaveCount(5);
    await expect(prose.locator('ol').first().locator('li')).toHaveCount(4);
    await expect(prose.locator('ol').nth(1).locator('li')).toHaveCount(7);

    const bulletParagraphs = await prose.locator('p').evaluateAll((nodes) =>
      nodes.filter((node) => node.textContent?.trimStart().startsWith('●')).length,
    );
    expect(bulletParagraphs).toBe(0);

    await expect(prose.locator('strong', { hasText: 'Clear business objectives:' })).toHaveCount(1);
    await expect(prose.locator('ol').nth(1).locator('strong', { hasText: 'Assess Your Current Business Position:' })).toHaveCount(1);
  });

  test('business growth strategy article 2 semantic structure', async ({ page }) => {
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/blog/how-to-build-business-growth-strategy-step-by-step/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `overflow at ${width}px`).toBe(false);
    }

    await page.goto('/blog/how-to-build-business-growth-strategy-step-by-step/');
    const prose = page.locator('[data-article-prose]');
    await expect(page.locator('.blog-article-page h1')).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'How to Build a Business Growth Strategy in 7 Steps?' })).toHaveCount(1);
    await expect(prose.locator('h3', { hasText: 'Business Performance Assessment: Understanding Your Current Position' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'How to Choose the Right Growth Strategy Framework' })).toHaveCount(1);
    await expect(prose.locator('h2', { hasText: 'What Should a Business Growth Plan Include?' })).toHaveCount(1);
    await expect(prose.locator('blockquote')).toHaveCount(5);

    await expect(prose.locator('ul')).toHaveCount(8);
    await expect(prose.locator('ol')).toHaveCount(4);
    await expect(prose.locator('ul').first().locator('li')).toHaveCount(5);
    await expect(prose.locator('ul').nth(3).locator('li')).toHaveCount(6);
    await expect(prose.locator('ol').first().locator('li')).toHaveCount(6);
    await expect(prose.locator('ol').nth(1).locator('li')).toHaveCount(3);
    await expect(prose.locator('ol').nth(2).locator('li')).toHaveCount(5);
    await expect(prose.locator('ol').nth(3).locator('li')).toHaveCount(4);

    const bulletParagraphs = await prose.locator('p').evaluateAll((nodes) =>
      nodes.filter((node) => node.textContent?.trimStart().startsWith('●')).length,
    );
    expect(bulletParagraphs).toBe(0);

    await expect(prose.locator('ul').first().locator('strong', { hasText: 'Financial performance:' })).toHaveCount(1);
    await expect(prose.locator('ol').first().locator('strong', { hasText: 'Priority initiatives:' })).toHaveCount(1);
    await expect(prose.locator('ul').nth(6).locator('strong', { hasText: 'Market penetration:' })).toHaveCount(1);
    await expect(prose.locator('ul').nth(1).locator('strong')).toHaveCount(0);
  });

  test('business growth strategy articles share one article prose callout system', async ({ page }) => {
    for (const path of [
      '/blog/business-growth-strategy-practical-guide/',
      '/blog/how-to-build-business-growth-strategy-step-by-step/',
    ]) {
      await page.goto(path);
      const prose = page.locator('[data-article-prose].blog-article-body');
      await expect(prose).toHaveCount(1);
      await expect(prose.locator('blockquote')).toHaveCount(path.includes('practical-guide') ? 6 : 5);
      const calloutStyles = await prose.locator('blockquote').first().evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          position: styles.position,
          borderInlineStartWidth: styles.borderInlineStartWidth,
        };
      });
      expect(calloutStyles.position).toBe('relative');
      expect(Number.parseFloat(calloutStyles.borderInlineStartWidth)).toBeLessThan(2);
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
