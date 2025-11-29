import { authRouter } from "@/modules/auth/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { documentsRouter } from "@/modules/documents/server/procedures";
import { investorsRouter } from "@/modules/investors/server/procedures";
import { tasksRouter } from "@/modules/tasks/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  clerkAuth: authRouter,
  projects: projectsRouter,
  documents: documentsRouter,
  investors: investorsRouter,
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
