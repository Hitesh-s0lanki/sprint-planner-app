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
        "flex gap-2 sm:gap-3",
        isFounder ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar placeholder */}
      <div
        className={cn(
          "h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0 flex items-center justify-center text-xs sm:text-sm font-semibold",
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
          "flex flex-col gap-1 max-w-[75%] sm:max-w-[70%] min-w-0",
          isFounder ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-muted-foreground">
            {isFounder ? "You" : "Investor"}
          </span>
          <span className="text-xs text-muted-foreground/60">{timeAgo}</span>
        </div>

        <div
          className={cn(
            "rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm",
            isFounder
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground border border-border/50"
          )}
        >
          <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
            {message.body}
          </p>

          {message.tags && (
            <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
              {message.tags.split(",").map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={cn(
                    "text-xs rounded-md px-1.5 sm:px-2 py-0.5 shrink-0",
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
