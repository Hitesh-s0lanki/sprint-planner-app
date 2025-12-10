"use client";

import { IdeasChatHeader } from "./ideas-chat-header";
import { IdeasChatMessages } from "./ideas-chat-messages";
import { IdeasChatInput } from "./ideas-chat-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Message } from "./ideas-app-shell";

interface IdeasChatPanelProps {
  activeStep: number;
  stepName: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onOpenSteps?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function IdeasChatPanel({
  activeStep,
  stepName,
  messages,
  onSendMessage,
  onOpenSteps,
  isLoading = false,
  error,
}: IdeasChatPanelProps) {
  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-white">
      <IdeasChatHeader
        activeStep={activeStep}
        stepName={stepName}
        onOpenSteps={onOpenSteps}
      />

      {/* Error Alert */}
      {error && (
        <div className="px-4 pt-4 shrink-0">
          <Alert
            variant="destructive"
            className="border-destructive/50 bg-destructive/10"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <IdeasChatMessages messages={messages} />
      <IdeasChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
