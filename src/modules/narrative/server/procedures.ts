import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllNarrativeSections,
  updateNarrativeSection,
  createNarrativeSection,
} from "./actions";
import type { NarrativeSectionType, NarrativeCategory } from "../types";
import { getUserByClerkId } from "@/modules/auth/server/actions";
import { getProjectById } from "@/modules/projects/server/actions";
import { apiResponse } from "@/lib/handler";

export const narrativeRouter = createTRPCRouter({
  getAll: protectedProcedure
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

        // Verify user has access to the project
        const project = await getProjectById(input.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this project",
          });
        }

        // Get all narrative sections for the project
        const sections = await getAllNarrativeSections(input.projectId);

        return apiResponse("Narrative sections fetched successfully", 200, {
          sections,
        });
      } catch (error) {
        console.error("Error in getAll narrative procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch narrative sections",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        sectionId: z.string().uuid("Invalid section ID format"),
        name: z.string().optional(),
        content: z.string().optional(),
        position: z.number().optional(),
        type: z.enum(["text", "files"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the current user from the database using Clerk ID
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Get the section to verify it exists and get projectId
        const { sectionId, ...updates } = input;

        // We need to check the section exists and user has access
        // For now, we'll update and let the action handle errors
        const updatedSection = await updateNarrativeSection(sectionId, updates);

        // Verify user has access to the project
        const project = await getProjectById(updatedSection.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this section",
          });
        }

        return apiResponse("Narrative section updated successfully", 200, {
          section: updatedSection,
        });
      } catch (error) {
        console.error("Error in update narrative procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update narrative section",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid("Invalid project ID format"),
        category: z.enum([
          "narrative",
          "product",
          "engineering",
          "administrative",
          "people_hr",
          "gtm",
          "funding",
          "tools",
        ]),
        name: z
          .string()
          .min(1, "Name is required")
          .max(200, "Name is too long"),
        type: z.enum(["text", "files"]).default("text"),
        content: z.string().optional().default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the current user from the database using Clerk ID
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Verify user has access to the project
        const project = await getProjectById(input.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this project",
          });
        }

        // Create the section
        const section = await createNarrativeSection(
          input.projectId,
          input.category as NarrativeCategory,
          input.name,
          input.type as NarrativeSectionType,
          input.content || ""
        );

        return apiResponse("Narrative section created successfully", 201, {
          section,
        });
      } catch (error) {
        console.error("Error in create narrative procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create narrative section",
        });
      }
    }),
});
