// backend/clerk-client.ts
import { createClerkClient } from "@clerk/backend";

export const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Example wrapper functions
export async function findUserByEmail(email: string) {
  const { data: users } = await clerk.users.getUserList({
    emailAddress: [email],
  });
  return users.length > 0 ? users[0] : null;
}

export async function createUserWithEmail(email: string) {
  const user = await clerk.users.createUser({
    emailAddress: [email],
  });
  return user;
}

export async function startSignIn(email: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const token = await clerk.signInTokens.createSignInToken({
    userId: user.id,
    expiresInSeconds: 60 * 60 * 24 * 30, // e.g. 30 days
  });

  return token;
}
