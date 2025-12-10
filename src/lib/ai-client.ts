/**
 * AI Streaming API Client
 * Handles communication with the AI streaming endpoint
 */

export type ChatRequestType = "session_started" | "session_ongoing";

export interface ChatMessage {
  role: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface FrontendAction {
  tool_name?: string;
  args?: {
    email?: string;
    [key: string]: unknown;
  };
}

export interface ChatRequest {
  request_type: ChatRequestType;
  session_id?: string;
  user_id?: string;
  messages: ChatMessage[];
  frontend_action?: FrontendAction;
  idea_state_stage: number;
}

export interface ChatResponse {
  connection_status: "active" | "error" | "disactive";
  messages: ChatMessage[];
  response: string;
  frontend_action?: FrontendAction | null;
}

export interface AIApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

/**
 * Get the AI server URL from environment variables
 * For client-side, use NEXT_PUBLIC_AI_SERVER_URL (required for client-side access)
 * For server-side, use AI_SERVER_URL
 * Falls back to default if not set
 */
function getAIServerUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use NEXT_PUBLIC_ prefix (required for client-side access)
    // User should set NEXT_PUBLIC_AI_SERVER_URL in .env.local
    return process.env.NEXT_PUBLIC_AI_SERVER_URL || "http://localhost:8000/api";
  }
  // Server-side: use regular env var
  return process.env.AI_SERVER_URL || "http://localhost:8000/api";
}

/**
 * Call the AI streaming endpoint
 */
export async function callStreamingEndpoint(
  request: ChatRequest
): Promise<ChatResponse> {
  const baseUrl = getAIServerUrl();
  const url = `${baseUrl}/ai/streaming`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = `Server returned ${response.status}`;

      try {
        const errorData: AIApiError = await response.json();
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (
          Array.isArray(errorData.detail) &&
          errorData.detail.length > 0
        ) {
          errorMessage = errorData.detail[0].msg || errorMessage;
        }
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data: ChatResponse = await response.json();

    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === "development") {
      console.log("AI API Response:", {
        url,
        connection_status: data.connection_status,
        response_length: data.response?.length || 0,
        messages_count: data.messages?.length || 0,
      });
    }

    return data;
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to AI server. Please check if the server is running."
      );
    }

    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }

    // Fallback for unknown errors
    throw new Error(
      "An unexpected error occurred while connecting to the AI server."
    );
  }
}

/**
 * Create a new session
 */
export async function createSession(
  user_id?: string,
  initialMessage?: string,
  stage: number = 1
): Promise<ChatResponse> {
  const messages: ChatMessage[] = initialMessage
    ? [
        {
          role: "user",
          content: initialMessage,
        },
      ]
    : [];

  return callStreamingEndpoint({
    request_type: "session_started",
    user_id,
    messages,
    idea_state_stage: stage,
  });
}

/**
 * Continue an existing session
 */
export async function continueSession(
  sessionId: string,
  messages: ChatMessage[],
  user_id: string | undefined,
  stage: number
): Promise<ChatResponse> {
  return callStreamingEndpoint({
    request_type: "session_ongoing",
    session_id: sessionId,
    user_id,
    messages,
    idea_state_stage: stage,
  });
}
