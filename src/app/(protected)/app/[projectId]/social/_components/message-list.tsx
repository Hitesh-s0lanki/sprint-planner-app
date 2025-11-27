"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { Skeleton } from "@/components/ui/skeleton";
import type { InvestorMessage } from "@/modules/investors/types";
import { format, isToday, isYesterday } from "date-fns";

interface MessageListProps {
  messages: InvestorMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: Array<{
    date: string;
    messages: InvestorMessage[];
  }> = [];

  let currentDate: string | null = null;
  let currentGroup: InvestorMessage[] = [];

  messages.forEach((message) => {
    let dateLabel: string;

    if (isToday(message.createdAt)) {
      dateLabel = "Today";
    } else if (isYesterday(message.createdAt)) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = format(message.createdAt, "MMMM d, yyyy");
    }

    if (currentDate !== dateLabel) {
      if (currentGroup.length > 0) {
        groupedMessages.push({ date: currentDate!, messages: currentGroup });
      }
      currentDate = dateLabel;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });

  if (currentGroup.length > 0 && currentDate) {
    groupedMessages.push({ date: currentDate, messages: currentGroup });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Date Separator */}
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
              {group.date}
            </div>
          </div>

          {/* Messages */}
          {group.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

