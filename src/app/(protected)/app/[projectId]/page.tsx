import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardLoadingView } from "./_components/dashboard-loading-view";
import { DashboardView } from "./_components/dashboard-view";
import { ErrorState } from "@/components/error-state";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectAppPage({ params }: PageProps) {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  // Prefetch the project data
  void queryClient.prefetchQuery(
    trpc.projects.getById.queryOptions({ projectId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<DashboardLoadingView />}>
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Something went wrong"
              description="Please try again later"
            />
          }
        >
          <DashboardView projectId={projectId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
