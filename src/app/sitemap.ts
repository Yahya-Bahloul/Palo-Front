import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://blaafy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-03");
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy.html`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms.html`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
