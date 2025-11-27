/**
 * Project status enum
 */
export type ProjectStatus = "active" | "inactive" | "archived";

/**
 * Project type matching the database schema
 */
export type Project = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  leadUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * API response type for projects endpoints
 */
export type ProjectsResponse = {
  message: string;
  statusCode: number;
  data?: {
    items: Project[];
  };
};

