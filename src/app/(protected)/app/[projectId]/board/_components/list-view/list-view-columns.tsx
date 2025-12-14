"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { BoardTask } from "@/modules/tasks/server/actions";
import { Badge } from "@/components/ui/badge";
import { GenerateAvatar } from "@/components/ui/generate-avatar";
import { cn } from "@/lib/utils";
import {
  statusColors,
  priorityColors,
  statusLabels,
} from "./list-view-constants";

export function useListViewColumns(): ColumnDef<BoardTask>[] {
  return useMemo<ColumnDef<BoardTask>[]>(
    () => [
      {
        accessorKey: "key",
        header: () => "Task",
        cell: ({ row }) => (
          <div className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {row.getValue("key")}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: () => "Title",
        cell: ({ row }) => {
          const task = row.original;

          return (
            <div className="text-sm font-medium leading-5 max-w-[280px] truncate">
              {task.title}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              variant="outline"
              className={cn(
                "border-none px-2 py-0.5 text-xs whitespace-nowrap",
                statusColors[status] || ""
              )}
            >
              {statusLabels[status] || status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "priority",
        header: () => "Priority",
        cell: ({ row }) => {
          const priority = row.getValue("priority") as string;
          return (
            <Badge
              variant="outline"
              className={cn(
                "border-none px-2 py-0.5 text-xs whitespace-nowrap",
                priorityColors[priority] || ""
              )}
            >
              {priority}
            </Badge>
          );
        },
      },
      {
        accessorKey: "assigneeName",
        header: () => <span className="hidden md:inline">Assignee</span>,
        cell: ({ row }) => {
          const task = row.original;
          const assigneeEmail = task.assigneeEmail;
          const assigneeName = task.assigneeName;

          if (!assigneeEmail && !assigneeName) {
            return (
              <div className="hidden md:block text-sm text-muted-foreground">
                Unassigned
              </div>
            );
          }

          return (
            <div className="hidden md:flex justify-center items-center gap-2 ">
              <GenerateAvatar
                seed={assigneeName || ""}
                variant="initials"
                className="size-6"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: () => "Due Date",
        cell: ({ row }) => {
          const dueDate = row.getValue("dueDate") as
            | Date
            | string
            | null
            | undefined;

          if (!dueDate) {
            return (
              <div className="hidden lg:block text-sm text-muted-foreground">
                —
              </div>
            );
          }

          const date =
            typeof dueDate === "string" ? new Date(dueDate) : dueDate;

          return (
            <div className="hidden lg:block text-sm whitespace-nowrap">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          );
        },
      },
    ],
    []
  );
}
