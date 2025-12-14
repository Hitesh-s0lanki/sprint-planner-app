"use client";

import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { BoardTask } from "@/modules/tasks/server/actions";
import { TaskDetailSheet } from "@/components/sheets/task-detail-sheet";
import { WeekCard } from "./week-card";
import { SectionTable } from "./section-table";
import { useListViewColumns } from "./list-view-columns";

interface ListViewProps {
  tasks: BoardTask[];
  subtasksByParent: Map<string, BoardTask[]>;
  projectStartDate: Date | string;
  projectId: string;
}

export function ListView({
  tasks,
  subtasksByParent,
  projectStartDate,
  projectId,
}: ListViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleRowClick = (task: BoardTask) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  // Group tasks by sprint week
  const tasksBySprintWeek = useMemo(() => {
    const grouped = new Map<number | null, BoardTask[]>();
    for (const task of tasks) {
      const week = task.sprintWeek ?? null;
      if (!grouped.has(week)) {
        grouped.set(week, []);
      }
      grouped.get(week)!.push(task);
    }
    return grouped;
  }, [tasks]);

  // Sort sprint weeks (null last)
  const sortedSprintWeeks = useMemo(() => {
    return Array.from(tasksBySprintWeek.keys()).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      return a - b;
    });
  }, [tasksBySprintWeek]);

  const columns = useListViewColumns();

  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border bg-card">
        <p className="text-sm text-muted-foreground">
          No tasks yet. Start by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-5">
        {sortedSprintWeeks.map((sprintWeek, index) => {
          const weekTasks = tasksBySprintWeek.get(sprintWeek) || [];
          const title =
            sprintWeek !== null ? `Week ${sprintWeek}` : "No Sprint Week";

          return (
            <WeekCard
              key={sprintWeek ?? "no-sprint"}
              title={title}
              sprintWeek={sprintWeek}
              tasks={weekTasks}
              projectStartDate={projectStartDate}
            >
              <SectionTable
                tasks={weekTasks}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                onRowClick={handleRowClick}
                showHeader={index === 0}
              />
            </WeekCard>
          );
        })}
      </div>

      <TaskDetailSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        subtasks={selectedTask ? subtasksByParent.get(selectedTask.id) : []}
        projectId={projectId}
        onTaskUpdate={() => {
          // Task updates are handled by query invalidation in the sheet
        }}
      />
    </>
  );
}
