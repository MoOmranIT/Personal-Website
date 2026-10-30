import { expect, test } from '@playwright/test';

test.describe('Header navigation', () => {
  test('desktop dropdown opens and closes on click', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const trigger = page.locator('button[data-dropdown="dropdown-expertise"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.nav-dropdown.open')).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop dropdown closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const trigger = page.locator('button[data-dropdown="dropdown-expertise"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop dropdown closes on outside click', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const trigger = page.locator('button[data-dropdown="dropdown-expertise"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.click(100, 400);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop dropdown link navigates and closes dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const trigger = page.locator('button[data-dropdown="dropdown-proof"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#dropdown-proof a[href="#stanford"]').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile accordion opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const header = page.locator('#menu-toggle');
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    const accordion = page.locator('button[data-accordion="accordion-expertise"]');
    await accordion.click();
    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
    await accordion.click();
    await expect(accordion).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile expertise accordion contains training link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    const accordion = page.locator('button[data-accordion="accordion-expertise"]');
    await accordion.click();
    await expect(page.locator('#accordion-expertise a[href="#training"]')).toBeAttached();
  });

  test('Blog header section links are absolute homepage URLs in EN and AR', async ({ page }) => {
    for (const { path, expectedPrefix } of [
      { path: '/blog/', expectedPrefix: '/' },
      { path: '/ar/blog/', expectedPrefix: '/ar/' }
    ]) {
      await page.goto(path);
      const sectionLinks = page.locator('#site-header a[href*="#"]');
      const hrefs = await sectionLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(hrefs.filter((href) => href?.includes('#')).every((href) => href?.startsWith(expectedPrefix))).toBe(true);
      expect(hrefs.some((href) => href === '/blog/#services' || href === '/ar/blog/#services')).toBe(false);
    }
  });

  test('Blog section links navigate from landing and article pages', async ({ page }) => {
    const clickHeaderLink = async (path: string, href: string, expected: string) => {
      await page.goto(path);
      const link = page.locator(`#site-header a[href="${href}"]`).first();
      await expect(link).toBeAttached();
      await link.evaluate((element: HTMLAnchorElement) => element.click());
      await expect.poll(() => new URL(page.url()).pathname + new URL(page.url()).hash).toBe(expected);
    };

    await page.setViewportSize({ width: 1280, height: 900 });
    await clickHeaderLink('/blog/', '/', '/');
    await clickHeaderLink('/blog/', '/#services', '/#services');
    await clickHeaderLink('/blog/', '/#about', '/#about');
    await clickHeaderLink('/blog/', '/#success', '/#success');
    await clickHeaderLink('/blog/', '/#contact', '/#contact');
    await clickHeaderLink('/blog/growth-starts-with-strategic-questions-en/', '/#ventures', '/#ventures');
    await clickHeaderLink('/ar/blog/', '/ar/', '/ar/');
    await clickHeaderLink('/ar/blog/', '/ar/#services', '/ar/#services');
    await clickHeaderLink('/ar/blog/', '/ar/#about', '/ar/#about');
    await clickHeaderLink('/ar/blog/', '/ar/#success', '/ar/#success');
    await clickHeaderLink('/ar/blog/', '/ar/#contact', '/ar/#contact');
  });

  test('mobile accordion closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const header = page.locator('#menu-toggle');
    await header.click();
    const accordion = page.locator('button[data-accordion="accordion-expertise"]');
    await accordion.click();
    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(accordion).toHaveAttribute('aria-expanded', 'false');
  });

  test('all top-level nav links exist', async ({ page }) => {
    await page.goto('/');
    const links = ['#home', '#ventures', '#about'];
    for (const href of links) {
      await expect(page.locator(`nav a[href="${href}"]`).first()).toBeAttached();
    }
  });

  test('no duplicate Ventures or About Me in desktop nav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const venturesCount = await page.locator('#site-header nav[aria-label="Primary"] a[href="#ventures"]').count();
    const aboutCount = await page.locator('#site-header nav[aria-label="Primary"] a[href="#about"]').count();
    expect(venturesCount).toBe(1);
    expect(aboutCount).toBe(1);
  });

  test('training section anchor exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#training')).toBeAttached();
  });

  test('dropdown links exist', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.locator('button[data-dropdown="dropdown-expertise"]').click();
    await expect(page.locator('#dropdown-expertise a[href="#executive-roles"]')).toBeAttached();
    await expect(page.locator('#dropdown-expertise a[href="#services"]')).toBeAttached();
    await expect(page.locator('#dropdown-expertise a[href="#training"]')).toBeAttached();
    await page.locator('button[data-dropdown="dropdown-proof"]').click();
    await expect(page.locator('#dropdown-proof a[href="#stanford"]')).toBeAttached();
    await expect(page.locator('#dropdown-proof a[href="#books"]')).toBeAttached();
    await expect(page.locator('#dropdown-proof a[href="#success"]')).toBeAttached();
    await expect(page.locator('#dropdown-proof a[href="#video-testimonials"]')).toBeAttached();
    await expect(page.locator('#dropdown-proof a[href="#professional-portfolio"]')).toBeAttached();
  });

  test('Escape inside a dropdown link closes it and restores focus to the trigger', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const trigger = page.locator('button[data-dropdown="dropdown-proof"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const link = page.locator('#dropdown-proof a[href="#stanford"]');
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('Contact CTA is never duplicated inside the header', async ({ page }) => {
    const viewports: Array<[number, number]> = [
      [320, 812],
      [375, 812],
      [640, 900],
      [768, 1024],
      [1024, 768],
      [1279, 800],
      [1280, 900],
      [1440, 900]
    ];
    for (const path of ['/', '/ar/']) {
      for (const [w, h] of viewports) {
        await page.setViewportSize({ width: w, height: h });
        await page.goto(path);
        if (w < 1280) {
          await page.locator('#menu-toggle').click();
          await expect(page.locator('#site-header a.btn-navy:visible')).toHaveCount(1);
        } else {
          await expect(page.locator('#site-header a.btn-navy:visible')).toHaveCount(1);
        }
      }
    }
  });

  test('mobile menu opens with scroll and reaches last items', async ({ page }) => {
    const viewports = [
      [320, 568],
      [360, 640],
      [375, 667],
      [390, 664],
      [430, 740]
    ];
    for (const [w, h] of viewports) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-menu')).toHaveClass(/mobile-menu-open/);

      const menu = page.locator('#mobile-menu');
      const menuHeight = await menu.evaluate((el) => el.getBoundingClientRect().height);
      expect(menuHeight).toBeGreaterThan(0);
      expect(menuHeight).toBeLessThanOrEqual(h);

      await expect(page.locator('#accordion-expertise a[href="#training"]')).toBeAttached();
      await page.locator('button[data-accordion="accordion-proof"]').click();
      await page.locator('#accordion-proof a[href="#success"]').scrollIntoViewIfNeeded();
      await expect(page.locator('#accordion-proof a[href="#success"]')).toBeVisible();
      await expect(page.locator('#mobile-menu .sm\\:hidden a[href="#contact"]')).toBeVisible();
    }
  });

  test('mobile header stays within bounds on small screens', async ({ page }) => {
    const viewports = [
      [320, 568],
      [360, 640],
      [375, 667],
      [390, 664],
      [430, 740]
    ];
    for (const [w, h] of viewports) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');

      const header = page.locator('#site-header');
      const headerBox = await header.boundingBox();
      expect(headerBox).not.toBeNull();
      expect(headerBox!.x).toBeGreaterThanOrEqual(0);
      expect(headerBox!.width).toBeLessThanOrEqual(w + 1);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      await expect(page.locator('#site-header .group')).toBeVisible();
      await expect(page.locator('#menu-toggle')).toBeVisible();
      await expect(page.locator('#site-header [data-language-switch]')).toBeVisible();
    }
  });

  test('Arabic desktop Blog link is top-level and not inside Proof dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ar/blog/');
    const blogLink = page.locator('header nav[aria-label="Primary"] a[href="/ar/blog/"]');
    await expect(blogLink).toHaveText('المدونة');
    await expect(blogLink).toHaveAttribute('aria-current', 'page');
    await expect(blogLink).not.toHaveClass(/hidden/);
    await expect(page.locator('header nav[aria-label="Primary"] > a[href="/ar/blog/"]')).toHaveCount(1);
    await expect(page.locator('#dropdown-proof a[href="/ar/blog/"]')).toHaveCount(0);
  });

  test('language switcher is compact icon-only with accessible labels', async ({ page }) => {
    const routes = [
      { path: '/', href: '/ar/', label: 'Switch language to Arabic' },
      { path: '/ar/', href: '/', label: 'Switch language to English' },
      { path: '/blog/', href: '/ar/blog/', label: 'Switch language to Arabic' },
      { path: '/ar/blog/', href: '/blog/', label: 'Switch language to English' },
      { path: '/blog/how-to-build-business-growth-strategy-step-by-step/', href: '/ar/blog/', label: 'Switch language to Arabic' },
      { path: '/blog/ai-brains-scalable-ecosystem-award/', href: '/ar/blog/ai-brains-award/', label: 'Switch language to Arabic' },
      { path: '/ar/blog/ai-brains-award/', href: '/blog/ai-brains-scalable-ecosystem-award/', label: 'Switch language to English' },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      const switcher = page.locator('#site-header [data-language-switch]');
      await expect(switcher).toHaveCount(1);
      await expect(switcher).toHaveAttribute('href', route.href);
      await expect(switcher).toHaveAttribute('aria-label', route.label);
      await expect(switcher.locator('svg')).toHaveCount(1);
      await expect(switcher).not.toContainText('English');
      await expect(switcher).not.toContainText('العربية');
      await expect(switcher).not.toContainText('EN');
      await expect(switcher).not.toContainText('AR');
      await expect(switcher.locator('text=🇬🇧')).toHaveCount(0);
      await expect(switcher.locator('text=🇸🇦')).toHaveCount(0);
      const box = await switcher.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(34);
      expect(box!.width).toBeLessThanOrEqual(40);
      await switcher.focus();
      await expect(switcher).toBeFocused();
    }
  });

  test('desktop header spacing keeps Blog separated from Contact CTA', async ({ page }) => {
    const viewports = [1280, 1366, 1440, 1600, 1920];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const blog = page.locator('#site-header nav[aria-label="Primary"] a[href="/blog/"]');
      const contact = page.locator('#site-header a.btn-navy').first();
      await expect(blog).toBeVisible();
      await expect(contact).toBeVisible();
      const blogBox = await blog.boundingBox();
      const contactBox = await contact.boundingBox();
      expect(blogBox).not.toBeNull();
      expect(contactBox).not.toBeNull();
      expect(contactBox!.x - (blogBox!.x + blogBox!.width)).toBeGreaterThanOrEqual(10);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/ar/');
      const blog = page.locator('#site-header nav[aria-label="Primary"] a[href="/ar/blog/"]');
      const contact = page.locator('#site-header a.btn-navy').first();
      const blogBox = await blog.boundingBox();
      const contactBox = await contact.boundingBox();
      expect(blogBox).not.toBeNull();
      expect(contactBox).not.toBeNull();
      const separation = Math.max(
        contactBox!.x - (blogBox!.x + blogBox!.width),
        blogBox!.x - (contactBox!.x + contactBox!.width),
      );
      expect(separation).toBeGreaterThanOrEqual(10);
    }
  });

  test('shared brand mark replaces KM badges in header and footer', async ({ page }) => {
    await page.goto('/');
    const headerMark = page.locator('#site-header [data-brand-mark]');
    await expect(headerMark).toHaveCount(1);
    await expect(headerMark.locator('img')).toHaveAttribute('src', '/brand/dr-khaled-monogram-dark.webp');
    await expect.poll(() => headerMark.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('#site-header')).not.toContainText(/^KM$/);
    await expect(page.locator('#site-header')).toContainText('Dr. Khaled Al Mohammad');
    const footerMark = page.locator('footer [data-brand-mark]');
    await expect(footerMark).toHaveCount(1);
    await expect(footerMark.locator('img')).toHaveAttribute('src', '/brand/dr-khaled-monogram-light.webp');
    await expect.poll(() => footerMark.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('footer')).not.toContainText(/^KM$/);
    await expect(page.locator('#home img[alt*="Dr. Khaled Al Mohammad"]')).toHaveCount(1);
    const executive = page.locator('[data-executive-brand-mark]');
    await expect(executive).toHaveCount(1);
    await expect(executive.locator('[data-brand-mark] img')).toHaveAttribute('src', '/brand/dr-khaled-monogram-light.webp');
  });

  test('executive brand mark respects reduced motion without errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-executive-brand-mark]')).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
