"use client";

import { IdeasChatHeader } from "./ideas-chat-header";
import { IdeasChatMessages } from "./ideas-chat-messages";
import { IdeasChatInput } from "./ideas-chat-input";
import type { Message } from "./ideas-app-shell";

interface IdeasChatPanelProps {
  activeStep: number;
  stepName: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onOpenSteps?: () => void;
  isLoading?: boolean;
}

export function IdeasChatPanel({
  activeStep,
  stepName,
  messages,
  onSendMessage,
  onOpenSteps,
  isLoading = false,
}: IdeasChatPanelProps) {
  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-white">
      <IdeasChatHeader
        activeStep={activeStep}
        stepName={stepName}
        onOpenSteps={onOpenSteps}
      />
      <IdeasChatMessages messages={messages} />
      <IdeasChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
