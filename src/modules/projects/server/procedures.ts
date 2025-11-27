import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getAllProjects, getProjectById } from "./actions";
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

  getById: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid("Invalid project ID format"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get the current user from the database using Clerk ID
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Get project by ID
        const project = await getProjectById(input.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        // Optional: Verify user has access to this project
        // For now, we'll allow if user is the lead or if we want to add more access control later
        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this project",
          });
        }

        return apiResponse("Project fetched successfully", 200, { item: project });
      } catch (error) {
        console.error("Error in getById projects procedure:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch project",
        });
      }
    }),
});

