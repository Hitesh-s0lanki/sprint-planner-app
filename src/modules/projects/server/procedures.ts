import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { getAllProjects } from "./actions";
import { getUserByClerkId } from "@/modules/auth/server/actions";
import { apiResponse } from "@/lib/handler";

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get the current user from the database using Clerk ID
      const user = await getUserByClerkId(ctx.auth.userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get all projects for the current user
      const projects = await getAllProjects(user.id);

      return apiResponse("Projects fetched successfully", 200, { items: projects });
    } catch (error) {
      console.error("Error in getAll projects procedure:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch projects",
      });
    }
  }),
});

