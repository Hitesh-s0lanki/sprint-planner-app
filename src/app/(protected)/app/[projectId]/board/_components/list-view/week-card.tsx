"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BoardTask } from "@/modules/tasks/server/actions";

interface WeekCardProps {
  title: string;
  sprintWeek: number | null;
  tasks: BoardTask[];
  projectStartDate: Date | string;
  children: React.ReactNode;
}

type WeekStatus = "completed" | "ongoing" | "pending" | "upcoming" | null;

function getCurrentSprintWeek(projectStartDate: Date | string): number {
  const now = new Date();
  const startDate =
    typeof projectStartDate === "string"
      ? new Date(projectStartDate)
      : projectStartDate;

  // Calculate the difference in milliseconds
  const diffTime = now.getTime() - startDate.getTime();
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // Calculate sprint week (1 week = 7 days, week 1 starts at day 0)
  const currentSprintWeek = Math.floor(diffDays / 7) + 1;

  return Math.max(1, currentSprintWeek); // Ensure at least week 1
}

function getWeekStatus(
  sprintWeek: number | null,
  tasks: BoardTask[],
  projectStartDate: Date | string
): WeekStatus {
  if (sprintWeek === null) return null;

  const currentSprintWeek = getCurrentSprintWeek(projectStartDate);

  // Filter only main tasks (no parentTaskId)
  const mainTasks = tasks.filter((task) => !task.parentTaskId);

  if (mainTasks.length === 0) return null;

  // Check if all main tasks are completed
  const allCompleted = mainTasks.every((task) => task.status === "done");

  // Determine status based on week comparison and completion
  if (sprintWeek === currentSprintWeek) {
    // Current sprint week
    return "ongoing";
  } else if (sprintWeek < currentSprintWeek) {
    // Sprint week has passed
    return allCompleted ? "completed" : "pending";
  } else {
    // Future sprint week
    return "upcoming";
  }
}

const statusConfig: Record<
  Exclude<WeekStatus, null>,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

export function WeekCard({
  title,
  sprintWeek,
  tasks,
  projectStartDate,
  children,
}: WeekCardProps) {
  const status = getWeekStatus(sprintWeek, tasks, projectStartDate);

  return (
    <section className="rounded-2xl border shadow-sm overflow-hidden bg-white">
      <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="inline-flex size-6 items-center justify-center rounded-sm">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {title}
              </h3>
              {status && (
                <Badge
                  variant="outline"
                  className={cn(
                    "border-none px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                    statusConfig[status].className
                  )}
                >
                  {statusConfig[status].label}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="p-2 sm:p-3">{children}</div>
    </section>
  );
}
