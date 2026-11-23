import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import { workProjects } from "@/content/projects";

/** Home plus every case study. Built from content, so new projects appear on their own. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...workProjects.map((p) => ({
      url: `${BASE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
