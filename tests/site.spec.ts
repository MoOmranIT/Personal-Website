import { expect, test } from '@playwright/test';

test.describe('Bilingual pages', () => {
  test('English homepage renders main sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dr\. Khaled Al Mohammad/i);
    for (const id of ['home', 'services', 'about', 'books', 'success', 'contact']) {
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
});

test.describe('Contact API', () => {
  // Unique simulated client IPs per test so the server-side rate limiter
  // (keyed on x-forwarded-for) never blocks repeated test runs.
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '',
    role: '',
    message: 'Hello, this is a test message.',
    website: ''
  };
  const uniqueIp = (n: number) => `203.0.113.${n}`;

  test('GET returns 405', async ({ request }) => {
    const response = await request.get('/api/contact');
    expect(response.status()).toBe(405);
  });

  test('rejects invalid body', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: 'not-json',
      headers: { 'x-forwarded-for': uniqueIp(10) }
    });
    expect(response.status()).toBe(400);
  });

  test('rejects missing fields', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { name: '', email: 'bad', message: '' },
      headers: { 'x-forwarded-for': uniqueIp(11) }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('honeypot catches bots', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { ...validPayload, website: 'http://spam.example' },
      headers: { 'x-forwarded-for': uniqueIp(12) }
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/spam/i);
  });

  test('rejects cross-site origins', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: validPayload,
      headers: { Origin: 'https://evil.example', 'x-forwarded-for': uniqueIp(13) }
    });
    expect(response.status()).toBe(403);
  });
});