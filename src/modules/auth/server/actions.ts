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

/**
 * Update user profile
 * @param clerkId - Clerk user ID
 * @param data - User profile data to update (name, description, profession)
 * @returns Updated user object
 */
export async function updateUserProfile(
  clerkId: string,
  data: {
    name?: string;
    description?: string;
    profession?: string;
  }
) {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.profession !== undefined && { profession: data.profession }),
      })
      .where(eq(users.clerkId, clerkId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

