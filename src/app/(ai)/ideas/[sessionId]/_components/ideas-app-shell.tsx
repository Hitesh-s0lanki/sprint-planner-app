"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IdeasChatPanel } from "./ideas-chat-panel";
import { IdeasStepsDrawer } from "./ideas-steps-drawer";
import { IdeasLoadingSteps } from "./ideas-loading-steps";
import { IdeasAuthView } from "./ideas-auth-view";
import { useStreamingChat } from "@/modules/chat/hooks/use-streaming-chat";
import { useIdeasStage } from "./ideas-stage-context";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { ConnectionStatus, EventType, Event } from "@/modules/chat/types";

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
  const router = useRouter();
  const trpc = useTRPC();
  const { activeStep, setActiveStep } = useIdeasStage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthView, setShowAuthView] = useState(false);
  const [eventProgress, setEventProgress] = useState<
    Partial<Record<EventType, "idle" | "started" | "completed">>
  >({});
  const [isEventsCompleted, setIsEventsCompleted] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const hasCheckedUserRef = useRef(false);
  const hasRedirectedRef = useRef(false);
  const hasSentStartGeneratingRef = useRef(false);

  const stepName = STEP_NAMES[activeStep] || "Unknown Step";

  // Query to check if user exists in database
  const checkUserExistsQueryOptions =
    trpc.clerkAuth.checkUserExists.queryOptions();
  const { refetch: checkUserExists } = useQuery({
    ...checkUserExistsQueryOptions,
    enabled: false, // Only run when explicitly called
    retry: false,
  });

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
    onConnectionStatusChange: async (
      status: ConnectionStatus,
      stage: number
    ) => {
      // Handle stage 9 with "started" or "active" status
      if (stage === 9 && (status === "started" || status === "active")) {
        // Only send "start generating" once for stage 9
        if (hasSentStartGeneratingRef.current) return;

        // Only check once per occurrence
        if (hasCheckedUserRef.current) return;
        hasCheckedUserRef.current = true;

        // Check if Clerk user exists
        if (!user?.id) {
          // No Clerk user, show auth view
          setShowAuthView(true);
          return;
        }

        // Check if user exists in database
        try {
          const result = await checkUserExists();
          const userExists = result.data?.data?.exists ?? false;

          if (!userExists) {
            // User doesn't exist in database, show auth view
            setShowAuthView(true);
          } else {
            // User exists, send "start generating" only once
            hasSentStartGeneratingRef.current = true;
            await sendMessage("start generating");
          }
        } catch (error) {
          console.error("Error checking user existence:", error);
          // On error, show auth view to be safe
          setShowAuthView(true);
        }
      } else {
        // Reset the check flag when stage changes away from 9
        if (stage !== 9) {
          hasCheckedUserRef.current = false;
          hasSentStartGeneratingRef.current = false;
        }
      }

      // Handle events_completed status
      if (status === "events_completed") {
        setIsEventsCompleted(true);
      }
    },
    onEvent: (event: Event) => {
      // Update event progress based on event type and status
      setEventProgress((prev) => {
        const newProgress = { ...prev };
        if (event.event_status === "started") {
          newProgress[event.event_type] = "started";
        } else if (event.event_status === "completed") {
          newProgress[event.event_type] = "completed";
        }

        // Extract project_id from completed event
        if (
          event.event_type === "completed" &&
          event.event_status === "completed" &&
          event.project_id
        ) {
          setProjectId(event.project_id);
        }

        return newProgress;
      });
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
      } catch {
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

  // Show loading component when stage is 9 and not showing auth view
  const isFinalStage = activeStep === 9 && !showAuthView;

  // Handle redirect after events are completed
  useEffect(() => {
    if (
      isEventsCompleted &&
      projectId &&
      !hasRedirectedRef.current &&
      !showAuthView
    ) {
      hasRedirectedRef.current = true;
      // Small delay to show completion state before redirect
      const redirectTimeout = setTimeout(async () => {
        // Change session ID after all events are completed
        try {
          const response = await fetch("/api/session/clear", {
            method: "POST",
          });

          if (response.ok) {
            // Session ID has been changed, now redirect
            router.push(`/app/${projectId}/board`);
          } else {
            // Even if session clear fails, still redirect
            console.error("Failed to clear session, redirecting anyway");
            router.push(`/app/${projectId}/board`);
          }
        } catch (error) {
          // Even if session clear fails, still redirect
          console.error("Error clearing session, redirecting anyway:", error);
          router.push(`/app/${projectId}/board`);
        }
      }, 1000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isEventsCompleted, projectId, showAuthView, router]);

  // Mutation to create user if they don't exist
  const createUserMutation = useMutation(
    trpc.clerkAuth.createUser.mutationOptions({
      onError: (err) => {
        console.error("Error creating user:", err);
      },
    })
  );

  // Handle sign-up/sign-in completion
  useEffect(() => {
    if (user?.id && showAuthView && activeStep === 9) {
      // User has signed up/signed in, check if they exist in database now
      const handleUserAuth = async () => {
        // Only send "start generating" once for stage 9
        if (hasSentStartGeneratingRef.current) {
          setShowAuthView(false);
          return;
        }

        try {
          const result = await checkUserExists();
          const userExists = result.data?.data?.exists ?? false;

          if (userExists) {
            // User exists now, close auth view and send message only once
            setShowAuthView(false);
            hasSentStartGeneratingRef.current = true;
            await sendMessage("start generating");
          } else {
            // User doesn't exist in database, try to create them
            try {
              await createUserMutation.mutateAsync();
              // After creating user, check again and send message only once
              const checkResult = await checkUserExists();
              const existsAfterCreate = checkResult.data?.data?.exists ?? false;
              if (existsAfterCreate) {
                setShowAuthView(false);
                hasSentStartGeneratingRef.current = true;
                await sendMessage("start generating");
              }
            } catch (createErr) {
              console.error("Error creating user:", createErr);
            }
          }
        } catch (err) {
          console.error("Error checking user after auth:", err);
        }
      };

      handleUserAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, showAuthView, activeStep]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Show auth view if user needs to authenticate */}
      {showAuthView ? (
        <IdeasAuthView />
      ) : isFinalStage ? (
        <IdeasLoadingSteps
          eventProgress={eventProgress}
          isCompleted={isEventsCompleted}
          isRedirecting={hasRedirectedRef.current}
        />
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
      {!showAuthView && (
        <IdeasStepsDrawer
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          activeStep={activeStep}
        />
      )}
    </div>
  );
}
