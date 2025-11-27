export type TaskStatus = "backlog" | "todo" | "in_progress" | "done";

export type Priority = "Low" | "Medium" | "High";

export interface BoardTask {
  id: string;
  key: string; // e.g. SP-12
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeName?: string;
  dueDate?: string | null;
  parentTaskId?: string | null;
}

export interface BoardData {
  project: {
    id: string;
    key: string;
    name: string;
  };
  tasks: BoardTask[];
}

export const boardMock: BoardData = {
  project: {
    id: "project-1",
    key: "SP",
    name: "SprintPlanner Core",
  },
  tasks: [
    {
      id: "t-1",
      key: "SP-12",
      title: "Ship dashboard MVP",
      description: "Implement dashboard widgets with dummy data.",
      status: "in_progress",
      priority: "High",
      assigneeName: "Hitesh",
      dueDate: "2025-11-27T10:00:00.000Z",
    },
    {
      id: "t-2",
      key: "SP-13",
      title: "Design board experience",
      description: "List, Kanban and timeline views for tasks.",
      status: "todo",
      priority: "High",
      assigneeName: "Hitesh",
      dueDate: "2025-11-29T10:00:00.000Z",
    },
    // subtasks of SP-13
    {
      id: "t-3",
      key: "SP-14",
      title: "List view UI",
      status: "todo",
      priority: "Medium",
      parentTaskId: "t-2",
      assigneeName: "AI Co-pilot",
    },
    {
      id: "t-4",
      key: "SP-15",
      title: "Kanban view + dnd-kit",
      status: "backlog",
      priority: "High",
      parentTaskId: "t-2",
      assigneeName: "Hitesh",
    },
    {
      id: "t-5",
      key: "SP-16",
      title: "Timeline view",
      status: "backlog",
      priority: "Medium",
      parentTaskId: "t-2",
    },
    {
      id: "t-6",
      key: "SP-17",
      title: "Investor narrative refinement",
      status: "backlog",
      priority: "Medium",
      assigneeName: "AI Co-pilot",
    },
    {
      id: "t-7",
      key: "SP-18",
      title: "Setup task filters",
      status: "in_progress",
      priority: "Low",
    },
    {
      id: "t-8",
      key: "SP-19",
      title: "Fix onboarding edge cases",
      status: "todo",
      priority: "Medium",
    },
    {
      id: "t-9",
      key: "SP-20",
      title: "Close previous sprint",
      status: "done",
      priority: "Low",
    },
    {
      id: "t-10",
      key: "SP-21",
      title: "Archive old tasks",
      status: "todo",
      priority: "Low",
    },
  ],
};
