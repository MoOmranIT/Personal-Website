import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'ar']),
    translationKey: z.string(),
    excerpt: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().positive().optional(),
    indexable: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
