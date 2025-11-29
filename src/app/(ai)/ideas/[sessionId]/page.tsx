import { IdeasAppShell } from "./_components/ideas-app-shell";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function IdeasPage({ params }: PageProps) {
  const { sessionId } = await params;

  // TODO: Fetch project name from session/project if available
  const projectName = undefined;

  return <IdeasAppShell sessionId={sessionId} projectName={projectName} />;
}
