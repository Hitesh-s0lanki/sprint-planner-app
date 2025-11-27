import "server-only";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import { createContext } from "@/lib/server/context";
import { createCallerFactory } from "./init";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Create a caller factory for direct server-side calls
const createCaller = createCallerFactory(appRouter);

// Export a function to create a caller with context
export async function createTRPCCaller() {
  const ctx = await createContext();
  return createCaller(ctx);
}
