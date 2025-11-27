import { users } from "@/db/users";
import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { apiResponse } from "@/lib/handler";
import { getUserByClerkId, updateUserProfile } from "./actions";
import { z } from "zod";

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

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await getUserByClerkId(ctx.auth.userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return apiResponse("Profile fetched successfully", 200, { item: user });
    } catch (error) {
      console.error("Error in getProfile procedure:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profile",
      });
    }
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        profession: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await getUserByClerkId(ctx.auth.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const updatedUser = await updateUserProfile(ctx.auth.userId, {
          name: input.name,
          description: input.description,
          profession: input.profession,
        });

        return apiResponse("Profile updated successfully", 200, {
          item: updatedUser,
        });
      } catch (error) {
        console.error("Error in updateProfile procedure:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
});
