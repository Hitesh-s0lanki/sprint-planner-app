"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { InvestorMessage } from "@/modules/investors/types";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: InvestorMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isFounder = message.senderType === "founder";
  const timeAgo = formatDistanceToNow(message.createdAt, { addSuffix: true });

  return (
    <div
      className={cn(
        "flex gap-3",
        isFounder ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar placeholder */}
      <div
        className={cn(
          "h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-sm font-semibold",
          isFounder
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isFounder ? "F" : "I"}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isFounder ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isFounder ? "You" : "Investor"}
          </span>
          <span className="text-xs text-muted-foreground/60">{timeAgo}</span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isFounder
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground border border-border/50"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.body}
          </p>

          {message.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.tags.split(",").map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={cn(
                    "text-xs rounded-md px-2 py-0.5",
                    isFounder
                      ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                      : "bg-background/50"
                  )}
                >
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

