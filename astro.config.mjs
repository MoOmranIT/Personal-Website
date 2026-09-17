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
    }
  })],
  adapter: node({ mode: 'standalone' })
});
