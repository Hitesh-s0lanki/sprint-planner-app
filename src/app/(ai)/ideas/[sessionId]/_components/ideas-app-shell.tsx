"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { IdeasChatPanel } from "./ideas-chat-panel";
import { IdeasStepsDrawer } from "./ideas-steps-drawer";
import { IdeasLoadingSteps } from "./ideas-loading-steps";
import { useStreamingChat } from "@/modules/chat/hooks/use-streaming-chat";
import { useIdeasStage } from "./ideas-stage-context";

const STEP_NAMES: Record<number, string> = {
  1: "Ideas Information",
  2: "Auth",
  3: "User Group",
  4: "Market Research",
  5: "TAM",
  6: "Task Generation",
};

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
};

interface IdeasAppShellProps {
  sessionId: string;
  projectName?: string;
}

export function IdeasAppShell({ sessionId, projectName }: IdeasAppShellProps) {
  // Props reserved for future use
  void projectName;

  const { user } = useUser();
  const { activeStep, setActiveStep } = useIdeasStage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const assistantMessageIdRef = useRef<string | null>(null);

  const stepName = STEP_NAMES[activeStep] || "Unknown Step";

  const { sendMessage, isLoading, error, cancel } = useStreamingChat({
    sessionId,
    userId: user?.id,
    ideaStateStage: activeStep,
    onError: (err) => {
      console.error("Streaming chat error:", err);
    },
    onStageChange: (stage) => {
      setActiveStep(stage);
    },
    onInitialMessages: (initialMessages) => {
      // Add initial messages from connection response
      const formattedMessages: Message[] = initialMessages.map((msg) => ({
        id: crypto.randomUUID(),
        role: msg.role as "assistant" | "user",
        content: msg.content,
        timestamp: new Date(),
      }));
      setMessages((prev) => [...prev, ...formattedMessages]);
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      // Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Create assistant message placeholder for streaming
      const assistantId = crypto.randomUUID();
      assistantMessageIdRef.current = assistantId;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          isTyping: true,
          timestamp: new Date(),
        },
      ]);

      try {
        // Stream the response
        await sendMessage(
          text,
          (chunk) => {
            // Update the assistant message with each chunk
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantId) {
                  return {
                    ...msg,
                    content: msg.content + chunk,
                    isTyping: true,
                  };
                }
                return msg;
              })
            );
          },
          (fullResponse) => {
            // Response is complete
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: fullResponse || "No response received.",
                      isTyping: false,
                    }
                  : msg
              )
            );
            assistantMessageIdRef.current = null;
          }
        );
      } catch (error) {
        // Handle error - remove typing indicator and show error message
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== assistantId)
            .map((msg) => {
              if (msg.id === userMsg.id) {
                return msg;
              }
              return msg;
            })
        );
        assistantMessageIdRef.current = null;
      }
    },
    [sendMessage, isLoading]
  );

  // Show loading component when stage is 9
  const isFinalStage = activeStep === 9;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Show loading component when stage is 9, otherwise show chat panel */}
      {isFinalStage ? (
        <IdeasLoadingSteps />
      ) : (
        <IdeasChatPanel
          activeStep={activeStep}
          stepName={stepName}
          messages={messages}
          onSendMessage={handleSendMessage}
          onOpenSteps={() => setSidebarOpen(true)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Mobile Drawer */}
      <IdeasStepsDrawer
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activeStep={activeStep}
      />
    </div>
  );
}
