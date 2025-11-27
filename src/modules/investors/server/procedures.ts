import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getInvestorSummary,
  getInvestorConversations,
  getConversationMessagesWithUpdates,
  sendInvestorMessage,
  markConversationRead,
} from "./actions";
import { getUserByClerkId } from "@/modules/auth/server/actions";
import { getProjectById } from "@/modules/projects/server/actions";
import { apiResponse } from "@/lib/handler";

export const investorsRouter = createTRPCRouter({
  getSummary: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid("Invalid project ID format"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

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

        const summary = await getInvestorSummary(input.projectId);

        return apiResponse("Investor summary fetched successfully", 200, {
          item: summary,
        });
      } catch (error) {
        console.error("Error in getSummary procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch investor summary",
        });
      }
    }),

  getConversations: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid("Invalid project ID format"),
        interestLevel: z.enum(["high", "warm", "exploring"]).optional(),
        sortBy: z.enum(["recent", "highest_interest", "oldest"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

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

        const conversations = await getInvestorConversations(
          input.projectId,
          {
            interestLevel: input.interestLevel,
            sortBy: input.sortBy,
          }
        );

        return apiResponse("Conversations fetched successfully", 200, {
          items: conversations,
        });
      } catch (error) {
        console.error("Error in getConversations procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch conversations",
        });
      }
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid("Invalid conversation ID format"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const messages = await getConversationMessagesWithUpdates(
          input.conversationId
        );

        return apiResponse("Messages fetched successfully", 200, {
          items: messages,
        });
      } catch (error) {
        console.error("Error in getMessages procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch messages",
        });
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid("Invalid conversation ID format"),
        body: z.string().min(1, "Message body is required"),
        tags: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const message = await sendInvestorMessage(
          input.conversationId,
          input.body,
          input.tags
        );

        return apiResponse("Message sent successfully", 200, {
          item: message,
        });
      } catch (error) {
        console.error("Error in sendMessage procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
        });
      }
    }),

  markRead: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid("Invalid conversation ID format"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await markConversationRead(input.conversationId);

        return apiResponse("Conversation marked as read", 200);
      } catch (error) {
        console.error("Error in markRead procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark conversation as read",
        });
      }
    }),
});

