"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface TaskHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function TaskHeader({
  title,
  onTitleChange,
  canDelete,
  onDelete,
}: TaskHeaderProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.();
    setOpen(false);
  };

  return (
    <div className="w-full pr-5 gap-3 flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
        className={cn(
          "w-full bg-transparent outline-none border-0 shadow-none",
          "text-xl! md:text-2xl! font-semibold tracking-tight",
          "placeholder:text-muted-foreground/50",
          "px-0 focus-visible:ring-0",
          "leading-tight h-auto! py-2"
        )}
      />
      {canDelete && onDelete && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
