import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dr-khaledalmohamad.com/',
  output: 'server',
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        ar: 'ar'
      }
    },
    filter: (url) => {
      const excluded = url.includes('/blog/');
      if (excluded) {
        // TODO: re-enable Blog URLs in sitemap when production articles are added
      }
      return !excluded;
    }
  })],
  adapter: node({ mode: 'standalone' })
});
