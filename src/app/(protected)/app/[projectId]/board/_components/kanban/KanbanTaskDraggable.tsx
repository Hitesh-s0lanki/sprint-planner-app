"use client";

import { PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface KanbanTaskDraggableProps extends PropsWithChildren {
  id: string;
}

export function KanbanTaskDraggable({ id, children }: KanbanTaskDraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "w-full cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-40 scale-95"
      )}
    >
      {children}
    </div>
  );
}

