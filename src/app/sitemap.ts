import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://snipkit.bharatpanigrahi.com';

  // Fetch all public code snippets with their user's username
  const codes = await db.code.findMany({
    where: {
      access: 'public',
    },
    select: {
      slug: true,
      updatedAt: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  const codeEntries: MetadataRoute.Sitemap = codes
    .filter(code => code.user) // Ensure user relationship exists
    .map(code => ({
      url: `${siteUrl}/code/${code.user!.username}/${code.slug}`,
      lastModified: code.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${siteUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  return [...staticPages, ...codeEntries];
} 