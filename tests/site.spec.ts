import { expect, test } from '@playwright/test';

test.describe('Bilingual pages', () => {
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

  test('video testimonials render 4 posters and open modal on click', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#video-testimonials')).toBeAttached();
    const triggers = page.locator('#video-testimonials .video-testimonial-tile');
    await expect(triggers).toHaveCount(4);

    const posters = page.locator('#video-testimonials .video-testimonial-tile img');
    await expect(posters).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
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
