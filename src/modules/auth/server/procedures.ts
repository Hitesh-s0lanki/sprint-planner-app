import { users } from "@/db/users";
import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { apiResponse } from "@/lib/handler";

export const authRouter = createTRPCRouter({
  createUser: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const clerkUser = await currentUser();

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, ctx.auth.userId));

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      await db.insert(users).values({
        clerkId: ctx.auth.userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser?.firstName + " " + clerkUser?.lastName,
      });

      return apiResponse("User created", 201);
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
      });
    }
  }),
});
