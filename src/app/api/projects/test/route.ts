import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { projects } from "@/db/projects";
import { users } from "@/db/users";
import { eq } from "drizzle-orm";
import { routeHandlerSuccess, routeHandlerError } from "@/lib/handler";

export async function GET() {
  try {
    // Get the current authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return routeHandlerError("Unauthorized", 401);
    }

    // Get the user from the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user) {
      return routeHandlerError("User not found in database", 404);
    }

    // Generate a unique key for the test project
    const timestamp = Date.now();
    const projectKey = `TEST-${timestamp}`;

    // Create the test project
    const [newProject] = await db
      .insert(projects)
      .values({
        key: projectKey,
        name: "Test Project",
        description: "This is a test project created via API",
        status: "active",
        leadUserId: user.id,
      })
      .returning();

    return routeHandlerSuccess(
      "Test project created successfully",
      201,
      newProject
    );
  } catch (error) {
    console.error("Error creating test project:", error);
    return routeHandlerError(
      error instanceof Error ? error.message : "Failed to create test project",
      500
    );
  }
}

