import type { MetadataRoute } from 'next';
import { SCHOOLS } from '@/data/schools';

const SITE_URL = 'https://zhumenglonge.github.io/ncee';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'schools/', 'drill/', 'wrong/', 'textbooks/', 'guide/'].map((path) => ({
    url: `${SITE_URL}/${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const schools = SCHOOLS.map((school) => ({
    url: `${SITE_URL}/schools/${school.id}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pages, ...schools];
}
