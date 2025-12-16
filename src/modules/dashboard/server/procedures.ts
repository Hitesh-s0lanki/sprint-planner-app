import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDashboardData } from "./actions";
import { getUserByClerkId } from "@/modules/auth/server/actions";
import { apiResponse } from "@/lib/handler";

export const dashboardRouter = createTRPCRouter({
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        // Get the current user from the database using Clerk ID
        const user = await getUserByClerkId(ctx.auth.userId);
        const userId = user?.id;

        const dashboardData = await getDashboardData(input.projectId, userId);

        return apiResponse("Dashboard data fetched successfully", 200, {
          dashboard: dashboardData,
        });
      } catch (error) {
        console.error("Error in getByProjectId procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch dashboard data",
        });
      }
    }),
});



