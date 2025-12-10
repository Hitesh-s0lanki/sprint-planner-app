/**
 * Type definitions for chat request and response.
 */

export type ConnectionStatus = "started" | "active" | "error" | "disactive";

export interface UserPreferences {
  user_id?: string;
  user_name?: string;
  user_email?: string;
}

export interface ChatRequest {
  connection_status: ConnectionStatus;
  session_id: string;
  user_id?: string;
  user_message?: string;
  idea_state_stage: number;
  user_preferences?: UserPreferences | null;
}

export interface ChatResponse {
  connection_status: ConnectionStatus;
  messages?: Array<{
    role: string;
    content: string;
    metadata?: Record<string, unknown>;
  }>;
  response_content?: string;
  error_message?: string;
  idea_state_stage: number;
}
