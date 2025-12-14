import { db } from "@/lib/db";
import { tasks } from "@/db/tasks";
import { users } from "@/db/users";
import { projects } from "@/db/projects";
import { eq, desc, ilike, sql } from "drizzle-orm";

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "done"
  | "cancelled";
export type Priority = "Low" | "Medium" | "High";

export interface BoardTask {
  id: string;
  key: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigneeName?: string | null;
  assigneeEmail?: string | null;
  assigneeId?: string | null;
  dueDate?: Date | string | null;
  parentTaskId?: string | null;
  sprintWeek?: number | null;
  description?: string | null;
  aiDescription?: string | null;
  timelineDays?: number | null;
  generatedBy?: "user" | "ai" | null;
}

export interface BoardData {
  project: {
    id: string;
    key: string;
    name: string;
    createdAt: Date | string;
  };
  tasks: BoardTask[];
}

/**
 * Get tasks by project ID with user information
 * @param projectId - The project ID to fetch tasks for
 * @returns Board data with tasks
 */
export async function getTasksByProjectId(
  projectId: string
): Promise<BoardData> {
  try {
    // Fetch project
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      throw new Error("Project not found");
    }

    // Fetch tasks with assignee information, ordered by due date ascending (nulls last)
    const tasksData = await db
      .select({
        id: tasks.id,
        key: tasks.key,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        assigneeName: users.name,
        assigneeEmail: users.email,
        assigneeId: tasks.assigneeId,
        dueDate: tasks.dueDate,
        parentTaskId: tasks.parentTaskId,
        sprintWeek: tasks.sprint_week,
        description: tasks.description,
        aiDescription: tasks.ai_description,
        timelineDays: tasks.timeline_days,
        generatedBy: tasks.generated_by,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(eq(tasks.projectId, projectId))
      .orderBy(
        // Order by due date ascending, with nulls last
        sql`${tasks.dueDate} ASC NULLS LAST`
      );

    // Transform to BoardTask format
    const boardTasks: BoardTask[] = tasksData.map((task) => ({
      id: task.id,
      key: task.key,
      title: task.title,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      assigneeName: task.assigneeName,
      assigneeEmail: task.assigneeEmail,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      parentTaskId: task.parentTaskId,
      sprintWeek: task.sprintWeek,
      description: task.description,
      aiDescription: task.aiDescription,
      timelineDays: task.timelineDays,
      generatedBy: task.generatedBy,
    }));

    return {
      project: {
        id: project.id,
        key: project.key,
        name: project.name,
        createdAt: project.createdAt,
      },
      tasks: boardTasks,
    };
  } catch (error) {
    console.error("Error fetching tasks by project ID:", error);
    throw new Error("Failed to fetch tasks");
  }
}

/**
 * Update a task
 * @param taskId - The task ID to update
 * @param updates - Partial task updates
 * @returns Updated task
 */
export async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: string | null;
    dueDate?: Date | string | null;
    description?: string | null;
    timelineDays?: number | null;
  }
) {
  try {
    const updateData: {
      title?: string;
      status?: TaskStatus;
      priority?: Priority;
      assigneeId?: string | null;
      dueDate?: Date | null;
      description?: string | null;
      timeline_days?: number | null;
      updatedAt?: Date;
    } = {
      updatedAt: new Date(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.assigneeId !== undefined)
      updateData.assigneeId = updates.assigneeId;
    if (updates.dueDate !== undefined) {
      // Ensure dueDate is always Date or null, never string
      updateData.dueDate = updates.dueDate
        ? typeof updates.dueDate === "string"
          ? new Date(updates.dueDate)
          : updates.dueDate
        : null;
    }
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.timelineDays !== undefined)
      updateData.timeline_days = updates.timelineDays;

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

/**
 * Delete a task
 * @param taskId - The task ID to delete
 */
export async function deleteTask(taskId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}

/**
 * Update subtask status
 * @param taskId - The subtask ID
 * @param status - New status
 */
export async function updateSubtaskStatus(taskId: string, status: TaskStatus) {
  try {
    await db
      .update(tasks)
      .set({ status, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
  } catch (error) {
    console.error("Error updating subtask status:", error);
    throw new Error("Failed to update subtask status");
  }
}

/**
 * Get all users for assignee selection
 * @param _projectId - Optional project ID to filter users (for future use)
 * @returns Array of users
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllUsers(_projectId?: string) {
  try {
    // For now, get all users. In the future, you might want to filter by project members
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Generate the next task key for a project
 * @param projectKey - The project key (e.g., "SP")
 * @returns Next task key (e.g., "SP-13")
 */
async function generateNextTaskKey(projectKey: string): Promise<string> {
  try {
    // Find the highest task number for this project key
    const pattern = `${projectKey}-%`;
    const existingTasks = await db
      .select({ key: tasks.key })
      .from(tasks)
      .where(ilike(tasks.key, pattern))
      .orderBy(desc(tasks.key))
      .limit(1);

    if (existingTasks.length === 0) {
      return `${projectKey}-1`;
    }

    const lastKey = existingTasks[0].key;
    const match = lastKey.match(/^(.+)-(\d+)$/);

    if (match) {
      const number = parseInt(match[2], 10);
      return `${projectKey}-${number + 1}`;
    }

    // Fallback: if pattern doesn't match, start from 1
    return `${projectKey}-1`;
  } catch (error) {
    console.error("Error generating task key:", error);
    // Fallback to timestamp-based key
    return `${projectKey}-${Date.now()}`;
  }
}

/**
 * Create a new task
 * @param projectId - The project ID
 * @param userId - The user ID creating the task (reporter)
 * @param taskData - Task data
 * @returns Created task
 */
export async function createTask(
  projectId: string,
  userId: string,
  taskData: {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: string | null;
    dueDate?: Date | string | null;
    timelineDays?: number | null;
    sprintWeek?: number | null;
    parentTaskId?: string | null;
  }
) {
  try {
    // Fetch project to get project key
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      throw new Error("Project not found");
    }

    // Generate task key
    const key = await generateNextTaskKey(project.key);

    // Prepare task data
    const newTaskData = {
      projectId,
      key,
      title: taskData.title,
      description: taskData.description || null,
      status: (taskData.status || "backlog") as TaskStatus,
      priority: (taskData.priority || "Medium") as Priority,
      assigneeId: taskData.assigneeId || null,
      reporterId: userId,
      dueDate: taskData.dueDate
        ? typeof taskData.dueDate === "string"
          ? new Date(taskData.dueDate)
          : taskData.dueDate
        : null,
      timeline_days: taskData.timelineDays || null,
      sprint_week: taskData.sprintWeek || null,
      parentTaskId: taskData.parentTaskId || null,
      generated_by: "user" as const,
    };

    const [createdTask] = await db
      .insert(tasks)
      .values(newTaskData)
      .returning();

    if (!createdTask) {
      throw new Error("Failed to create task");
    }

    return createdTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}
