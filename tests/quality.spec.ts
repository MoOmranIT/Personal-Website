import { expect, test } from '@playwright/test';

const LOCALES = [
  { path: '/', dir: 'ltr', label: 'EN' },
  { path: '/ar/', dir: 'rtl', label: 'AR' }
];

const VIEWPORTS = [
  { w: 320, h: 812 },
  { w: 360, h: 800 },
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 414, h: 896 },
  { w: 430, h: 932 },
  { w: 640, h: 900 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1279, h: 800 },
  { w: 1280, h: 900 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 }
];

test.describe('Responsive + console QA across viewports', () => {
  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS) {
      test(`${locale.label} ${vp.w}x${vp.h} — loads clean, no overflow`, async ({ page }) => {
        const consoleErrors: string[] = [];
        const failedLocal: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('response', (res) => {
          if (res.url().startsWith('http://localhost:4321') && res.status() >= 400) {
            failedLocal.push(`${res.status()} ${res.url()}`);
          }
        });

        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(locale.path);
        await page.waitForLoadState('load');
        await page.waitForTimeout(700);

        await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
        for (const id of ['home', 'services', 'about', 'books', 'success', 'contact']) {
          await expect(page.locator(`#${id}`)).toBeAttached();
        }
        if (locale.label === 'EN') {
          await expect(page.locator('#training')).toBeAttached();
          await expect(page.locator('#video-testimonials')).toBeAttached();
        }

        // No horizontal scroll (document width should not exceed viewport)
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow).toBeLessThanOrEqual(1);

        expect(failedLocal, `failed local requests: ${failedLocal.join(', ')}`).toEqual([]);
        expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
      });
    }
  }
});

test.describe('Interaction QA', () => {
  test('mobile menu opens, closes with Escape, and toggles hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const toggle = page.locator('#menu-toggle');
    await toggle.click();
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu')).toHaveClass(/mobile-menu-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu closes when tapping outside', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.click(200, 500);
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('language switch goes to the other locale', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[aria-label="Switch to العربية"]').click();
    await expect(page).toHaveURL(/\/ar\/$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('success story modal opens with hero image and closes on Escape', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.flip-card').first();
    await card.hover();
    const openBtn = card.locator('.story-open-btn');
    await openBtn.click();
    await expect(page.locator('#story-modal')).toHaveAttribute('aria-hidden', 'false');
    const hero = page.locator('#story-modal-image');
    expect(await hero.getAttribute('src')).toBeTruthy();
    await page.keyboard.press('Escape');
    await expect(page.locator('#story-modal')).toHaveAttribute('aria-hidden', 'true');
  });

  test('contact links carry correct mailto / whatsapp targets', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#contact a[href^="mailto:"]')).toBeAttached();
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toHaveAttribute('target', '_blank');
    await expect(wa).toHaveAttribute('rel', /noopener/);
  });

  test('targeted images decode successfully', async ({ page }) => {
    const failedLocal: string[] = [];
    page.on('response', (res) => {
      if (res.url().startsWith('http://localhost:4321') && res.status() >= 400) {
        failedLocal.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto('/');
    const images = page.locator('img[src^="/images/"]');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    for (let index = 0; index < imageCount; index += 1) {
      const img = images.nth(index);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((element) => ({
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight
      }))).toEqual({ complete: true, naturalWidth: expect.any(Number), naturalHeight: expect.any(Number) });
      await expect.poll(() => img.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
      await expect.poll(() => img.evaluate((element) => element.naturalHeight)).toBeGreaterThan(0);
    }

    expect(failedLocal, `failed local requests: ${failedLocal.join(', ')}`).toEqual([]);
  });

  test('training gallery images load successfully', async ({ page }) => {
    const failedLocal: string[] = [];
    page.on('response', (res) => {
      if (res.url().startsWith('http://localhost:4321') && res.status() >= 400) {
        failedLocal.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto('/');
    const images = page.locator('#training .training-gallery img');
    await expect(images).toHaveCount(5);

    for (let index = 0; index < await images.count(); index += 1) {
      const img = images.nth(index);
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('decoding', 'async');
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((element) => ({
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight
      }))).toEqual({ complete: true, naturalWidth: expect.any(Number), naturalHeight: expect.any(Number) });
      await expect.poll(() => img.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
      await expect.poll(() => img.evaluate((element) => element.naturalHeight)).toBeGreaterThan(0);
    }

    expect(failedLocal, `failed local requests: ${failedLocal.join(', ')}`).toEqual([]);
  });
});

test.describe('Utility elements', () => {
  test('back-to-top and whatsapp floating buttons exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#back-to-top')).toBeAttached();
    await expect(page.locator('a.float-wa')).toBeAttached();
  });

  test('skip link present and focused on Tab', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a.skip-link');
    await expect(skip).toBeAttached();
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
  });
});
