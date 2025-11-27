import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AppSidebar } from "./_components/app-sidebar";
import { ProjectHeader } from "./_components/project-header";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-32" />
      </div>
    </header>
  );
}

const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.projects.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppSidebar>
        <Suspense fallback={<HeaderSkeleton />}>
          <ProjectHeader />
        </Suspense>
        <main className="flex-1 overflow-auto">{children}</main>
      </AppSidebar>
    </HydrationBoundary>
  );
};

export default ProjectLayout;
