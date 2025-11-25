"use client";

import { AppHeader } from "./app-header";
import { CreateProjectCard } from "./create-project-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsLoadingView() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
      <AppHeader />
      <div className="max-w-full py-12 p-4 md:p-6 md:px-10 lg:px-40">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Create project card */}
          <CreateProjectCard onClick={() => {}} />

          {/* Loading skeletons */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-full px-8">
                <Skeleton className="h-0.5 w-full" />
              </div>
              <div className="flex flex-col p-6">
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-2 w-2 rounded-full" />
                  </div>
                  <Skeleton className="mb-1 h-6 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="mb-4 h-10 w-full" />
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
