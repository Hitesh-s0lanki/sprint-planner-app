import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from "./actions";
import { getUserByClerkId } from "@/modules/auth/server/actions";
import { getProjectById } from "@/modules/projects/server/actions";
import { createDocumentSchema, updateDocumentSchema } from "../schema";
import { apiResponse } from "@/lib/handler";

export const documentsRouter = createTRPCRouter({
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

        // Get all documents for the project
        const documents = await getAllDocuments(input.projectId);

        return apiResponse("Documents fetched successfully", 200, {
          items: documents,
        });
      } catch (error) {
        console.error("Error in getAll documents procedure:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch documents",
        });
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        documentId: z.string().uuid("Invalid document ID format"),
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

        // Get document by ID
        const document = await getDocumentById(input.documentId);

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Check if document has a project ID
        if (!document.projectId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Document is not associated with a project",
          });
        }

        // Verify user has access to the project
        const project = await getProjectById(document.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this document",
          });
        }

        return apiResponse("Document fetched successfully", 200, {
          item: document,
        });
      } catch (error) {
        console.error("Error in getById documents procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch document",
        });
      }
    }),

  create: protectedProcedure
    .input(createDocumentSchema)
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

        // Create the document
        const document = await createDocument(input);

        return apiResponse("Document created successfully", 201, {
          item: document,
        });
      } catch (error) {
        console.error("Error in create document procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create document",
        });
      }
    }),

  update: protectedProcedure
    .input(updateDocumentSchema)
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

        // Get the existing document
        const existingDocument = await getDocumentById(input.id);

        if (!existingDocument) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Check if document has a project ID
        if (!existingDocument.projectId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Document is not associated with a project",
          });
        }

        // Verify user has access to the project
        const project = await getProjectById(existingDocument.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this document",
          });
        }

        // Update the document
        const document = await updateDocument(input);

        return apiResponse("Document updated successfully", 200, {
          item: document,
        });
      } catch (error) {
        console.error("Error in update document procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update document",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        documentId: z.string().uuid("Invalid document ID format"),
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

        // Get the existing document
        const existingDocument = await getDocumentById(input.documentId);

        if (!existingDocument) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Check if document has a project ID
        if (!existingDocument.projectId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Document is not associated with a project",
          });
        }

        // Verify user has access to the project
        const project = await getProjectById(existingDocument.projectId);

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        if (project.leadUserId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this document",
          });
        }

        // Delete the document (soft delete - moves to trash)
        const document = await deleteDocument(input.documentId);

        return apiResponse("Document deleted successfully", 200, {
          item: document,
        });
      } catch (error) {
        console.error("Error in delete document procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete document",
        });
      }
    }),
});
