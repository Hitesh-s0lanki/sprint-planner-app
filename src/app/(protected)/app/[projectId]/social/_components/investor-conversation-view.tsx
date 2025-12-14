"use client";

import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";
import { ConversationHeader } from "./conversation-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
  onBack?: () => void;
  showBackButton?: boolean;
}

export function InvestorConversationView({
  conversation,
  messages,
  isLoading,
  isLoadingMessages,
  onSendMessage,
  onBack,
  showBackButton = false,
}: InvestorConversationViewProps) {
  if (isLoading || !conversation) {
    return (
      <div className="flex flex-col h-full bg-background flex-1 min-w-0">
        <div className="p-3 sm:p-4 border-b space-y-2 sm:space-y-3 shrink-0">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
          <Skeleton className="h-4 w-24 sm:w-32" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 sm:gap-3">
              <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-20 sm:w-24" />
                <Skeleton className="h-16 sm:h-20 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col h-full bg-background flex-1 items-center justify-center p-4 sm:p-8 min-w-0">
        <div className="text-center space-y-2 max-w-sm px-4">
          <h3 className="font-semibold text-base sm:text-lg text-muted-foreground">
            Select a conversation
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Choose an investor from the left to view the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background flex-1 min-w-0">
      {showBackButton && onBack && (
        <div className="flex items-center gap-2 p-2 sm:p-4 border-b bg-background shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}
      <ConversationHeader conversation={conversation} />
      <MessageList messages={messages} isLoading={isLoadingMessages} />
      <MessageComposer onSend={onSendMessage} />
    </div>
  );
}
