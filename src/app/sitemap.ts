import type { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartavia.vercel.app';
  const supabase = await createClient();

  // Define static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/planner`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  // Fetch dynamic routes (Destinations)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: destinations } = await supabase
      .from('destinations')
      .select('id, updated_at');

    if (destinations) {
      dynamicRoutes = destinations.map((dest) => ({
        url: `${baseUrl}/detail/${dest.id}`,
        lastModified: new Date(dest.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch destinations for sitemap", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
