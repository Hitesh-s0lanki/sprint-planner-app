import { db } from "@/lib/db";
import { projects } from "@/db/projects";
import { eq, desc } from "drizzle-orm";

/**
 * Get all projects from the database
 * @param userId - Optional user ID to filter projects by leadUserId
 * @returns Array of projects
 */
export async function getAllProjects(userId?: string) {
  try {
    if (userId) {
      // Get projects where the user is the lead, ordered by most recently updated
      const allProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.leadUserId, userId))
        .orderBy(desc(projects.updatedAt));

      return allProjects;
    }

    // Get all projects if no userId is provided, ordered by most recently updated
    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.updatedAt));

    return allProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}
