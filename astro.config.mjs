import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.drkhaledalmohamad.com/',
  integrations: [tailwind()],
  adapter: node({ mode: 'standalone' })
});
