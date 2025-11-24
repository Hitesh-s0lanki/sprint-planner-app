import { db } from "@/lib/db";
import { users } from "@/db/users";
import { eq } from "drizzle-orm";

/**
 * Get user by Clerk ID
 * @param clerkId - Clerk user ID
 * @returns User object or null
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

