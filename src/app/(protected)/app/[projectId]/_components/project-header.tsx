"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserButton } from "@/components/user-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import { ProjectSwitcher } from "./project-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Project, ProjectsResponse } from "@/modules/projects/types";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  narrative: "Narrative",
  sources: "Sources",
  social: "Social",
  help: "Help Center",
  settings: "Project Settings",
};

export function ProjectHeader() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId as string;
  const trpc = useTRPC();

  const { data: projectsData } = useSuspenseQuery(
    trpc.projects.getAll.queryOptions()
  ) as { data: ProjectsResponse };

  const projects = (projectsData?.data?.items || []) as Project[];
  const currentProject = projects.find((p: Project) => p.id === projectId);

  // Build breadcrumb from pathname
  // Format: /app/{id} -> "Home"
  // Format: /app/{id}/{something} -> "Home > {something}"
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string; isLast: boolean }> =
    [];

  // Always start with "Home" pointing to the project root
  breadcrumbs.push({
    label: "Home",
    href: `/app/${projectId}`,
    isLast: pathSegments.length === 2, // Only "app" and projectId
  });

  // If there are segments after the project ID, add them
  if (pathSegments.length > 2) {
    const segmentsAfterProject = pathSegments.slice(2);
    segmentsAfterProject.forEach((segment, index) => {
      const isLast = index === segmentsAfterProject.length - 1;
      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label,
        href: `/${pathSegments.slice(0, 3 + index).join("/")}`,
        isLast,
      });
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/80 shadow-sm">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="size-8 hover:bg-accent/50 transition-colors" />

        {/* Divider */}
        <div className="h-6 w-px bg-border/60" />

        <nav className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
          {currentProject ? (
            <>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-0.5">
                  {index > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  ) : (
                    <Home className="h-3.5 w-3.5" />
                  )}
                  {crumb.isLast ? (
                    <span className="px-2 py-1 rounded-md text-md font-semibold text-foreground truncate max-w-[200px]">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="px-2 py-1 font-semibold">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </>
          ) : (
            <Skeleton className="h-5 w-48" />
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <ProjectSwitcher />
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
