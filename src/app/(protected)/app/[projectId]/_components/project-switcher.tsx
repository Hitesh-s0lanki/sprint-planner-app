"use client";

import { useRouter, useParams } from "next/navigation";
import { FolderKanban, ChevronsUpDown, Brain } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project, ProjectsResponse } from "@/modules/projects/types";

export function ProjectSwitcher() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.projects.getAll.queryOptions()) as {
    data: ProjectsResponse;
  };

  const projects = (data?.data?.items || []) as Project[];
  const currentProject = projects.find((p: Project) => p.id === projectId);

  const handleProjectChange = (newProjectId: string) => {
    router.push(`/app/${newProjectId}`);
  };

  if (!currentProject) {
    return (
      <div className="px-3 py-2">
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Brain className="relative h-5 w-5 " />
            <span className="text-xs font-medium truncate w-full text-foreground">
              {currentProject.name}
            </span>

            <ChevronsUpDown className="h-4 w-4 ml-2 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-full">
          <div className="max-h-[300px] overflow-y-auto">
            {projects.map((project: Project) => {
              return (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectChange(project.id)}
                  className="text-xs font-medium"
                >
                  <FolderKanban className={cn("h-4 w-4 shrink-0")} />
                  {project.name}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
