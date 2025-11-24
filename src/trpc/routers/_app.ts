import { authRouter } from "@/modules/auth/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  clerkAuth: authRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
