"use client";

import { Badge } from "@/components/ui/badge";
import type { InvestorConversation } from "@/modules/investors/types";
import { formatDistanceToNow } from "date-fns";

const rankLabels: Record<string, string> = {
  tier_a_vc: "Tier A",
  tier_b_vc: "Tier B",
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

export function ConversationHeader({
  conversation,
}: {
  conversation: InvestorConversation;
}) {
  const interest =
    interestConfig[conversation.interestLevel] || interestConfig.exploring;
  const startedTime = formatDistanceToNow(conversation.createdAt, {
    addSuffix: true,
  });
  const lastActiveTime = conversation.lastMessageAt
    ? formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })
    : null;

  return (
    <div className="p-4 border-b bg-muted/30 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          Investor #{conversation.investorNumber}
        </h2>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Badge
          variant="outline"
          className={`rounded-lg px-2.5 py-1 text-xs ${interest.className}`}
        >
          {interest.emoji} {interest.label}
        </Badge>
        <Badge
          variant="outline"
          className="rounded-lg px-2.5 py-1 text-xs border-border/60 bg-background"
        >
          {rankLabels[conversation.rank] || "Other"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Started {startedTime}
        </span>
        {lastActiveTime && (
          <span className="text-xs text-muted-foreground">
            Last active {lastActiveTime}
          </span>
        )}
      </div>
    </div>
  );
}

