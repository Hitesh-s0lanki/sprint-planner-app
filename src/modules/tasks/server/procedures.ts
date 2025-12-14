import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getTasksByProjectId,
  updateTask,
  deleteTask,
  updateSubtaskStatus,
  getAllUsers,
  createTask,
  type BoardData,
  type BoardTask,
} from "./actions";
import { apiResponse } from "@/lib/handler";
import { getUserByClerkId } from "@/modules/auth/server/actions";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().nullable().optional(),
        status: z
          .enum(["backlog", "todo", "in_progress", "done", "cancelled"])
          .optional(),
        priority: z.enum(["Low", "Medium", "High"]).optional(),
        assigneeId: z.string().uuid().nullable().optional(),
        dueDate: z.string().nullable().optional(),
        timelineDays: z.number().nullable().optional(),
        sprintWeek: z.number().nullable().optional(),
        parentTaskId: z.string().uuid().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Get the current user from the database using Clerk ID
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const createdTask = await createTask(input.projectId, user.id, {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          timelineDays: input.timelineDays,
          sprintWeek: input.sprintWeek,
          parentTaskId: input.parentTaskId,
        });

        return apiResponse("Task created successfully", 201, {
          task: createdTask,
        });
      } catch (error) {
        console.error("Error in create procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create task",
        });
      }
    }),

  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const boardData = await getTasksByProjectId(input.projectId);

        return apiResponse("Tasks fetched successfully", 200, {
          board: boardData,
        });
      } catch (error) {
        console.error("Error in getByProjectId procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch tasks",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        title: z.string().optional(),
        status: z
          .enum(["backlog", "todo", "in_progress", "done", "cancelled"])
          .optional(),
        priority: z.enum(["Low", "Medium", "High"]).optional(),
        assigneeId: z.string().uuid().nullable().optional(),
        dueDate: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        timelineDays: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { taskId, ...updates } = input;
        const updatedTask = await updateTask(taskId, {
          ...updates,
          dueDate: updates.dueDate
            ? new Date(updates.dueDate)
            : updates.dueDate === null
            ? null
            : undefined,
        });

        return apiResponse("Task updated successfully", 200, {
          task: updatedTask,
        });
      } catch (error) {
        console.error("Error in update procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update task",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        await deleteTask(input.taskId);

        return apiResponse("Task deleted successfully", 200);
      } catch (error) {
        console.error("Error in delete procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete task",
        });
      }
    }),

  updateSubtaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        status: z.enum(["backlog", "todo", "in_progress", "done", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateSubtaskStatus(input.taskId, input.status);

        return apiResponse("Subtask status updated successfully", 200);
      } catch (error) {
        console.error("Error in updateSubtaskStatus procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update subtask status",
        });
      }
    }),

  getAllUsers: protectedProcedure.query(async () => {
    try {
      const users = await getAllUsers();

      return apiResponse("Users fetched successfully", 200, {
        users,
      });
    } catch (error) {
      console.error("Error in getAllUsers procedure:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      });
    }
  }),

  getBoardMock: protectedProcedure.query(async () => {
    try {
      // Mock board data for testing
      const mockTasks: BoardTask[] = [
        {
          id: "mock-task-1",
          key: "SP-1",
          title: "Setup project infrastructure",
          status: "done",
          priority: "High",
          description: "Set up the basic project structure and configuration",
          parentTaskId: null,
          dueDate: new Date("2025-11-15"),
        },
        {
          id: "mock-task-2",
          key: "SP-2",
          title: "Implement authentication",
          status: "in_progress",
          priority: "High",
          description: "Add user authentication and authorization",
          parentTaskId: null,
          dueDate: new Date("2025-11-20"),
        },
        {
          id: "mock-task-3",
          key: "SP-3",
          title: "Create user dashboard",
          status: "todo",
          priority: "Medium",
          description: "Build the main user dashboard interface",
          parentTaskId: "mock-task-2",
          dueDate: new Date("2025-11-25"),
        },
        {
          id: "mock-task-4",
          key: "SP-4",
          title: "Add task management",
          status: "todo",
          priority: "High",
          description: "Implement task creation, editing, and deletion",
          parentTaskId: null,
          dueDate: new Date("2025-11-22"),
        },
        {
          id: "mock-task-5",
          key: "SP-5",
          title: "Write API documentation",
          status: "backlog",
          priority: "Low",
          description: "Document all API endpoints and usage",
          parentTaskId: "mock-task-4",
          dueDate: null,
        },
        {
          id: "mock-task-6",
          key: "SP-6",
          title: "Implement notifications",
          status: "todo",
          priority: "Medium",
          description: "Add real-time notifications for task updates",
          parentTaskId: null,
          dueDate: new Date("2025-11-28"),
        },
      ];

      const mockBoardData: BoardData = {
        project: {
          id: "70317580-3bc3-4b88-83ff-7497c8d343ff",
          key: "SP",
          name: "SprintPlanner Core",
          createdAt: new Date("2025-11-01"),
        },
        tasks: mockTasks,
      };

      return apiResponse("Board mock data fetched successfully", 200, {
        board: mockBoardData,
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
