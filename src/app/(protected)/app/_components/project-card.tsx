"use client";

import { ArrowRight, Clock, Archive, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/modules/projects/types";

// Helper function to format time ago
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `Updated ${diffInHours}h ago`;
  if (diffInDays < 30) return `Updated ${diffInDays}d ago`;
  return `Updated ${diffInMonths}mo ago`;
};

const getStatusIcon = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return <Activity className="h-3 w-3" />;
    case "archived":
      return <Archive className="h-3 w-3" />;
    default:
      return null;
  }
};

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "from-emerald-500 via-teal-500 to-cyan-500";
    case "inactive":
      return "from-amber-500 via-orange-500 to-red-500";
    case "archived":
      return "from-slate-400 via-slate-500 to-slate-600";
    default:
      return "from-gray-400 to-gray-500";
  }
};

const getGradientForProject = (index: number) => {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-pink-500 via-rose-500 to-orange-500",
    "from-indigo-500 via-blue-500 to-cyan-500",
    "from-emerald-500 via-green-500 to-lime-500",
    "from-amber-500 via-yellow-500 to-orange-500",
  ];
  return gradients[index % gradients.length];
};

type ProjectCardProps = {
  project: Project;
  index: number;
  onClick: (projectId: string) => void;
};

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={() => onClick(project.id)}
      className="group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/30 cursor-pointer"
    >
      {/* Gradient accent bar */}
      <div className="flex items-center justify-center w-full px-8">
        <div
          className={cn(
            "h-0.5 w-full bg-[#1d1c24] rounded-4xl",
            getStatusColor(project.status)
          )}
        />
      </div>

      {/* Gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-[#1d1c24] opacity-0 transition-opacity duration-300 group-hover:opacity-5",
          getGradientForProject(index)
        )}
      />

      <div className="relative flex flex-col p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge
              variant={project.status === "active" ? "default" : "outline"}
              className={cn(
                "text-[10px] font-medium",
                project.status === "active" &&
                  "bg-linear-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20  dark:text-emerald-400 text-white"
              )}
            >
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">{project.status}</span>
            </Badge>
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                project.status === "active" && "bg-emerald-500",
                project.status === "inactive" && "bg-amber-500",
                project.status === "archived" && "bg-slate-400"
              )}
            />
          </div>

          <h3 className="mb-1 text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground/70">
            {project.key}
          </p>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
            {project.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(project.updatedAt)}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onClick(project.id);
            }}
          >
            <span className="text-[10px] font-medium">Open</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
