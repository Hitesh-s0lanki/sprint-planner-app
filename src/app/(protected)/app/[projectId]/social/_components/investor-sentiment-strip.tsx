"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { InvestorSummary } from "@/modules/investors/types";
import { formatDistanceToNow } from "date-fns";

interface InvestorSentimentStripProps {
  summary: InvestorSummary | null;
  isLoading?: boolean;
}

export function InvestorSentimentStrip({
  summary,
  isLoading,
}: InvestorSentimentStripProps) {
  if (isLoading || !summary) {
    return (
      <div className="flex gap-3 p-4 border-b bg-muted/30">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-4 border-b bg-muted/30 overflow-x-auto">
      <Badge
        variant="outline"
        className="rounded-xl px-3 py-1.5 border-border/60 bg-background"
      >
        <span className="text-xs font-medium">Total Investors:</span>
        <span className="ml-1.5 font-semibold">{summary.totalInvestors}</span>
      </Badge>

      <Badge
        variant="outline"
        className="rounded-xl px-3 py-1.5 border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300"
      >
        <span className="text-xs">🔥 High:</span>
        <span className="ml-1.5 font-semibold">{summary.highInterest}</span>
      </Badge>

      <Badge
        variant="outline"
        className="rounded-xl px-3 py-1.5 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
      >
        <span className="text-xs">🙂 Warm:</span>
        <span className="ml-1.5 font-semibold">{summary.warm}</span>
      </Badge>

      <Badge
        variant="outline"
        className="rounded-xl px-3 py-1.5 border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
      >
        <span className="text-xs">🤔 Exploring:</span>
        <span className="ml-1.5 font-semibold">{summary.exploring}</span>
      </Badge>

      {summary.lastActivity && (
        <Badge
          variant="outline"
          className="rounded-xl px-3 py-1.5 border-border/60 bg-background ml-auto"
        >
          <span className="text-xs font-medium">Last Activity:</span>
          <span className="ml-1.5 text-xs">
            {formatDistanceToNow(summary.lastActivity, { addSuffix: true })}
          </span>
        </Badge>
      )}
    </div>
  );
}

