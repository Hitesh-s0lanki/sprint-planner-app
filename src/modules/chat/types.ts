/**
 * Type definitions for chat request and response.
 */

export type ConnectionStatus =
  | "started"
  | "active"
  | "events_streaming"
  | "events_completed"
  | "error"
  | "disactive";

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

export type EventType =
  | "team_members_synced"
  | "project_created"
  | "sources_updated"
  | "sprint_plan_generated"
  | "narrative_sections_started"
  | "completed";

export interface Event {
  event_type: EventType;
  event_status: "started" | "completed";
  project_id?: string; // Included in the final "completed" event
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
  event?: Event;
}
