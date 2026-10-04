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
      // Keep Blog URLs out of the sitemap until the production SEO set is expanded.
      return !url.includes('/blog/');
    }
  })],
  adapter: node({ mode: 'standalone' })
});
