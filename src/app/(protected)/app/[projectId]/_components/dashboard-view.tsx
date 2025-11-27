"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { dashboardMock } from "@/features/dashboard/dashboard-mock";

interface DashboardViewProps {
  projectId: string;
}

export function DashboardView({ projectId }: DashboardViewProps) {
  const trpc = useTRPC();

  // Fetch project data using suspense query
  const { data } = useSuspenseQuery(
    trpc.projects.getById.queryOptions({ projectId })
  );

  if (!data?.data?.item) {
    // Fallback to mock data if project not found
    return <DashboardPage data={dashboardMock} />;
  }

  // Transform the project data to match the dashboard mock structure
  const projectInfo = data.data.item;

  // Handle createdAt - it might be a Date object or a string after serialization
  const createdAtValue = projectInfo.createdAt as Date | string;
  const createdAtISO =
    createdAtValue instanceof Date
      ? createdAtValue.toISOString()
      : typeof createdAtValue === "string"
        ? createdAtValue
        : new Date(createdAtValue).toISOString();

  // Use mock data but replace the project info with real data
  const dashboardData = {
    ...dashboardMock,
    project: {
      id: projectInfo.id,
      key: projectInfo.key,
      name: projectInfo.name,
      description: projectInfo.description || "",
      status: projectInfo.status,
      createdAt: createdAtISO,
    },
  };

  return <DashboardPage data={dashboardData} />;
}

