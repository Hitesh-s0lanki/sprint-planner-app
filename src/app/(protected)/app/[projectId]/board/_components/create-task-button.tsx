"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateTaskButtonProps {
  projectId: string;
}

export function CreateTaskButton({ projectId }: CreateTaskButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Fetch users for assignee selection
  const { data: usersData } = useQuery(trpc.tasks.getAllUsers.queryOptions());

  const users =
    (
      usersData as {
        data?: {
          users?: Array<{ id: string; name: string | null; email: string }>;
        };
      }
    )?.data?.users || [];

  // Create task mutation
  const createMutation = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => {
        toast.success("Task created successfully");
        setDialogOpen(false);
        // Invalidate and refetch tasks
        queryClient.invalidateQueries({
          queryKey: trpc.tasks.getByProjectId.queryKey({ projectId }),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create task");
      },
    })
  );

  const handleCreate = async (data: {
    title: string;
    description?: string | null;
    status?: "backlog" | "todo" | "in_progress" | "done" | "cancelled";
    priority?: "Low" | "Medium" | "High";
    assigneeId?: string | null;
    dueDate?: string | null;
    timelineDays?: number | null;
    sprintWeek?: number | null;
  }) => {
    await createMutation.mutateAsync({
      projectId,
      ...data,
    });
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        New Task
        <Plus className="h-4 w-4 ml-2" />
      </Button>

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
        isLoading={createMutation.isPending}
        projectId={projectId}
        users={users}
      />
    </>
  );
}
