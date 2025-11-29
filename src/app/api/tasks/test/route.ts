import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { tasks } from "@/db/tasks";
import { users } from "@/db/users";
import { eq } from "drizzle-orm";
import { routeHandlerSuccess, routeHandlerError } from "@/lib/handler";
import { createTRPCCaller } from "@/trpc/server";

// TODO: Change this project ID to the actual project ID
const PROJECT_ID = "70317580-3bc3-4b88-83ff-7497c8d343ff";

export async function GET() {
  try {
    // Get the current authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return routeHandlerError("Unauthorized", 401);
    }

    // Get the user from the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user) {
      return routeHandlerError("User not found in database", 404);
    }

    // Fetch board mock data using tRPC
    const caller = await createTRPCCaller();
    const boardDataResponse = await caller.tasks.getBoardMock();

    if (!boardDataResponse?.data?.board) {
      return routeHandlerError("Failed to fetch board mock data", 500);
    }

    const boardMock = boardDataResponse.data.board;

    // Create a map to store task IDs for parent task references
    const taskIdMap = new Map<string, string>();

    // Insert tasks in order (parent tasks first)
    const createdTasks = [];

    for (const task of boardMock.tasks) {
      // Skip if task already exists (check by key)
      const existingTask = await db
        .select()
        .from(tasks)
        .where(eq(tasks.key, task.key))
        .limit(1);

      if (existingTask.length > 0) {
        taskIdMap.set(task.id, existingTask[0].id);
        continue;
      }

      // Prepare task data
      const taskData = {
        projectId: PROJECT_ID,
        key: task.key,
        title: task.title,
        description: task.description || null,
        status: task.status,
        priority: task.priority,
        assigneeId: user.id, // Assign to current user
        reporterId: user.id, // Reporter is current user
        parentTaskId: task.parentTaskId
          ? taskIdMap.get(task.parentTaskId) || null
          : null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      };

      // Insert the task
      const [newTask] = await db.insert(tasks).values(taskData).returning();

      // Store the mapping for child tasks
      taskIdMap.set(task.id, newTask.id);
      createdTasks.push(newTask);
    }

    return routeHandlerSuccess(
      `Successfully created ${createdTasks.length} test tasks`,
      201,
      {
        created: createdTasks.length,
        tasks: createdTasks,
      }
    );
  } catch (error) {
    console.error("Error creating test tasks:", error);
    return routeHandlerError(
      error instanceof Error ? error.message : "Failed to create test tasks",
      500
    );
  }
}
