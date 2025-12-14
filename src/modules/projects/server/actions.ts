import { db } from "@/lib/db";
import { projects } from "@/db/projects";
import { eq, desc, or, sql } from "drizzle-orm";

/**
 * Get all projects from the database
 * - If userId provided: returns projects where user is lead OR in teamIds OR dummy project
 * - Always includes dummy project
 */
export async function getAllProjects(userId?: string) {
  try {
    // helper: team_ids contains userId (uuid[])
    const teamContainsUser = (uid: string) =>
      sql`${projects.teamIds} @> ARRAY[${uid}]::uuid[]`;

    const allProjects = userId
      ? await db
          .select()
          .from(projects)
          .where(or(eq(projects.leadUserId, userId), teamContainsUser(userId)))
          .orderBy(desc(projects.updatedAt))
      : await db.select().from(projects).orderBy(desc(projects.updatedAt));

    return allProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

/**
 * Get a project by ID from the database
 * @param projectId - The project ID to fetch
 * @returns Project or null if not found
 */
export async function getProjectById(projectId: string) {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    return project[0] || null;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Failed to fetch project");
  }
}
