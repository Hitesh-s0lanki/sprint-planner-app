"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag, Dot, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { NotionProp } from "./notion-prop";
import { NotionInlineSelect } from "./notion-inline-select";
import type { TaskStatus } from "@/modules/tasks/server/actions";

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

type Priority = "low" | "medium" | "high";
const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

interface TaskPropertiesProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  priority: Priority | null;
  onPriorityChange: (priority: Priority | null) => void;
  dueDate?: Date | string | null;
  onDueDateChange?: (dueDate: Date | null) => void;
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  description: string;
}

export function TaskProperties({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
}: TaskPropertiesProps) {
  const dueDateObj = dueDate
    ? typeof dueDate === "string"
      ? new Date(dueDate)
      : dueDate
    : null;

  return (
    <div className="mt-6 flex flex-col gap-x-6">
      <NotionProp
        icon={<Tag className="h-4 w-4" />}
        label="Status"
        className="shrink-0"
      >
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as TaskStatus)}
        >
          <SelectTrigger
            iconNeeded={false}
            className="h-auto p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0"
          >
            <SelectValue>
              <NotionInlineSelect
                valueLabel={
                  <Badge
                    className={cn("border-0 text-xs", statusColors[status])}
                    variant="outline"
                  >
                    <Dot className="h-3 w-3 -ml-1" />
                    {statusLabels[status] || status}
                  </Badge>
                }
              >
                {/* empty; dropdown is below */}
              </NotionInlineSelect>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                <Badge
                  variant="outline"
                  className={cn("border-0", statusColors[value])}
                >
                  <Dot className="h-4 w-4 -ml-1" />
                  {label}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </NotionProp>

      <NotionProp
        icon={<Tag className="h-4 w-4" />}
        label="Priority"
        className="shrink-0"
      >
        <Select
          value={priority ?? "empty"}
          onValueChange={(v) =>
            onPriorityChange(v === "empty" ? null : (v as Priority))
          }
        >
          <SelectTrigger
            iconNeeded={false}
            className="h-auto p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0"
          >
            <SelectValue>
              <NotionInlineSelect
                valueLabel={
                  priority ? (
                    <Badge
                      className={cn(
                        "border-0 text-xs",
                        priorityColors[priority]
                      )}
                      variant="outline"
                    >
                      <Dot className="h-3 w-3 -ml-1" />
                      {priorityLabels[priority]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Empty</span>
                  )
                }
              >
                {/* dropdown below */}
              </NotionInlineSelect>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="empty">Empty</SelectItem>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                <Badge
                  variant="outline"
                  className={cn("border-0", priorityColors[value as Priority])}
                >
                  <Dot className="h-4 w-4 -ml-1" />
                  {label}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </NotionProp>

      {onDueDateChange && (
        <NotionProp
          icon={<CalendarIcon className="h-4 w-4" />}
          label="Due date"
          className="shrink-0"
        >
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center",
                  "rounded-md px-1.5 py-0.5 hover:bg-muted/60 transition-colors",
                  "text-sm",
                  !dueDateObj && "text-muted-foreground"
                )}
              >
                {dueDateObj ? format(dueDateObj, "PPP") : "Empty"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDateObj || undefined}
                onSelect={(d) => onDueDateChange(d || null)}
                initialFocus
              />
              <div className="p-3 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => onDueDateChange(null)}
                >
                  Clear date
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </NotionProp>
      )}
    </div>
  );
}
