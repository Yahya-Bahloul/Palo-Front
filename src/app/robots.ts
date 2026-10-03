import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/room", "/setup", "/login", "/purchases"],
    },
    sitemap: "https://blaafy.com/sitemap.xml",
  };
}
