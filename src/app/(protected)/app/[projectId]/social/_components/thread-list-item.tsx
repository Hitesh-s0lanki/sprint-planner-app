"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { InvestorConversation } from "@/modules/investors/types";
import { formatDistanceToNow } from "date-fns";

interface ThreadListItemProps {
  conversation: InvestorConversation;
  isActive: boolean;
  onClick: () => void;
}

const rankLabels: Record<string, string> = {
  tier_a_vc: "Tier A VC",
  tier_b_vc: "Tier B VC",
  angel: "Angel",
  micro_gp: "Micro GP",
  syndicate: "Syndicate",
  other: "Other",
};

const interestConfig: Record<
  string,
  { emoji: string; label: string; className: string }
> = {
  high: {
    emoji: "🔥",
    label: "High",
    className: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  },
  warm: {
    emoji: "🙂",
    label: "Warm",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  exploring: {
    emoji: "🤔",
    label: "Exploring",
    className: "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
};

export function ThreadListItem({
  conversation,
  isActive,
  onClick,
}: ThreadListItemProps) {
  const interest = interestConfig[conversation.interestLevel] || interestConfig.exploring;
  const lastMessageTime = conversation.lastMessageAt
    ? formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })
    : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 border-b hover:bg-accent/50 transition-colors",
        isActive && "bg-accent border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-semibold text-sm truncate">
            Investor #{conversation.investorNumber}
          </span>
          {!conversation.isRead && conversation.unreadCount > 0 && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        {lastMessageTime && (
          <span className="text-xs text-muted-foreground shrink-0">
            {lastMessageTime}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={cn("rounded-lg px-2 py-0.5 text-xs", interest.className)}
        >
          {interest.emoji} {interest.label}
        </Badge>
        <Badge
          variant="outline"
          className="rounded-lg px-2 py-0.5 text-xs border-border/60 bg-background"
        >
          {rankLabels[conversation.rank] || "Other"}
        </Badge>
      </div>
    </button>
  );
}

