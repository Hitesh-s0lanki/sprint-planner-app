"use client";

import { useMemo, useState, useEffect, startTransition } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BoardTabs } from "./board-tabs";
import { ListView } from "./list-view/list-view";
import { KanbanView } from "./kanban/kanban-view";
import { CreateTaskButton } from "./create-task-button";
import type {
  BoardData,
  BoardTask,
  TaskStatus,
} from "@/modules/tasks/server/actions";

interface BoardPageProps {
  data: BoardData;
}

export function BoardPage({ data: initialData }: BoardPageProps) {
  const params = useParams();
  const projectId = params?.projectId as string;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"list" | "board">("list");
  const [isMounted, setIsMounted] = useState(false);

  // Fetch tasks using tRPC
  const { data: tasksData } = useQuery(
    trpc.tasks.getByProjectId.queryOptions({ projectId })
  );

  const boardData: BoardData =
    (tasksData as { data?: { board?: BoardData } })?.data?.board || initialData;

  // Only render Tabs and KanbanView after mount to prevent hydration mismatch
  // Radix UI Tabs and @dnd-kit generate different IDs on server vs client
  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  // Update task status mutation
  const updateStatusMutation = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch tasks
        queryClient.invalidateQueries({
          queryKey: trpc.tasks.getByProjectId.queryKey({ projectId }),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update task status");
      },
    })
  );

  const tasks = boardData.tasks;
  const rootTasks = useMemo(
    () => tasks.filter((t) => !t.parentTaskId),
    [tasks]
  );
  const subtasksByParent = useMemo(() => {
    const map = new Map<string, BoardTask[]>();
    for (const t of tasks) {
      if (!t.parentTaskId) continue;
      if (!map.has(t.parentTaskId)) map.set(t.parentTaskId, []);
      map.get(t.parentTaskId)!.push(t);
    }
    return map;
  }, [tasks]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        taskId,
        status,
      });
      toast.success("Task status updated");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        {/* Tabs + views */}
        <BoardTabs value={activeTab} onValueChange={setActiveTab} />

        <div className="flex items-center gap-2">
          <CreateTaskButton projectId={projectId} />
        </div>
      </div>

      {activeTab === "list" && (
        <ListView
          tasks={rootTasks}
          subtasksByParent={subtasksByParent}
          projectStartDate={boardData.project.createdAt}
          projectId={projectId}
        />
      )}
      {activeTab === "board" && isMounted && (
        <KanbanView
          tasks={tasks}
          subtasksByParent={subtasksByParent}
          onStatusChange={handleStatusChange}
          projectId={projectId}
        />
      )}
    </div>
  );
}
