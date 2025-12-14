import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Production Analytics Component
 *
 * This component only renders analytics tools in Vercel production environment.
 * Add any new analytics or monitoring tools here.
 *
 * Note: Vercel automatically sets VERCEL_ENV to "production" in production deployments.
 * This component checks for that environment variable to ensure analytics only
 * run in Vercel production, not in preview or development environments.
 */
export function ProductionAnalytics() {
  // Only render in Vercel production environment
  // VERCEL_ENV is automatically set by Vercel and can be:
  // - "production" (production deployments)
  // - "preview" (preview deployments)
  // - "development" (local development)
  const isVercelProduction = process.env.VERCEL_ENV === "production";

  if (!isVercelProduction) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
