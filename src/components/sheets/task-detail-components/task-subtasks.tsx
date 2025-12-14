"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Dot, FileText, Star, Lightbulb } from "lucide-react";
import { PageRow } from "./page-row";
import type { BoardTask, TaskStatus } from "@/modules/tasks/server/actions";

const statusColors: Record<string, string> = {
  backlog: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  todo: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  in_progress:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

function iconForRow(t: BoardTask) {
  if (t.title?.toLowerCase().includes("idea 1"))
    return <Lightbulb className="h-4 w-4 text-muted-foreground" />;
  if (t.title?.toLowerCase().includes("idea 2"))
    return <Star className="h-4 w-4 text-muted-foreground" />;
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

interface TaskSubtasksProps {
  subtasks: BoardTask[];
  onStatusChange: (subtaskId: string, status: TaskStatus) => void;
}

export function TaskSubtasks({ subtasks, onStatusChange }: TaskSubtasksProps) {
  if (subtasks.length === 0) return null;

  return (
    <div className="space-y-2 md:px-4 px-2 lg:px-2">
      {subtasks.map((s) => (
        <PageRow
          key={s.id}
          icon={iconForRow(s)}
          title={s.title}
          right={
            <Select
              value={s.status}
              onValueChange={(v) => onStatusChange(s.id, v as TaskStatus)}
            >
              <SelectTrigger iconNeeded={false} className="h-9 border-none">
                <SelectValue>
                  <Badge
                    variant="outline"
                    className={cn("border-0", statusColors[s.status])}
                  >
                    <Dot className="h-4 w-4 -ml-1" />
                    {statusLabels[s.status] || s.status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      ))}
    </div>
  );
}
