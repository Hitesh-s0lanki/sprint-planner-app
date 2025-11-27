// app/app/[projectId]/board/page.tsx

import { BoardPage } from "@/features/board/board-page";
import { boardMock } from "@/features/board/board-mock";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectBoardPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: _params,
}: PageProps) {
  // later: _params.projectId -> fetch real data
  return <BoardPage data={boardMock} />;
}

