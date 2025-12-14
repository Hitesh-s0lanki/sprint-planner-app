"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardTask, TaskStatus } from "@/modules/tasks/server/actions";
import {
  TaskProperties,
  TaskHeader,
  TaskSubtasks,
  TaskComments,
} from "./task-detail-components";

type Priority = "low" | "medium" | "high";

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  subtasks = [],
  onTaskUpdate,
  projectId,
}: {
  task: BoardTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtasks?: BoardTask[];
  onTaskUpdate?: () => void;
  projectId?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [description, setDescription] = useState("");
  const [commentDraft, setCommentDraft] = useState("");

  // optional fields (wire if you actually have them)
  const [priority, setPriority] = useState<Priority | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const invalidateTasks = () => {
    if (projectId) {
      queryClient.invalidateQueries({
        queryKey: trpc.tasks.getByProjectId.queryKey({ projectId }),
      });
      return;
    }
    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "tasks",
    });
  };

  const updateMutation = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: (_, variables) => {
        toast.success("Updated");
        // Sync local state with saved values to hide the save button immediately
        if (task) {
          // Use the values that were actually saved
          // Note: variables contains the exact values sent to the API
          setTitle(variables.title ?? task.title);
          setStatus(variables.status ?? task.status);
          // Handle description: if null was sent, set to empty string; otherwise use the value
          setDescription(
            variables.description !== undefined
              ? variables.description ?? ""
              : task.description ?? ""
          );
          // Handle due date
          if (variables.dueDate !== undefined) {
            setDueDate(variables.dueDate ? new Date(variables.dueDate) : null);
          }
        }
        onTaskUpdate?.();
        invalidateTasks();
      },
      onError: (err) => toast.error(err.message || "Update failed"),
    })
  );

  const deleteMutation = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted");
        onOpenChange(false);
        onTaskUpdate?.();
        invalidateTasks();
      },
      onError: (err) => toast.error(err.message || "Delete failed"),
    })
  );

  const updateSubtaskMutation = useMutation(
    trpc.tasks.updateSubtaskStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Updated");
        onTaskUpdate?.();
        invalidateTasks();
      },
      onError: (err) => toast.error(err.message || "Update failed"),
    })
  );

  // Sync form state with task prop changes
  // This is necessary for controlled form inputs that need to reflect external state
  useEffect(() => {
    if (!task) return;
    // Sync form state with task prop changes
    // Note: This is a valid use case for setState in effects (syncing derived state from props)
    setTitle(task.title ?? "");
    setStatus(task.status);
    setDescription(task.description ?? "");
    // Map task priority (Capitalized: "Low" | "Medium" | "High") to local state (lowercase)
    if (task.priority) {
      const priorityLower = task.priority.toLowerCase();
      if (
        priorityLower === "low" ||
        priorityLower === "medium" ||
        priorityLower === "high"
      ) {
        setPriority(priorityLower as Priority);
      } else {
        setPriority(null);
      }
    } else {
      setPriority(null);
    }
    // Category is not in the task interface yet, so keep it null
    setCategory(null);
    // Set due date
    if (task.dueDate) {
      setDueDate(
        typeof task.dueDate === "string" ? new Date(task.dueDate) : task.dueDate
      );
    } else {
      setDueDate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]); // Only re-run when task ID changes

  // Detect changes - compute directly instead of using state
  const taskDueDate = task?.dueDate
    ? typeof task.dueDate === "string"
      ? new Date(task.dueDate)
      : task.dueDate
    : null;
  const hasChanges =
    !!task &&
    (title !== task.title ||
      status !== task.status ||
      description !== (task.description ?? "") ||
      dueDate?.getTime() !== taskDueDate?.getTime());

  if (!task) return null;

  const canDelete = task.generatedBy !== "ai";
  const isSaving = updateMutation.isPending;

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      taskId: task.id,
      title: title.trim() || task.title,
      status,
      description: description.trim() ? description : null,
      // Map priority back to capitalized format for API
      priority: priority
        ? ((priority.charAt(0).toUpperCase() + priority.slice(1)) as
            | "Low"
            | "Medium"
            | "High")
        : undefined,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ taskId: task.id });
  };

  const handleSubtaskStatusChange = async (
    subtaskId: string,
    newStatus: TaskStatus
  ) => {
    await updateSubtaskMutation.mutateAsync({
      taskId: subtaskId,
      status: newStatus,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full bg-white sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>{task.title || "Details"}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Top spacing like Notion */}
          <div className="px-6 pt-3 pb-6">
            {/* Page title */}
            <TaskHeader
              title={title}
              onTitleChange={setTitle}
              canDelete={canDelete}
              onDelete={handleDelete}
            />

            {/* Properties row */}
            <TaskProperties
              status={status}
              onStatusChange={setStatus}
              priority={priority}
              onPriorityChange={setPriority}
              dueDate={dueDate}
              onDueDateChange={setDueDate}
              category={category}
              onCategoryChange={setCategory}
              description={description}
            />
            <Separator className="my-4" />

            {/* Real description input (Notion-like below props) */}
            <div className=" px-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // placeholder will be like telling user to add a description on task the action performed by user
                placeholder="Add a description to the task to help us to improve prove better result for you..."
                className={cn(
                  "min-h-[70px]",
                  "border-0 px-0 shadow-none",
                  "bg-transparent resize-none",
                  "text-base leading-relaxed",
                  "placeholder:text-muted-foreground/60 focus-visible:ring-0"
                )}
              />
            </div>

            <Separator className="my-8" />

            {/* AI Description (optional, keep Notion feel) */}
            {task.aiDescription && (
              <div className="mt-10">
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  AI Notes
                </div>
                <div className="rounded-md border bg-muted/20 p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{task.aiDescription}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-8" />
            {/* Comments */}
            <TaskComments
              commentDraft={commentDraft}
              onCommentChange={setCommentDraft}
            />

            <Separator className="my-8" />

            {/* Subtasks list styled like Notion pages list */}
            <TaskSubtasks
              subtasks={subtasks}
              onStatusChange={handleSubtaskStatusChange}
            />

            {/* Add bottom padding to prevent content from being hidden behind sticky footer */}
            <div className={cn("h-20", hasChanges && "h-24")} />
          </div>
        </div>

        {/* Save/Cancel appears only when changes - Sticky at bottom */}
        {hasChanges && (
          <div className="absolute backdrop-blur bottom-0 left-0 right-0 flex justify-center py-4 bg-transparent">
            <div className="flex justify-between  px-6 py-2 gap-2 items-center bg-white/95 border border-slate-200 shadow rounded-full">
              <p className="text-xs text-muted-foreground font-medium">
                Save your changes
              </p>
              <div className="flex items-center justify-center gap-1 ">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!task) return;
                    setTitle(task.title);
                    setStatus(task.status);
                    setDescription(task.description ?? "");
                  }}
                  disabled={isSaving}
                  className="h-6 flex-1 rounded-full text-xs"
                  size={"sm"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size={"sm"}
                  className="h-6 rounded-full text-xs"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
