import { db } from "@/lib/db";
import { projects } from "@/db/projects";
import { eq, desc, or } from "drizzle-orm";

const DUMMY_PROJECT_ID = "70317580-3bc3-4b88-83ff-7497c8d343ff";

/**
 * Get all projects from the database
 * @param userId - Optional user ID to filter projects by leadUserId
 * @returns Array of projects
 */
export async function getAllProjects(userId?: string) {
  try {
    let allProjects;
    
    if (userId) {
      // Get projects where the user is the lead OR the dummy project, ordered by most recently updated
      allProjects = await db
        .select()
        .from(projects)
        .where(
          or(
            eq(projects.leadUserId, userId),
            eq(projects.id, DUMMY_PROJECT_ID)
          )
        )
        .orderBy(desc(projects.updatedAt));
    } else {
      // Get all projects if no userId is provided, ordered by most recently updated
      allProjects = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.updatedAt));
    }

    // Ensure dummy project is always included
    const hasDummyProject = allProjects.some((p) => p.id === DUMMY_PROJECT_ID);
    
    if (!hasDummyProject) {
      // Try to fetch the dummy project
      const dummyProject = await db
        .select()
        .from(projects)
        .where(eq(projects.id, DUMMY_PROJECT_ID))
        .limit(1);
      
      if (dummyProject.length > 0) {
        // Add dummy project to the beginning of the array
        allProjects = [dummyProject[0], ...allProjects];
      }
    }

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
