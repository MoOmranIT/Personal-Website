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
      expect(contactBox!.x - (blogBox!.x + blogBox!.width)).toBeGreaterThanOrEqual(12);
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
      expect(separation).toBeGreaterThanOrEqual(12);
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

  test('header controls stay inside the bar across the responsive matrix', async ({ page }) => {
    const widths = [320, 375, 390, 430, 768, 1024, 1279, 1280, 1366, 1440, 1600, 1920];

    for (const path of ['/', '/ar/']) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const metrics = await page.evaluate(() => {
          const bar = document.querySelector('[data-header-bar]') as HTMLElement;
          const barBox = bar.getBoundingClientRect();
          const nodes = [
            '[data-brand-mark]',
            '[data-header-name]',
            '[data-header-subtitle]',
            '[data-language-switch]',
            '#menu-toggle',
            'nav[aria-label="Primary"]',
            '[data-nav-blog]',
            '#site-header a.btn-navy',
          ].map((selector) => {
            const el = document.querySelector(selector) as HTMLElement | null;
            if (!el) return null;
            const box = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            const visible = style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
            return { selector, visible, box };
          });
          const brand = document.querySelector('[data-header-brand]')!.getBoundingClientRect();
          const actions = document.querySelector('[data-header-actions]')!.getBoundingClientRect();
          const name = document.querySelector('[data-header-name]') as HTMLElement;
          return {
            overflow: document.documentElement.scrollWidth - window.innerWidth,
            bar: { top: barBox.top, bottom: barBox.bottom, left: barBox.left, right: barBox.right },
            nodes,
            overlap: !(brand.right <= actions.left + 0.5 || actions.right <= brand.left + 0.5),
            nameOverflow: name.scrollWidth - name.clientWidth,
          };
        });

        expect(metrics.overflow, `${path} ${width}`).toBeLessThanOrEqual(1);
        expect(metrics.overlap, `${path} ${width}`).toBe(false);
        expect(metrics.nameOverflow, `${path} ${width}`).toBeLessThanOrEqual(1);
        expect(metrics.bar.left).toBeGreaterThanOrEqual(-1);
        expect(metrics.bar.right).toBeLessThanOrEqual(width + 1);

        for (const node of metrics.nodes) {
          if (!node?.visible) continue;
          expect(node.box.top, `${path} ${width} ${node.selector}`).toBeGreaterThanOrEqual(metrics.bar.top - 1);
          expect(node.box.bottom, `${path} ${width} ${node.selector}`).toBeLessThanOrEqual(metrics.bar.bottom + 1);
          expect(node.box.left, `${path} ${width} ${node.selector}`).toBeGreaterThanOrEqual(-1);
          expect(node.box.right, `${path} ${width} ${node.selector}`).toBeLessThanOrEqual(width + 1);
        }

        const menu = metrics.nodes.find((node) => node?.selector === '#menu-toggle');
        const nav = metrics.nodes.find((node) => node?.selector === 'nav[aria-label="Primary"]');
        if (width < 1280) {
          expect(menu?.visible, `${path} ${width} menu`).toBe(true);
          expect(nav?.visible, `${path} ${width} nav`).toBe(false);
        } else {
          expect(menu?.visible, `${path} ${width} menu`).toBe(false);
          expect(nav?.visible, `${path} ${width} nav`).toBe(true);
        }
      }
    }
  });

  test('mobile doctor name stays readable and the subtitle yields only on the narrowest phones', async ({ page }) => {
    const widths = [320, 360, 375, 390, 412, 430];

    for (const path of ['/', '/ar/']) {
      const expectedName = path === '/ar/' ? 'د. خالد المحمد' : 'Dr. Khaled Al Mohammad';
      for (const width of widths) {
        await page.setViewportSize({ width, height: 700 });
        await page.goto(path);
        const metrics = await page.evaluate(() => {
          const name = document.querySelector('[data-header-name]') as HTMLElement;
          const subtitle = document.querySelector('[data-header-subtitle]') as HTMLElement;
          const nameStyle = getComputedStyle(name);
          const lang = document.querySelector('[data-language-switch]')!.getBoundingClientRect();
          const menu = document.querySelector('#menu-toggle')!.getBoundingClientRect();
          return {
            text: name.textContent?.trim() ?? '',
            font: parseFloat(nameStyle.fontSize),
            whiteSpace: nameStyle.whiteSpace,
            textOverflow: nameStyle.textOverflow,
            nameOverflow: name.scrollWidth - name.clientWidth,
            subtitleHidden: getComputedStyle(subtitle).display === 'none',
            lang: Math.round(lang.width),
            menu: Math.round(menu.width),
          };
        });

        expect(metrics.text, `${path} ${width}`).toBe(expectedName);
        expect(metrics.font, `${path} ${width}`).toBeGreaterThanOrEqual(12);
        expect(metrics.whiteSpace, `${path} ${width}`).toBe('nowrap');
        expect(metrics.textOverflow, `${path} ${width}`).not.toBe('ellipsis');
        expect(metrics.nameOverflow, `${path} ${width}`).toBeLessThanOrEqual(1);
        expect(metrics.lang, `${path} ${width}`).toBeGreaterThanOrEqual(36);
        expect(metrics.menu, `${path} ${width}`).toBeGreaterThanOrEqual(40);
        expect(metrics.subtitleHidden, `${path} ${width}`).toBe(width < 360);
      }
    }
  });

  test('desktop Blog link keeps an editorial marker without changing its name', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const blog = page.locator('#site-header [data-nav-blog]');
    await expect(blog).toHaveClass(/nav-link--blog/);
    await expect(blog).toHaveText('Blog');
    expect((await blog.textContent())?.trim()).toBe('Blog');

    await page.goto('/blog/');
    await expect(page.locator('#site-header [data-nav-blog]')).toHaveAttribute('aria-current', 'page');

    await page.goto('/ar/');
    const arBlog = page.locator('#site-header [data-nav-blog]');
    await expect(arBlog).toHaveClass(/nav-link--blog/);
    await expect(arBlog).toHaveText('المدونة');
    expect((await arBlog.textContent())?.trim()).toBe('المدونة');
  });

  test('shared hero portrait uses the responsive WebP set in both languages', async ({ page }) => {
    for (const path of ['/', '/ar/']) {
      await page.setViewportSize({ width: 1440, height: 900 });
      const failed: string[] = [];
      page.on('response', (response) => {
        if (response.url().includes('/images/hero-dr-khaled') && response.status() >= 400) {
          failed.push(`${response.status()} ${response.url()}`);
        }
      });
      await page.goto(path);
      const img = page.locator('#home img.hero-portrait');
      await expect(img).toHaveCount(1);
      await expect(img).toHaveAttribute('src', '/images/hero-dr-khaled-800.webp');
      const srcset = await img.getAttribute('srcset');
      expect(srcset).toContain('/images/hero-dr-khaled-480.webp 480w');
      expect(srcset).toContain('/images/hero-dr-khaled.webp 1013w');
      await expect(img).toHaveAttribute('sizes', '(min-width: 768px) 28rem, calc(100vw - 2.5rem)');
      await expect(img).toHaveAttribute('width', '800');
      await expect(img).toHaveAttribute('height', '809');
      const decoded = await img.evaluate(async (element) => {
        const image = element as HTMLImageElement;
        const probe = new Image();
        probe.src = image.currentSrc || image.src;
        await probe.decode();
        const frame = image.getBoundingClientRect();
        return {
          width: probe.naturalWidth,
          height: probe.naturalHeight,
          displayed: frame.width > 0 && frame.height > 0,
          inside: frame.width <= window.innerWidth + 1,
        };
      });
      expect([480, 640, 800, 960, 1013]).toContain(decoded.width);
      expect(decoded.height).toBeGreaterThan(0);
      expect(decoded.displayed).toBe(true);
      expect(decoded.inside).toBe(true);
      await expect(page.locator('[data-executive-brand-mark]')).toHaveCount(1);
      await expect(page.locator('#home img.hero-portrait')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      expect(failed).toEqual([]);
    }
  });
});
