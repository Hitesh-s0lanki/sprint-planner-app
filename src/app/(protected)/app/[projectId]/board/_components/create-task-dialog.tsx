"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Calendar as CalendarIcon,
  Dot,
  User,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { TaskStatus, Priority } from "@/modules/tasks/server/actions";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: string | null;
    dueDate?: string | null;
    timelineDays?: number | null;
    sprintWeek?: number | null;
  }) => Promise<void>;
  isLoading?: boolean;
  projectId: string;
  users?: Array<{ id: string; name: string | null; email: string }>;
}

const statusLabels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

const statusColors: Record<TaskStatus, string> = {
  backlog: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  todo: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  in_progress:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const priorityColors: Record<Priority, string> = {
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  High: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function NotionProp({
  label,
  // icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 min-w-0 text-sm">
      <span className="text-muted-foreground shrink-0">-</span>
      <span className="text-muted-foreground shrink-0">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function InlineSelect({ value }: { value: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-muted/60 transition-colors">
      {value}
    </span>
  );
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreate,
  isLoading = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectId: _projectId,
  users = [],
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [timelineDays, setTimelineDays] = useState<number | null>(null);
  const [sprintWeek, setSprintWeek] = useState<number | null>(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === assigneeId),
    [users, assigneeId]
  );

  const reset = () => {
    setTitle("");
    setDescription("");
    setStatus("backlog");
    setPriority("Medium");
    setAssigneeId(null);
    setDueDate(null);
    setTimelineDays(null);
    setSprintWeek(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      assigneeId,
      dueDate: dueDate ? dueDate.toISOString() : null,
      timelineDays,
      sprintWeek,
    });

    reset();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0",
          "w-[95vw] sm:w-auto",
          "min-w-3xl max-w-3xl", // 👈 requested
          "max-h-[90vh] overflow-hidden"
        )}
      >
        {/* Visually hidden header (a11y), Notion look uses title input instead */}
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Create a task</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Body */}
          <div className="px-6 pt-10 pb-6 overflow-y-auto">
            {/* Big Notion-like title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              placeholder="Untitled"
              autoFocus
              className={cn(
                "h-auto border-0 px-0 shadow-none bg-transparent",
                "text-3xl! font-semibold tracking-tight",
                "placeholder:text-muted-foreground/50",
                "focus-visible:ring-0"
              )}
            />

            {/* Description (Notion-like block) */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div className="mt-2 col-span-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  placeholder="Write what needs to be done…"
                  className={cn(
                    "min-h-[110px] resize-none",
                    "border-0 bg-transparent shadow-none px-0",
                    "text-base leading-relaxed",
                    "placeholder:text-muted-foreground/60",
                    "focus-visible:ring-0"
                  )}
                />
              </div>
              {/* Properties grid */}
              <div className="mt-6 flex flex-col gap-x-6 gap-y-2 border-l px-2">
                <NotionProp
                  icon={<Dot className="h-4 w-4 text-muted-foreground" />}
                  label="Status"
                >
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as TaskStatus)}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      iconNeeded={false}
                      className="h-auto p-0 border-0 shadow-none bg-transparent focus:ring-0"
                    >
                      <SelectValue>
                        <InlineSelect
                          value={
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                                statusColors[status]
                              )}
                            >
                              <Dot className="h-4 w-4 -ml-1" />
                              {statusLabels[status]}
                            </span>
                          }
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </NotionProp>

                <NotionProp
                  icon={<Dot className="h-4 w-4 text-muted-foreground" />}
                  label="Priority"
                >
                  <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as Priority)}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      iconNeeded={false}
                      className="h-auto p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0"
                    >
                      <SelectValue>
                        <InlineSelect
                          value={
                            <Badge
                              className={cn(
                                "border-0 text-xs",
                                priorityColors[priority]
                              )}
                              variant="outline"
                            >
                              <Dot className="h-3 w-3 -ml-1" />
                              {priority}
                            </Badge>
                          }
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                        <SelectItem key={p} value={p}>
                          <Badge
                            variant="outline"
                            className={cn("border-0", priorityColors[p])}
                          >
                            <Dot className="h-4 w-4 -ml-1" />
                            {p}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </NotionProp>

                <NotionProp
                  icon={<User className="h-4 w-4" />}
                  label="Assignee"
                >
                  <Select
                    value={assigneeId || "unassigned"}
                    onValueChange={(v) =>
                      setAssigneeId(v === "unassigned" ? null : v)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      iconNeeded={false}
                      className="h-8 p-0 border-0 shadow-none bg-transparent focus:ring-0"
                    >
                      <SelectValue>
                        <InlineSelect
                          value={
                            <span
                              className={cn(
                                "text-sm",
                                !selectedUser && "text-slate-400"
                              )}
                            >
                              {selectedUser
                                ? selectedUser.name || selectedUser.email
                                : "Empty"}
                            </span>
                          }
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Empty</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </NotionProp>

                <NotionProp
                  icon={<CalendarIcon className="h-4 w-4" />}
                  label="Due date"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={isLoading}
                        className={cn(
                          "inline-flex items-center",
                          "rounded-md px-1.5 py-0.5 hover:bg-muted/60 transition-colors",
                          "text-sm",
                          !dueDate && "text-slate-400"
                        )}
                      >
                        {dueDate ? format(dueDate, "PPP") : "Empty"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate || undefined}
                        onSelect={(d) => setDueDate(d || null)}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setDueDate(null)}
                        >
                          Clear date
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </NotionProp>

                <NotionProp
                  icon={<Dot className="h-4 w-4 text-muted-foreground" />}
                  label="ETA (days)"
                >
                  <Input
                    type="number"
                    value={timelineDays ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTimelineDays(v === "" ? null : parseFloat(v));
                    }}
                    placeholder="2..."
                    step="0.5"
                    min="0"
                    disabled={isLoading}
                    className={cn(
                      "h-8 w-28",
                      "border-0 bg-transparent shadow-none",
                      "focus-visible:ring-0",
                      "px-1.5"
                    )}
                  />
                </NotionProp>

                <NotionProp
                  icon={
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  }
                  label="Sprint Week"
                >
                  <Select
                    value={sprintWeek?.toString() ?? "empty"}
                    onValueChange={(v) =>
                      setSprintWeek(v === "empty" ? null : parseInt(v, 10))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      iconNeeded={false}
                      className="h-auto p-0 border-0 shadow-none bg-transparent focus:ring-0"
                    >
                      <SelectValue>
                        <InlineSelect
                          value={
                            <span
                              className={cn(
                                "text-sm",
                                !sprintWeek && "text-slate-400"
                              )}
                            >
                              {sprintWeek ? `Week ${sprintWeek}` : "Empty"}
                            </span>
                          }
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Empty</SelectItem>
                      {[1, 2, 3, 4].map((week) => (
                        <SelectItem key={week} value={week.toString()}>
                          Week {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </NotionProp>
              </div>
            </div>
          </div>

          {/* Sticky footer actions */}
          <div className="sticky bottom-0 border-t bg-background/90 backdrop-blur px-6 py-4">
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="h-8 rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="h-8 rounded-full text-xs"
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
