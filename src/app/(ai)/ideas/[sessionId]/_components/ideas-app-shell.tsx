"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { IdeasChatPanel } from "./ideas-chat-panel";
import { IdeasStepsDrawer } from "./ideas-steps-drawer";
import { Spinner } from "@/components/ui/spinner";
import {
  createSession,
  continueSession,
  type ChatMessage,
} from "@/lib/ai-client";

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

const FIRST_MESSAGE =
  "Hey! 👋 Welcome to SprintPlanner. Tell me about the idea you're excited to build — even a rough thought is enough. Let's shape it together.";

export function IdeasAppShell({ sessionId, projectName }: IdeasAppShellProps) {
  // Props reserved for future use
  void projectName;

  const { user } = useUser();
  const [activeStep] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const hasInitialized = useRef(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  const stepName = STEP_NAMES[activeStep] || "Unknown Step";

  // Connect to agent on mount or when sessionId changes
  useEffect(() => {
    const connectToAgent = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);
        
        const userId = user?.id;
        let response;

        // Try to continue existing session if we have a sessionId
        if (sessionId && currentSessionIdRef.current !== sessionId) {
          // First time connecting to this session - try to continue it
          // Use empty messages array for initial connection
          try {
            response = await continueSession(sessionId, [], userId);
            currentSessionIdRef.current = sessionId;
          } catch (error) {
            // If session doesn't exist (404), create a new one
            if (error instanceof Error && error.message.includes("not found")) {
              response = await createSession(userId);
              currentSessionIdRef.current = sessionId;
            } else {
              throw error; // Re-throw other errors
            }
          }
        } else if (!currentSessionIdRef.current) {
          // No session yet - create new one
          response = await createSession(userId);
          currentSessionIdRef.current = sessionId;
        } else {
          // Already connected to this session, just mark as connected
          setIsConnecting(false);
          return;
        }

        if (response.connection_status === "active") {
          setIsConnecting(false);
          
          // If we have existing messages from the response, load them
          if (response.messages && response.messages.length > 0) {
            const loadedMessages: Message[] = response.messages.map((msg, idx) => ({
              id: `loaded-${idx}-${Date.now()}`,
              role: msg.role as "user" | "assistant",
              content: msg.content,
              timestamp: new Date(),
            }));
            setMessages(loadedMessages);
          }
        } else {
          throw new Error(
            response.connection_status === "error"
              ? "Server returned an error status"
              : "Connection is not active"
          );
        }
      } catch (error) {
        // Handle errors gracefully - don't throw, just show error state
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to connect to agent. Please try again after some time.";
        setConnectionError(errorMessage);
        setIsConnecting(false);
      }
    };

    // Only connect if user is loaded (or if we don't require user)
    // Wait a bit for user to be available
    if (user !== undefined) {
      connectToAgent();
    }
  }, [sessionId, user]);

  // Initialize with streaming first message (only after connection is established)
  useEffect(() => {
    // Only start streaming after connection is established and no messages exist
    if (isConnecting || connectionError || hasInitialized.current || messages.length > 0) return;
    hasInitialized.current = true;

    // Create initial typing message
    const typingMsg: Message = {
      id: "first-message-typing",
      role: "assistant",
      content: "",
      isTyping: true,
      timestamp: new Date(),
    };

    // Use setTimeout to defer the initial setState
    timeoutRef.current = setTimeout(() => {
      setMessages([typingMsg]);

      // Simulate streaming the first message
      let currentIndex = 0;
      streamIntervalRef.current = setInterval(() => {
        currentIndex += 4; // Stream 4 characters at a time for faster streaming
        if (currentIndex >= FIRST_MESSAGE.length) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          // Replace typing message with complete message
          setMessages([
            {
              id: "first-message",
              role: "assistant",
              content: FIRST_MESSAGE,
              timestamp: new Date(),
            },
          ]);
        } else {
          // Update typing message with partial content
          setMessages([
            {
              id: "first-message-typing",
              role: "assistant",
              content: FIRST_MESSAGE.slice(0, currentIndex),
              isTyping: true,
              timestamp: new Date(),
            },
          ]);
        }
      }, 15); // 15ms per chunk for faster streaming
    }, 0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    };
  }, [isConnecting, connectionError, messages.length]);

  const handleSendMessage = async (text: string) => {
    if (isSendingMessage) return; // Prevent multiple simultaneous sends
    
    setIsSendingMessage(true);
    
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Show typing indicator
    const typingMsg: Message = {
      id: `typing-${Date.now()}`,
      role: "assistant",
      content: "",
      isTyping: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      // Prepare messages for API (exclude typing indicators)
      const chatMessages: ChatMessage[] = [
        ...messages.filter((m) => !m.isTyping),
        {
          role: "user",
          content: text,
        },
      ].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const userId = user?.id;
      const currentSession = currentSessionIdRef.current || sessionId;

      // Send message to API
      const response = await continueSession(currentSession, chatMessages, userId);

      // Debug logging (remove in production if needed)
      console.log("API Response:", {
        connection_status: response.connection_status,
        response_length: response.response?.length || 0,
        has_response: !!response.response,
        messages_count: response.messages?.length || 0,
        full_response: response,
      });

      if (response.connection_status === "active") {
        // Remove typing indicator and add assistant response
        if (response.response && response.response.trim()) {
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response.response,
            timestamp: new Date(),
          };
          setMessages((prev) =>
            prev.filter((m) => !m.isTyping).concat(assistantMsg)
          );
        } else if (response.messages && response.messages.length > 0) {
          // If response field is empty but we have messages, use the last assistant message
          const lastMessage = response.messages[response.messages.length - 1];
          if (lastMessage.role === "assistant" && lastMessage.content) {
            const assistantMsg: Message = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: lastMessage.content,
              timestamp: new Date(),
            };
            setMessages((prev) =>
              prev.filter((m) => !m.isTyping).concat(assistantMsg)
            );
          } else {
            // If no response, remove typing indicator and show a message
            setMessages((prev) => prev.filter((m) => !m.isTyping));
            console.warn("API returned active status but no response content");
          }
        } else {
          // If no response, remove typing indicator and show a helpful message
          setMessages((prev) => {
            const withoutTyping = prev.filter((m) => !m.isTyping);
            // Add a message indicating the API didn't return a response
            return [
              ...withoutTyping,
              {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "I received your message, but didn't get a response from the server. Please try again or check if the AI server is running.",
                timestamp: new Date(),
              },
            ];
          });
          console.warn("API returned active status but no response content or messages", response);
        }

        // Handle frontend actions if any
        if (response.frontend_action) {
          // TODO: Handle frontend actions (e.g., send_email)
          console.log("Frontend action received:", response.frontend_action);
        }
      } else {
        throw new Error("Connection is not active");
      }
    } catch (error) {
      // Handle errors gracefully - show error message but don't throw
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => !m.isTyping));

      // Show error state
      setConnectionError(errorMessage);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Show loading state while connecting
  if (isConnecting) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-1 items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Spinner className="h-6 w-6 text-slate-900" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-900">
                Connecting to the agent
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Setting up your session...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if connection failed
  if (connectionError) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-1 items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4 max-w-md px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-900">
                Connection Error
              </p>
              <p className="mt-2 text-sm text-slate-600">{connectionError}</p>
            </div>
            <button
              onClick={async () => {
                setConnectionError(null);
                setIsRetrying(true);
                setIsConnecting(true);
                hasInitialized.current = false; // Reset to allow first message to stream again
                
                // Retry connection
                try {
                  const userId = user?.id;
                  let response;

                  // Try to continue existing session if we have a sessionId
                  if (sessionId) {
                    try {
                      response = await continueSession(sessionId, [], userId);
                      currentSessionIdRef.current = sessionId;
                    } catch (error) {
                      // If session doesn't exist (404), create a new one
                      if (error instanceof Error && error.message.includes("not found")) {
                        response = await createSession(userId);
                        currentSessionIdRef.current = sessionId;
                      } else {
                        throw error; // Re-throw other errors
                      }
                    }
                  } else if (currentSessionIdRef.current) {
                    // Continue existing session
                    response = await continueSession(
                      currentSessionIdRef.current,
                      [],
                      userId
                    );
                  } else {
                    // Create new session
                    response = await createSession(userId);
                    currentSessionIdRef.current = sessionId;
                  }

                  if (response.connection_status === "active") {
                    setIsConnecting(false);
                    setIsRetrying(false);
                    
                    // If we have existing messages from the response, load them
                    if (response.messages && response.messages.length > 0) {
                      const loadedMessages: Message[] = response.messages.map(
                        (msg, idx) => ({
                          id: `loaded-${idx}-${Date.now()}`,
                          role: msg.role as "user" | "assistant",
                          content: msg.content,
                          timestamp: new Date(),
                        })
                      );
                      setMessages(loadedMessages);
                    }
                  } else {
                    throw new Error("Connection is not active");
                  }
                } catch (error) {
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : "Failed to connect to agent. Please try again after some time.";
                  setConnectionError(errorMessage);
                  setIsConnecting(false);
                  setIsRetrying(false);
                }
              }}
              disabled={isRetrying}
              className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRetrying ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Retrying...
                </>
              ) : (
                "Try Again"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat Panel */}
      <IdeasChatPanel
        activeStep={activeStep}
        stepName={stepName}
        messages={messages}
        onSendMessage={handleSendMessage}
        onOpenSteps={() => setSidebarOpen(true)}
        isLoading={isSendingMessage}
      />

      {/* Mobile Drawer */}
      <IdeasStepsDrawer
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activeStep={activeStep}
      />
    </div>
  );
}

// Dummy reply generator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateDummyReply(_userMessage: string): string {
  const replies = [
    "That's a great point! Let me help you think through this.",
    "Interesting. Can you tell me more about that?",
    "I understand. Let's explore this further.",
    "Good insight. How do you see this fitting into your overall plan?",
    "Thanks for sharing. What's the next step you're considering?",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
