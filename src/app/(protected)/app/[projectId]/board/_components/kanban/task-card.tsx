import type { BoardTask } from "@/modules/tasks/server/actions";
import { Badge } from "@/components/ui/badge";
import { GenerateAvatar } from "@/components/ui/generate-avatar";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: BoardTask;
  subtasks?: BoardTask[];
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  backlog: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  todo: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  in_progress:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

export function TaskCard({ task, subtasks, compact }: TaskCardProps) {
  const seed = task.assigneeEmail || task.assigneeName || "";

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-card p-4 text-sm shadow-sm transition-all hover:shadow-lg hover:border-primary/20",
        compact && "p-3"
      )}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {task.key}
              </span>
              {task.sprintWeek !== null && task.sprintWeek !== undefined && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  W{task.sprintWeek}
                </Badge>
              )}
            </div>
            <h4 className="font-semibold leading-tight text-foreground">
              {task.title}
            </h4>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn(
              "border-none px-2 py-0.5 text-[10px] font-medium",
              statusColors[task.status] || ""
            )}
          >
            {statusLabels[task.status] || task.status}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "border-none px-2 py-0.5 text-[10px] font-medium",
              priorityColors[task.priority] || ""
            )}
          >
            {task.priority}
          </Badge>
        </div>

        {/* Description */}
        {task.description && !compact && (
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {seed ? (
              <GenerateAvatar
                seed={seed}
                variant="initials"
                className="h-6 w-6"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">?</span>
              </div>
            )}
            {task.assigneeName && (
              <span className="text-xs text-muted-foreground">
                {task.assigneeName}
              </span>
            )}
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {typeof task.dueDate === "string"
                  ? new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : task.dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
              </span>
            </div>
          )}
        </div>

        {/* Subtasks */}
        {subtasks && subtasks.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
              <Clock className="h-3 w-3" />
              <span>
                {subtasks.length} subtask{subtasks.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-1">
              {subtasks.slice(0, 2).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 text-[11px] text-muted-foreground"
                >
                  <span className="inline-flex h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="truncate">{sub.title}</span>
                </div>
              ))}
              {subtasks.length > 2 && (
                <div className="text-[11px] text-muted-foreground pl-3">
                  +{subtasks.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
