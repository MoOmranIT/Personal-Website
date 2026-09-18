import { expect, test } from '@playwright/test';

test.describe('Bilingual pages', () => {
  test('English homepage renders main sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dr\. Khaled Al Mohammad/i);
    for (const id of ['home', 'services', 'training', 'about', 'books', 'success', 'contact']) {
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
    const cta = page.locator('#training a[download="Dr-Khaled-Al-Mohammad-Training-Profile.pdf"]');
    await expect(cta).toHaveAttribute('href', '/downloads/dr-khaled-al-mohammad-training-profile.pdf');

    const response = await request.get('/downloads/dr-khaled-al-mohammad-training-profile.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const downloadPromise = page.waitForEvent('download');
    await cta.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Dr-Khaled-Al-Mohammad-Training-Profile.pdf');
  });
});
