"use client";

import { Input } from "@/components/ui/input";

interface TaskCommentsProps {
  commentDraft: string;
  onCommentChange: (comment: string) => void;
}

export function TaskComments({
  commentDraft,
  onCommentChange,
}: TaskCommentsProps) {
  return (
    <div className="mt-8">
      <div className="text-sm font-semibold text-muted-foreground">
        Comments
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          h
        </div>
        <Input
          value={commentDraft}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add a comment..."
          className="h-10"
        />
      </div>
    </div>
  );
}
