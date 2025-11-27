"use client";

import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";
import { ConversationHeader } from "./conversation-header";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  InvestorConversation,
  InvestorMessage,
} from "@/modules/investors/types";

interface InvestorConversationViewProps {
  conversation: InvestorConversation | null;
  messages: InvestorMessage[];
  isLoading?: boolean;
  isLoadingMessages?: boolean;
  onSendMessage: (body: string, tags?: string) => Promise<void>;
}

export function InvestorConversationView({
  conversation,
  messages,
  isLoading,
  isLoadingMessages,
  onSendMessage,
}: InvestorConversationViewProps) {
  if (isLoading || !conversation) {
    return (
      <div className="flex flex-col h-full bg-background flex-1">
        <div className="p-4 border-b space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col h-full bg-background flex-1 items-center justify-center p-8">
        <div className="text-center space-y-2 max-w-sm">
          <h3 className="font-semibold text-lg text-muted-foreground">
            Select a conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose an investor from the left to view the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background flex-1">
      <ConversationHeader conversation={conversation} />
      <MessageList
        messages={messages}
        isLoading={isLoadingMessages}
      />
      <MessageComposer onSend={onSendMessage} />
    </div>
  );
}

