import { db } from "@/lib/db";
import { tasks as tasksTable } from "@/db/tasks";
import { projects } from "@/db/projects";
import { users } from "@/db/users";
import { comments } from "@/db/comments";
import { eq, desc, inArray } from "drizzle-orm";

export interface DashboardKPIs {
  totalTasks: number;
  openTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  dueThisWeek: number;
  myOpenTasks: number;
}

export interface SprintRadar {
  velocity: number;
  executionConfidence: number;
  riskLevel: number;
  documentationQuality: number;
  stakeholderEngagement: number;
  focusScore: number;
}

export interface StatusDistribution {
  status: "backlog" | "todo" | "in_progress" | "done" | "cancelled";
  count: number;
}

export interface PriorityDistribution {
  priority: "Low" | "Medium" | "High";
  count: number;
}

export interface ExecutionHeatmapEntry {
  date: string;
  createdCount: number;
  completedCount: number;
}

export interface GoalVsActual {
  label: string;
  planned: number;
  completed: number;
}

export interface RiskBubble {
  taskId: string;
  key: string;
  title: string;
  daysUntilDue: number;
  priorityScore: number;
  status: string;
}

export interface DashboardCharts {
  sprintRadar: SprintRadar;
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
  executionHeatmap: ExecutionHeatmapEntry[];
  goalVsActual: GoalVsActual;
  riskBubbles: RiskBubble[];
}

export interface UpcomingDeadline {
  id: string;
  key: string;
  title: string;
  dueDate: string;
  assigneeName: string | null;
  status: string;
  priority: string;
}

export interface MyTask {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

export interface RecentActivity {
  id: string;
  type: "task_created" | "comment_added" | "task_updated";
  taskKey: string;
  taskTitle: string;
  actorName: string;
  createdAt: string;
  meta: Record<string, unknown>;
}

export interface DashboardLists {
  upcomingDeadlines: UpcomingDeadline[];
  myTasks: MyTask[];
  recentActivity: RecentActivity[];
}

export interface DashboardData {
  project: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
  };
  kpis: DashboardKPIs;
  charts: DashboardCharts;
  lists: DashboardLists;
}

/**
 * Get dashboard data for a project
 * @param projectId - The project ID
 * @param userId - Optional user ID for personalized data (my tasks, etc.)
 * @returns Dashboard data
 */
