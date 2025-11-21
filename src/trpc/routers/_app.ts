import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  clerkAuth: authRouter,
});

export type AppRouter = typeof appRouter;
