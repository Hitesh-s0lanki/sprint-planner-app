"use client";

import { useState } from "react";
import { ThreadListItem } from "./thread-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvestorConversation } from "@/modules/investors/types";
import type { InterestLevel } from "@/modules/investors/types";
import { MessageSquarePlus } from "lucide-react";

interface InvestorThreadListProps {
  conversations: InvestorConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
  onFilterChange?: (filter: InterestLevel | "all") => void;
  onSortChange?: (sort: "recent" | "highest_interest" | "oldest") => void;
}

export function InvestorThreadList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading,
  onFilterChange,
  onSortChange,
}: InvestorThreadListProps) {
  const [filter, setFilter] = useState<InterestLevel | "all">("all");
  const [sort, setSort] = useState<"recent" | "highest_interest" | "oldest">(
    "recent"
  );

  const handleFilterChange = (value: InterestLevel | "all") => {
    setFilter(value);
    onFilterChange?.(value);
  };

  const handleSortChange = (value: "recent" | "highest_interest" | "oldest") => {
    setSort(value);
    onSortChange?.(value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full border-r bg-background">
        <div className="p-4 border-b space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="exploring">Exploring</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="highest_interest">Highest Interest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                No investor conversations yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Investors will appear here once they send you a message. Share your investor link to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r bg-background w-full md:w-[35%]">
      {/* Filters */}
      <div className="p-4 border-b space-y-2">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">🔥 High</SelectItem>
              <SelectItem value="warm">🙂 Warm</SelectItem>
              <SelectItem value="exploring">🤔 Exploring</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="highest_interest">Highest Interest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ThreadListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
}

