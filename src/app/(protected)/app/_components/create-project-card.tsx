"use client";

import { Plus } from "lucide-react";

type CreateProjectCardProps = {
  onClick: () => void;
};

export function CreateProjectCard({ onClick }: CreateProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-linear-to-br from-muted/30 via-muted/20 to-muted/10 p-8 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-primary/5 hover:via-primary/5 hover:to-primary/10"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 text-2xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20">
        <Plus className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-base font-bold text-foreground">
        Start a new idea
      </h3>
      <p className="text-xs text-muted-foreground">
        Create a new project to get organized
      </p>
    </button>
  );
}

