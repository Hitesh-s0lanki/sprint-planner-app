import { db } from "@/index";
import { users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST() {
  const { userId } =await auth();
  if (!userId) return new Response("Not authenticated", { status: 401 });

  const clerkUser = await currentUser();

  // check if already created
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId));

  if (existing.length > 0)
    return new Response("User exists", { status: 200 });

  await db.insert(users).values({
    clerkId: userId,
    email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
    name: clerkUser?.firstName + " " + clerkUser?.lastName,
  });

  return new Response("User created");
}
