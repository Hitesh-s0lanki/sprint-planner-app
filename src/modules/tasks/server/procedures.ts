import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { getBoardMockData } from "./actions";
import { apiResponse } from "@/lib/handler";

export const tasksRouter = createTRPCRouter({
  getBoardMock: protectedProcedure.query(async () => {
    try {
      const boardData = await getBoardMockData();

      return apiResponse("Board mock data fetched successfully", 200, {
        board: boardData,
      });
    } catch (error) {
      console.error("Error in getBoardMock procedure:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch board mock data",
      });
    }
  }),
});
