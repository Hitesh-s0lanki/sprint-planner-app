import { db } from "@/lib/db";
import { users } from "@/db/users";
import { eq, or } from "drizzle-orm";

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
 * @param clerkIdOrEmail - Clerk user ID or email
 * @param data - User data to update
 * @returns Updated user object or null
 */
export async function updateUserProfile(
  clerkIdOrEmail: string,
  data: {
    name?: string;
    email?: string;
    description?: string;
    profession?: string;
    clerkId?: string;
  }
) {
  try {
    // Build WHERE conditions safely (no undefined inside or())
    const conditions = [
      eq(users.clerkId, clerkIdOrEmail),
      eq(users.email, clerkIdOrEmail),
    ];

    // If caller provided an explicit email (different from clerkIdOrEmail), allow matching on it too
    if (data.email && data.email !== clerkIdOrEmail) {
      conditions.push(eq(users.email, data.email));
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.profession !== undefined && { profession: data.profession }),
        ...(data.clerkId !== undefined && { clerkId: data.clerkId }),
      })
      .where(or(...conditions))
      .returning();

    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}
