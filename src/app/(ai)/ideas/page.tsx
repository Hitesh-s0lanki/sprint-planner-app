import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Start Your Venture Sprint – SprintPlanner",
  description:
    "Start your first 4-week venture sprint with SprintPlanner. Turn your ideas into executable ventures with a structured framework designed for builders.",
  path: "/ideas",
  image: "/og-ideas.png", // Recommended: Create a 1200x630px OG image
  imageAlt: "Start Your Venture Sprint with SprintPlanner",
  keywords: [
    "start venture sprint",
    "idea execution",
    "4-week sprint",
    "venture planning",
    "idea validation",
  ],
});

export default async function IdeasPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sprint-planner-session-id")?.value;

  // If cookie exists -> redirect to /ideas/{sessionId}
  if (sessionId) {
    redirect(`/ideas/${sessionId}`);
  }

  // Optional fallback (rare case where cookie not set yet)
  return <div>Loading...</div>;
}
