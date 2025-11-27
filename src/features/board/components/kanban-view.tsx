"use client";

import { useMemo, useState } from "react";
import { BoardTask, TaskStatus } from "../board-mock";
import { TaskCard } from "./task-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTaskDraggable } from "./kanban/KanbanTaskDraggable";
import { cn } from "@/lib/utils";

const STATUS_COLUMNS: {
  id: TaskStatus;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "backlog",
    label: "Backlog",
    color: "text-slate-600",
    bgColor: "bg-slate-100 dark:bg-slate-900",
  },
  {
    id: "todo",
    label: "To Do",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    id: "in_progress",
    label: "In Progress",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900",
  },
  {
    id: "done",
    label: "Done",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
  },
];

interface KanbanColumnProps {
  column: { id: TaskStatus; label: string; color: string; bgColor: string };
  tasks: BoardTask[];
  isOver?: boolean;
}

function KanbanColumn({ column, tasks, isOver }: KanbanColumnProps) {
  const { setNodeRef, isOver: columnIsOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex h-full flex-col">
      <Card
        ref={setNodeRef}
        className={cn(
          "flex h-full max-h-[calc(100vh-260px)] flex-col rounded-xl border transition-all duration-200",
          columnIsOver || isOver
            ? "border-primary bg-slate-50 shadow-lg ring-2 ring-primary/20"
            : "border-border bg-slate-50"
        )}
      >
        <CardHeader className="shrink-0 space-y-3 py-1 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn("h-2.5 w-2.5 rounded-full", column.bgColor)} />
              <CardTitle className={cn("text-sm font-semibold", column.color)}>
                {column.label}
              </CardTitle>
            </div>
            <span
              className={cn(
                "flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-medium",
                column.bgColor,
                column.color
              )}
            >
              {tasks.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-2.5 overflow-y-auto p-3">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanTaskDraggable id={task.id} key={task.id}>
                <TaskCard task={task} compact />
              </KanbanTaskDraggable>
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-xs text-muted-foreground">
              Drop tasks here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface KanbanViewProps {
  tasks: BoardTask[];
  subtasksByParent?: Map<string, BoardTask[]>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function KanbanView({ tasks, onStatusChange }: KanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Include all tasks (including subtasks) as separate items in kanban
  const allTasks = useMemo(() => {
    return tasks;
  }, [tasks]);

  const columns = useMemo(() => {
    const map: Record<TaskStatus, BoardTask[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
    };
    for (const t of allTasks) {
      map[t.status].push(t);
    }
    return map;
  }, [allTasks]);

  const activeTask = useMemo(() => {
    if (!activeId) return null;
    return allTasks.find((t) => t.id === activeId) || null;
  }, [activeId, allTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overId = over.id.toString();
      const targetColumn = STATUS_COLUMNS.find((c) => c.id === overId);
      if (targetColumn) {
        setOverColumnId(targetColumn.id);
        return;
      }
    }
    setOverColumnId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);

    if (!over) return;

    const taskId = active.id.toString();
    const overId = over.id.toString();

    // Check if dropping on a column
    const targetColumn = STATUS_COLUMNS.find((c) => c.id === overId);
    if (targetColumn) {
      onStatusChange(taskId, targetColumn.id);
      return;
    }

    // Check if dropping on another task (move to that task's column)
    const targetTask = allTasks.find((t) => t.id === overId);
    if (targetTask) {
      onStatusChange(taskId, targetTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={columns[column.id] ?? []}
            isOver={overColumnId === column.id}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-95 shadow-2xl">
            <TaskCard task={activeTask} compact />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
