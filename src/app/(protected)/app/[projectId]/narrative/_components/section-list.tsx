"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type NarrativeSection,
  type NarrativeCategory,
} from "@/modules/narrative/types";
import { FileText, ChevronRight, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateSectionDialog } from "./create-section-dialog";

interface SectionListProps {
  sections: NarrativeSection[];
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  category: NarrativeCategory;
  onCreateSection: (name: string, type: "text" | "files") => Promise<void>;
  isCreating?: boolean;
}

export function SectionList({
  sections,
  activeSectionId,
  onSelectSection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  category: _category,
  onCreateSection,
  isCreating = false,
}: SectionListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* Create Section Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="w-full justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5"
      >
        <Plus className="size-3 sm:size-3.5 shrink-0" />
        <span>Create Section</span>
      </Button>

      <CreateSectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={onCreateSection}
        isLoading={isCreating}
      />

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-2 sm:px-3 text-center">
          <div className="relative mb-2 sm:mb-3">
            <Sparkles className="size-6 sm:size-8 text-primary/60 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground/70 mb-1">
            AI in Action
          </p>
          <p className="text-xs text-muted-foreground px-2">
            This section will be generated shortly
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={cn(
              "group flex items-center gap-2 px-2 py-2 rounded-md border transition-all text-left w-full",
              "hover:bg-muted/60 hover:border-primary/30 hover:shadow-sm",
              "active:scale-[0.98]",
              activeSectionId === section.id
                ? "bg-white border-primary/40 shadow-sm ring-1 ring-primary/20"
                : "bg-white border-border/60"
            )}
          >
            <FileText
              className={cn(
                "size-4 shrink-0 transition-colors",
                activeSectionId === section.id
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground/70"
              )}
            />
            <h3
              className={cn(
                "font-medium text-sm flex-1 truncate transition-colors",
                activeSectionId === section.id
                  ? "text-foreground"
                  : "text-foreground/80 group-hover:text-foreground"
              )}
            >
              {section.name}
            </h3>
            <ChevronRight
              className={cn(
                "size-3 shrink-0 transition-all",
                activeSectionId === section.id
                  ? "text-primary opacity-100 translate-x-0"
                  : "text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0"
              )}
            />
          </button>
        ))
      )}
    </div>
  );
}
