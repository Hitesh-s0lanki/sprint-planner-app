"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "./app-header";
import { ProjectCard } from "./project-card";
import { CreateProjectCard } from "./create-project-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function AppComponent() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.projects.getAll.queryOptions());

  const handleProjectClick = (projectId: string) => {
    router.push(`/app/${projectId}`);
  };

  const handleCreateProject = () => {
    // TODO: Implement create project functionality
    console.log("Create project clicked");
  };

  const projects = (data.data?.items || []).map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
      <AppHeader />

      {/* Content */}
      <main className="max-w-full py-12 p-4 md:p-6 md:px-10 lg:px-40">
        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Create project card */}
          <CreateProjectCard onClick={handleCreateProject} />

          {/* Project cards */}
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
