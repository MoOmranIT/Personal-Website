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
      await expect(page.locator('#site-header a[href$="/ar/"]')).toBeVisible();
    }
  });
});
