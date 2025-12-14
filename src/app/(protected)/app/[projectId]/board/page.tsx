import { BoardPage } from "./_components/board-page";
import { createTRPCCaller } from "@/trpc/server";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectBoardPage({ params }: PageProps) {
  const { projectId } = await params;
  const caller = await createTRPCCaller();
  const response = await caller.tasks.getByProjectId({
    projectId,
  });

  if (!response?.data?.board) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load tasks</p>
      </div>
    );
  }

  return <BoardPage data={response.data.board} />;
}
