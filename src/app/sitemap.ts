import type { MetadataRoute } from "next";
import { pains } from "@/lib/pains";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/kizu`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/ops`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...pains.map((pain) => ({
      url: `${SITE.url}/kizu/${pain.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
