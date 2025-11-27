"use client";

import { useMemo, useState } from "react";
import { BoardData, BoardTask, TaskStatus } from "./board-mock";
import { BoardTabs } from "./components/board-tabs";
import { ListView } from "./components/list-view";
import { KanbanView } from "./components/kanban-view";
import { TimelineView } from "./components/timeline-view";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BoardPageProps {
  data: BoardData;
}

export function BoardPage({ data }: BoardPageProps) {
  const [tasks, setTasks] = useState<BoardTask[]>(data.tasks);
  const [activeTab, setActiveTab] = useState<"list" | "board" | "timeline">(
    "board"
  );

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

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {data.project.name}
            </h1>
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              Board
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Switch between list, board and timeline views of your sprint.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            New Task
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs + views */}
      <BoardTabs value={activeTab} onValueChange={setActiveTab} />

      <div className="flex-1 rounded-2xl border border-border p-4 shadow-sm bg-white">
        {activeTab === "list" && (
          <ListView tasks={rootTasks} subtasksByParent={subtasksByParent} />
        )}
        {activeTab === "board" && (
          <KanbanView
            tasks={tasks}
            subtasksByParent={subtasksByParent}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "timeline" && <TimelineView tasks={tasks} />}
      </div>
    </div>
  );
}
