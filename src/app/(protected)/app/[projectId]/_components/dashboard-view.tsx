"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DashboardPage } from "@/modules/dashboard/dashboard-page";

interface DashboardViewProps {
  projectId: string;
}

export function DashboardView({ projectId }: DashboardViewProps) {
  const trpc = useTRPC();

  // Fetch dashboard data using suspense query
  const { data } = useSuspenseQuery(
    trpc.dashboard.getByProjectId.queryOptions({ projectId })
  );

  if (!data?.data?.dashboard) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return <DashboardPage data={data.data.dashboard} />;
}
