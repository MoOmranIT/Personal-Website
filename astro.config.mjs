import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.drkhaledalmohamad.com/',
  integrations: [tailwind(), sitemap()],
  adapter: node({ mode: 'standalone' })
});
