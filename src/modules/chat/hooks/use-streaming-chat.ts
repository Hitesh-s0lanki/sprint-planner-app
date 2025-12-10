"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { ChatResponse, ConnectionStatus, UserPreferences } from "../types";

// Internal types for streaming and hook options
interface StreamingChatResponse {
  message?: string;
  connection_status?: ConnectionStatus;
  idea_state_stage: number;
  error?: string;
  error_message?: string;
  done?: boolean;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
}

interface UseStreamingChatOptions {
  apiUrl?: string;
  sessionId: string;
  userId?: string;
  ideaStateStage: number;
  onError?: (error: Error) => void;
  onStageChange?: (stage: number) => void;
  onInitialMessages?: (messages: ChatMessage[]) => void;
  autoConnect?: boolean;
}

/**
 * Get the AI server URL from environment variables
 */
function getAIServerUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_AI_SERVER_URL || "http://localhost:8000/api";
  }
  return process.env.AI_SERVER_URL || "http://localhost:8000/api";
}

export function useStreamingChat(options: UseStreamingChatOptions) {
  const {
    apiUrl,
    sessionId,
    onError,
    onStageChange,
    onInitialMessages,
    autoConnect = true,
  } = options;

  const { user } = useUser();
  const defaultApiUrl = apiUrl || `${getAIServerUrl()}/streaming`;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationHistoryRef = useRef<ChatMessage[]>([]);
  const isConnectingRef = useRef(false);
  const hasErrorRef = useRef(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ideaStateStageRef = useRef<number>(options.ideaStateStage);

  // Keep ideaStateStage ref in sync with latest value from options
  useEffect(() => {
    ideaStateStageRef.current = options.ideaStateStage;
  }, [options.ideaStateStage]);

  // Helper function to get user preferences from Clerk user
  const getUserPreferences = useCallback((): UserPreferences | null => {
    if (!user) return null;

    const userPreferences: UserPreferences = {};

    if (user.id) {
      userPreferences.user_id = user.id;
    }

    if (user.fullName) {
      userPreferences.user_name = user.fullName;
    } else if (user.firstName || user.lastName) {
      userPreferences.user_name = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");
    }

    if (user.emailAddresses && user.emailAddresses.length > 0) {
      userPreferences.user_email = user.emailAddresses[0]?.emailAddress;
    }

    // Only return preferences if at least one field is set
    if (
      userPreferences.user_id ||
      userPreferences.user_name ||
      userPreferences.user_email
    ) {
      return userPreferences;
    }

    return null;
  }, [user]);

  const connect = useCallback(async () => {
    if (isConnectingRef.current || isConnected) return;
    // Don't retry if we already have an error (prevent shaking)
    if (hasErrorRef.current) return;

    isConnectingRef.current = true;
    // Only clear error if we're explicitly connecting (not auto-retrying)
    if (!hasErrorRef.current) {
      setError(null);
    }

    try {
      // Connection started request - only session_id and connection_status
      const userPreferences = getUserPreferences();
      const requestBody = {
        connection_status: "started" as ConnectionStatus,
        session_id: sessionId,
        user_preferences: userPreferences,
      };

      const response = await fetch(defaultApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.error || errorData.error_message) {
            errorMessage = errorData.error || errorData.error_message;
          } else if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : errorData.detail[0]?.msg || errorMessage;
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Parse the response
      const responseData: ChatResponse = await response.json();

      // Handle initial messages from "started" response
      if (responseData.messages && responseData.messages.length > 0) {
        const initialMessages: ChatMessage[] = responseData.messages.map(
          (msg) => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content,
            metadata: msg.metadata,
          })
        );
        conversationHistoryRef.current.push(...initialMessages);
        onInitialMessages?.(initialMessages);
      }

      // Handle stage from response - this is the stage from the last chat session
      // Always update the stage from the ChatResponse, even if it's 0
      if (onStageChange && typeof responseData.idea_state_stage === "number") {
        onStageChange(responseData.idea_state_stage);
      }

      setIsConnected(true);
      hasErrorRef.current = false; // Clear error flag on success
    } catch (err) {
      // Prevent multiple error updates
      if (hasErrorRef.current) {
        isConnectingRef.current = false;
        return;
      }

      let errorMessage = "Failed to connect to the AI server";
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMessage =
          "Unable to connect to the AI server. Please check if the server is running.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      hasErrorRef.current = true;
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      isConnectingRef.current = false;
    }
  }, [
    defaultApiUrl,
    sessionId,
    isConnected,
    onError,
    onInitialMessages,
    onStageChange,
    getUserPreferences,
  ]);

  const sendMessage = useCallback(
    async (
      message: string,
      onChunk?: (chunk: string) => void,
      onComplete?: (fullResponse: string) => void
    ) => {
      if (!message.trim()) return;

      // Ensure connection is established before sending messages
      if (!isConnected) {
        await connect();
        // If connection failed, don't proceed with sending message
        if (hasErrorRef.current) {
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      // Clear error when user sends a new message (explicit retry)
      if (hasErrorRef.current) {
        hasErrorRef.current = false;
        setError(null);
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Add user message to conversation history
      const userMessage: ChatMessage = { role: "user", content: message };
      conversationHistoryRef.current.push(userMessage);

      let fullResponse = "";
      let buffer = "";

      try {
        // Send message with active connection status - only session_id, connection_status, and user_message
        const userPreferences = getUserPreferences();
        // Always use the latest ideaStateStage value
        const requestBody = {
          connection_status: "active" as ConnectionStatus,
          session_id: sessionId,
          user_message: message,
          user_preferences: userPreferences,
          idea_state_stage: ideaStateStageRef.current,
        };

        const response = await fetch(defaultApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;

          try {
            const errorData = await response.json();
            if (errorData.error || errorData.error_message) {
              errorMessage = errorData.error || errorData.error_message;
            } else if (errorData.detail) {
              errorMessage =
                typeof errorData.detail === "string"
                  ? errorData.detail
                  : errorData.detail[0]?.msg || errorMessage;
            }
          } catch {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        // Check if response is streaming or a single JSON response
        const contentType = response.headers.get("content-type") || "";
        const isStreaming =
          contentType.includes("text/event-stream") ||
          contentType.includes("stream");

        if (isStreaming) {
          // Handle streaming response
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error("No response body");
          }

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            // Keep the last incomplete line in buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  // Handle SSE format (data: {...})
                  const cleanLine = line.startsWith("data: ")
                    ? line.slice(6)
                    : line;

                  const data: StreamingChatResponse = JSON.parse(cleanLine);

                  // Handle error in stream
                  if (data.error || data.error_message) {
                    throw new Error(
                      data.error || data.error_message || "An error occurred"
                    );
                  }

                  // Handle stage changes
                  if (data.idea_state_stage !== undefined && onStageChange) {
                    onStageChange(data.idea_state_stage);
                  }

                  // Handle message chunks
                  if (data.message) {
                    const chunk = data.message;
                    fullResponse += chunk;
                    onChunk?.(chunk);
                  }

                  // Check if stream is done
                  if (data.done) {
                    break;
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                  if (e instanceof SyntaxError) {
                    console.warn("Error parsing JSON line:", e, line);
                    continue;
                  }
                  // Re-throw if it's an actual error
                  throw e;
                }
              }
            }
          }

          // Process any remaining buffer
          if (buffer.trim()) {
            try {
              const cleanLine = buffer.startsWith("data: ")
                ? buffer.slice(6)
                : buffer;
              const data: StreamingChatResponse = JSON.parse(cleanLine);

              if (data.error || data.error_message) {
                throw new Error(
                  data.error || data.error_message || "An error occurred"
                );
              }

              if (data.idea_state_stage !== undefined && onStageChange) {
                onStageChange(data.idea_state_stage);
              }

              if (data.message) {
                const chunk = data.message;
                fullResponse += chunk;
                onChunk?.(chunk);
              }
            } catch (e) {
              // Ignore parse errors for incomplete final line
              if (!(e instanceof SyntaxError)) {
                throw e;
              }
            }
          }

          // Add assistant response to conversation history
          if (fullResponse) {
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: fullResponse,
            };
            conversationHistoryRef.current.push(assistantMessage);
          }

          onComplete?.(fullResponse);
        } else {
          // Handle single JSON response (non-streaming)
          const responseData: ChatResponse & {
            formatted_output?: {
              state?: string;
              [key: string]: unknown;
            };
          } = await response.json();

          // Handle error
          if (responseData.error_message) {
            throw new Error(responseData.error_message);
          }

          // Handle stage changes from ChatResponse
          if (responseData.idea_state_stage !== undefined && onStageChange) {
            onStageChange(responseData.idea_state_stage);
          }

          // Use response_content for the assistant message
          if (responseData.response_content) {
            fullResponse = responseData.response_content;

            // Call onChunk with the full response at once (not streaming)
            onChunk?.(fullResponse);

            // Add assistant response to conversation history
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: fullResponse,
            };
            conversationHistoryRef.current.push(assistantMessage);

            onComplete?.(fullResponse);
          } else {
            // No response content
            onComplete?.("");
          }
        }
      } catch (err) {
        // Don't set error if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        // Remove user message from history if request failed
        conversationHistoryRef.current.pop();

        // Provide more helpful error messages
        let errorMessage = "An error occurred";
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          errorMessage =
            "Unable to connect to the AI server. Please check if the server is running.";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        // Only set error if not already set (prevent shaking)
        if (!hasErrorRef.current) {
          hasErrorRef.current = true;
          setError(errorMessage);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      defaultApiUrl,
      sessionId,
      onError,
      onStageChange,
      isConnected,
      connect,
      getUserPreferences,
    ]
  );

  const clearHistory = useCallback(() => {
    conversationHistoryRef.current = [];
  }, []);

  const getHistory = useCallback(() => {
    return [...conversationHistoryRef.current];
  }, []);

  // Auto-connect on mount if enabled (only once, don't retry on error)
  useEffect(() => {
    if (
      autoConnect &&
      !isConnected &&
      !isConnectingRef.current &&
      !hasErrorRef.current
    ) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  // Clear error timeout on unmount
  useEffect(() => {
    const timeoutId = errorTimeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const clearError = useCallback(() => {
    hasErrorRef.current = false;
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    hasErrorRef.current = false;
    setError(null);
    await connect();
  }, [connect]);

  return {
    sendMessage,
    connect,
    isLoading,
    error,
    isConnected,
    cancel,
    clearHistory,
    getHistory,
    clearError,
    retry,
  };
}
