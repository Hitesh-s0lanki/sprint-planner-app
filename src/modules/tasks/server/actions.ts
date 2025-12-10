import { boardMock } from "@/features/board/board-mock";

/**
 * Get board mock data (demo tasks)
 * @returns Board mock data with tasks
 */
export async function getBoardMockData() {
  try {
    return boardMock;
  } catch (error) {
    console.error("Error fetching board mock data:", error);
    throw new Error("Failed to fetch board mock data");
  }
}