export async function getDashboardData(
  projectId: string,
  userId?: string
): Promise<DashboardData> {
  try {
    // Validate input
    if (!projectId || typeof projectId !== "string") {
      throw new Error("Invalid projectId provided");
    }

    // Verify table references are defined
    if (!projects || !tasksTable || !users || !comments) {
      throw new Error("Database table references are not properly initialized");
    }

    // Fetch project
    const projectResult = await db
      .select({
        id: projects.id,
        key: projects.key,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    const project = projectResult[0];
    if (!project || !project.id) {
      throw new Error("Project not found");
    }

    // Fetch all tasks for the project
    // Using a simpler query pattern to avoid Drizzle join issues
    const tasksData = await db
      .select({
        id: tasksTable.id,
        key: tasksTable.key,
        title: tasksTable.title,
        status: tasksTable.status,
        priority: tasksTable.priority,
        assigneeId: tasksTable.assigneeId,
        dueDate: tasksTable.dueDate,
        createdAt: tasksTable.createdAt,
      })
      .from(tasksTable)
      .where(eq(tasksTable.projectId, projectId));

    // Manually fetch user names for tasks that have assignees
    const assigneeIds = [
      ...new Set(
        tasksData
          .map((t) => t.assigneeId)
          .filter((id): id is string => Boolean(id))
      ),
    ];
    const assigneeMap = new Map<string, string | null>();

    if (
      assigneeIds.length > 0 &&
      assigneeIds.every((id) => typeof id === "string")
    ) {
      try {
        const userData = await db
          .select({
            id: users.id,
            name: users.name,
          })
          .from(users)
          .where(inArray(users.id, assigneeIds as string[]));

        userData.forEach((user) => {
          if (user.id) {
            assigneeMap.set(user.id, user.name || null);
          }
        });
      } catch (error) {
        console.error("Error fetching assignee users:", error);
        // Continue with empty map if user fetch fails
      }
    }

    // Combine tasks with assignee names
    const allTasks = tasksData.map((task) => ({
      ...task,
      assigneeName: task.assigneeId
        ? assigneeMap.get(task.assigneeId) || null
        : null,
    }));

    // Ensure tasks is an array and filter out any null/undefined values
    const validTasks = Array.isArray(allTasks) ? allTasks.filter(Boolean) : [];

    // Calculate KPIs
    const kpis = calculateKPIs(validTasks, userId);

    // Calculate charts
    const charts = calculateCharts(validTasks);

    // Get lists
    const lists = await getDashboardLists(projectId, userId, validTasks);

    return {
      project: {
        id: project.id,
        key: project.key,
        name: project.name,
        description: project.description || null,
        status: project.status || "active",
        createdAt: project.createdAt
          ? (project.createdAt instanceof Date
              ? project.createdAt
              : new Date(project.createdAt)
            ).toISOString()
          : new Date().toISOString(),
      },
      kpis,
      charts,
      lists,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error(
      `Failed to fetch dashboard data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Calculate KPIs from tasks
 */
function calculateKPIs(
  tasks: Array<{
    status: string;
    dueDate: Date | string | null;
    assigneeId: string | null;
  }>,
  userId?: string
): DashboardKPIs {
  const now = new Date();
  const weekFromNow = new Date(now);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const openStatuses = ["backlog", "todo", "in_progress"];
  const openTasks = tasks.filter(
    (t) => t && t.status && openStatuses.includes(t.status)
  );

  const overdueTasks = tasks.filter((t) => {
    if (!t || !t.dueDate || !t.status) return false;
    const dueDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
    return dueDate < now && openStatuses.includes(t.status);
  });

  const dueThisWeek = tasks.filter((t) => {
    if (!t || !t.dueDate || !t.status) return false;
    const dueDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
    return (
      dueDate >= now &&
      dueDate <= weekFromNow &&
      openStatuses.includes(t.status)
    );
  });

  const myOpenTasks = userId
    ? openTasks.filter((t) => t && t.assigneeId === userId)
    : [];

  // Blocked tasks - tasks with dependencies (simplified, could be enhanced)
  // For now, we'll use a placeholder calculation
  const blockedTasks = 0; // TODO: Calculate based on task dependencies

  return {
    totalTasks: tasks.length,
    openTasks: openTasks.length,
    overdueTasks: overdueTasks.length,
    blockedTasks,
    dueThisWeek: dueThisWeek.length,
    myOpenTasks: myOpenTasks.length,
  };
}

/**
 * Calculate chart data from tasks
 */
function calculateCharts(
  tasks: Array<{
    id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | string | null;
    createdAt: Date | string;
  }>
): DashboardCharts {
  // Status distribution
  const statusCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task && task.status) {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    }
  });

  const statusDistribution: StatusDistribution[] = [
    { status: "backlog", count: statusCounts["backlog"] || 0 },
    { status: "todo", count: statusCounts["todo"] || 0 },
    { status: "in_progress", count: statusCounts["in_progress"] || 0 },
    { status: "done", count: statusCounts["done"] || 0 },
    { status: "cancelled", count: statusCounts["cancelled"] || 0 },
  ];

  // Priority distribution
  const priorityCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task && task.priority) {
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
    }
  });

  const priorityDistribution: PriorityDistribution[] = [
    { priority: "High", count: priorityCounts["High"] || 0 },
    { priority: "Medium", count: priorityCounts["Medium"] || 0 },
    { priority: "Low", count: priorityCounts["Low"] || 0 },
  ];

  // Execution heatmap - last 30 days
  const heatmapData: ExecutionHeatmapEntry[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const createdCount = tasks.filter((task) => {
      if (!task || !task.createdAt) return false;
      const taskCreatedAt =
        task.createdAt instanceof Date
          ? task.createdAt
          : new Date(task.createdAt);
      const taskDate = taskCreatedAt.toISOString().split("T")[0];
      return taskDate === dateStr;
    }).length;

    // TODO: Track actual completion dates
    // const completedCount = tasks.filter((task) => {
    //   if (task.status !== "done") return false;
    //   // Approximate completion date as updatedAt (simplified)
    //   // In a real system, you'd track when status changed to "done"
    //   return false;
    // }).length;

    heatmapData.push({
      date: dateStr,
      createdCount,
      completedCount: 0, // Placeholder until we track completion dates
    });
  }

  // Goal vs Actual (this week)
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const completedThisWeek = tasks.filter((task) => {
    if (!task || task.status !== "done" || !task.createdAt) return false;
    const taskCreatedAt =
      task.createdAt instanceof Date
        ? task.createdAt
        : new Date(task.createdAt);
    return taskCreatedAt >= weekStart && taskCreatedAt <= weekEnd;
  }).length;

  const goalVsActual: GoalVsActual = {
    label: "This Week",
    planned: Math.ceil(tasks.length / 4), // Rough estimate
    completed: completedThisWeek,
  };

  // Risk bubbles - tasks that are overdue or due soon with high priority
  const riskBubbles: RiskBubble[] = tasks
    .filter((task) => {
      if (!task || !task.dueDate || !task.priority) return false;
      const dueDate =
        task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDue <= 7 && task.priority === "High";
    })
    .map((task) => {
      const daysUntilDue = task.dueDate
        ? Math.ceil(
            ((task.dueDate instanceof Date
              ? task.dueDate
              : new Date(task.dueDate)
            ).getTime() -
              now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 999;

      const priorityScore =
        task.priority === "High" ? 3 : task.priority === "Medium" ? 2 : 1;

      return {
        taskId: task.id,
        key: task.key,
        title: task.title,
        daysUntilDue,
        priorityScore,
        status: task.status,
      };
    })
    .slice(0, 10); // Limit to top 10

  // Sprint radar - calculated metrics (simplified)
  const doneTasks = tasks.filter((t) => t && t.status === "done").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const sprintRadar: SprintRadar = {
    velocity: Math.min(100, Math.round(completionRate * 0.76)), // Scaled metric
    executionConfidence: Math.min(100, Math.round(completionRate * 0.82)),
    riskLevel: Math.max(
      0,
      Math.min(100, Math.round(100 - completionRate * 0.64))
    ),
    documentationQuality: 58, // Placeholder
    stakeholderEngagement: 71, // Placeholder
    focusScore: Math.min(100, Math.round(completionRate * 0.69)),
  };

  return {
    sprintRadar,
    statusDistribution,
    priorityDistribution,
    executionHeatmap: heatmapData,
    goalVsActual,
    riskBubbles,
  };
}

/**
 * Get dashboard lists (upcoming deadlines, my tasks, recent activity)
 */
async function getDashboardLists(
  projectId: string,
  userId: string | undefined,
  tasks: Array<{
    id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | string | null;
    assigneeId: string | null;
    assigneeName: string | null;
    createdAt: Date | string;
  }>
): Promise<DashboardLists> {
  const now = new Date();
  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  // Upcoming deadlines - tasks due in next 2 weeks
  const upcomingDeadlines: UpcomingDeadline[] = tasks
    .filter((task) => {
      if (!task || !task.dueDate || !task.status) return false;
      const dueDate =
        task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      return (
        dueDate >= now &&
        dueDate <= twoWeeksFromNow &&
        task.status !== "done" &&
        task.status !== "cancelled"
      );
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      const aDate = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      const bDate = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 10)
    .map((task) => {
      const dueDate =
        task.dueDate instanceof Date
          ? task.dueDate
          : new Date(task.dueDate as string);
      return {
        id: task.id,
        key: task.key,
        title: task.title,
        dueDate: dueDate.toISOString(),
        assigneeName: task.assigneeName,
        status: task.status,
        priority: task.priority,
      };
    });

  // My tasks - user's open tasks
  const myTasks: MyTask[] = userId
    ? tasks
        .filter(
          (task) =>
            task &&
            task.assigneeId === userId &&
            task.status &&
            task.status !== "done" &&
            task.status !== "cancelled"
        )
        .slice(0, 10)
        .map((task) => {
          const dueDate = task.dueDate
            ? (task.dueDate instanceof Date
                ? task.dueDate
                : new Date(task.dueDate)
              ).toISOString()
            : null;
          return {
            id: task.id,
            key: task.key,
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate,
          };
        })
    : [];

  // Recent activity - from comments and task creation
  // First get all task IDs for this project
  let projectTaskIds: Array<{ id: string }> = [];
  try {
    const result = await db
      .select({ id: tasksTable.id })
      .from(tasksTable)
      .where(eq(tasksTable.projectId, projectId));
    projectTaskIds = result;
  } catch (error) {
    console.error("Error fetching project task IDs:", error);
    projectTaskIds = [];
  }

  const taskIdArray = projectTaskIds
    .map((t) => t.id)
    .filter((id): id is string => Boolean(id));

  // Fetch comments separately to avoid join issues
  let recentCommentsData: Array<{
    id: string;
    taskId: string;
    authorId: string;
    body: string;
    createdAt: Date;
  }> = [];

  if (
    taskIdArray.length > 0 &&
    taskIdArray.every((id) => typeof id === "string")
  ) {
    try {
      recentCommentsData = await db
        .select({
          id: comments.id,
          taskId: comments.taskId,
          authorId: comments.authorId,
          body: comments.body,
          createdAt: comments.createdAt,
        })
        .from(comments)
        .where(inArray(comments.taskId, taskIdArray as string[]))
        .orderBy(desc(comments.createdAt))
        .limit(10);
    } catch (error) {
      console.error("Error fetching recent comments:", error);
      recentCommentsData = [];
    }
  }

  // Fetch related task and user data separately
  const commentTaskIds = [
    ...new Set(
      recentCommentsData
        .map((c) => c.taskId)
        .filter((id): id is string => Boolean(id))
    ),
  ];
  const commentAuthorIds = [
    ...new Set(
      recentCommentsData
        .map((c) => c.authorId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  let commentTasks: Array<{ id: string; key: string; title: string }> = [];
  if (
    commentTaskIds.length > 0 &&
    commentTaskIds.every((id) => typeof id === "string")
  ) {
    try {
      commentTasks = await db
        .select({
          id: tasksTable.id,
          key: tasksTable.key,
          title: tasksTable.title,
        })
        .from(tasksTable)
        .where(inArray(tasksTable.id, commentTaskIds as string[]));
    } catch (error) {
      console.error("Error fetching comment tasks:", error);
      commentTasks = [];
    }
  }

  let commentUsers: Array<{ id: string; name: string | null }> = [];
  if (
    commentAuthorIds.length > 0 &&
    commentAuthorIds.every((id) => typeof id === "string")
  ) {
    try {
      commentUsers = await db
        .select({
          id: users.id,
          name: users.name,
        })
        .from(users)
        .where(inArray(users.id, commentAuthorIds as string[]));
    } catch (error) {
      console.error("Error fetching comment users:", error);
      commentUsers = [];
    }
  }

  const taskMap = new Map(commentTasks.map((t) => [t.id, t]));
  const userMap = new Map(commentUsers.map((u) => [u.id, u.name || null]));

  const recentComments = recentCommentsData.map((comment) => {
    const task = taskMap.get(comment.taskId);
    const authorName = userMap.get(comment.authorId) || null;
    return {
      id: comment.id,
      taskId: comment.taskId,
      authorId: comment.authorId,
      body: comment.body,
      createdAt: comment.createdAt,
      authorName,
      taskKey: task?.key || "",
      taskTitle: task?.title || "",
    };
  });

  const recentActivity: RecentActivity[] = [
    // Recent comments
    ...recentComments.map((comment) => ({
      id: comment.id,
      type: "comment_added" as const,
      taskKey: comment.taskKey,
      taskTitle: comment.taskTitle,
      actorName: comment.authorName || "Unknown",
      createdAt: comment.createdAt.toISOString(),
      meta: { snippet: comment.body.substring(0, 100) },
    })),
    // Recent task creations (last 10 created tasks)
    ...tasks
      .filter((task) => task && task.createdAt && task.key && task.title)
      .sort((a, b) => {
        const aCreated =
          a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const bCreated =
          b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return bCreated.getTime() - aCreated.getTime();
      })
      .slice(0, 5)
      .map((task) => {
        const createdAt =
          task.createdAt instanceof Date
            ? task.createdAt
            : new Date(task.createdAt);
        return {
          id: `task-${task.id}`,
          type: "task_created" as const,
          taskKey: task.key,
          taskTitle: task.title,
          actorName: task.assigneeName || "System",
          createdAt: createdAt.toISOString(),
          meta: { status: task.status || "unknown" },
        };
      }),
  ]
    .sort((a, b) => {
      const aCreated = new Date(a.createdAt);
      const bCreated = new Date(b.createdAt);
      return bCreated.getTime() - aCreated.getTime();
    })
    .slice(0, 10);

  return {
    upcomingDeadlines,
    myTasks,
    recentActivity,
  };
}
