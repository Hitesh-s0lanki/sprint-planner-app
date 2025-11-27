import { BoardTask } from "../board-mock";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: BoardTask;
  subtasks?: BoardTask[];
  compact?: boolean;
}

export function TaskCard({ task, subtasks, compact }: TaskCardProps) {
  const priorityColor: Record<string, string> = {
    High: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-background p-3 text-sm shadow-sm transition-shadow hover:shadow-md",
        compact && "p-2.5"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              {task.key}
            </span>
          </div>
          <div className="font-medium leading-snug">{task.title}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn(
              "border-none px-2 py-0.5 text-[11px]",
              priorityColor[task.priority]
            )}
          >
            {task.priority}
          </Badge>
          {task.assigneeName && (
            <span className="text-[11px] text-muted-foreground">
              {task.assigneeName}
            </span>
          )}
        </div>
      </div>

      {task.description && !compact && (
        <p className="mt-2 line-clamp-2 text-[12px] text-muted-foreground">
          {task.description}
        </p>
      )}

      {subtasks && subtasks.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-dashed border-border pt-2">
          {subtasks.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between gap-2 text-[12px]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{sub.title}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {sub.key}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

