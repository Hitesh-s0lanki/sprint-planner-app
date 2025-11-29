import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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
