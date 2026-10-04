import { getCollection } from 'astro:content';
import { siteConfig } from '../scripts/siteConfig';

export const prerender = true;

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export async function GET() {
  const articles = await getCollection('blog', ({ data }) => !data.draft && data.indexable);
  const urls = articles
    .map((article) => {
      const path = article.data.lang === 'ar'
        ? `ar/blog/${article.data.slug}/`
        : `blog/${article.data.slug}/`;
      const loc = `${siteConfig.url}${path}`;
      const lastmod = article.data.publishedAt.toISOString().slice(0, 10);
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .sort((a, b) => a.localeCompare(b));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>'
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
