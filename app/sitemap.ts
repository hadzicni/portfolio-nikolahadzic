import type { MetadataRoute } from "next"

import { profile } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.website,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
