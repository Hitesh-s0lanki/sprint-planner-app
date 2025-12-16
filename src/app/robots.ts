import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sprintplanner.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/investors",
          "/ideas",
          "/sign-in",
          "/sign-up",
        ],
        disallow: ["/api/", "/app/", "/onboarding/", "/_next/", "/trpc/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
