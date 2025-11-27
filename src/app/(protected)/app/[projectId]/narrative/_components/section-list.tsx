"use client";

import { cn } from "@/lib/utils";
import { NarrativeSection } from "./narrative-demo-data";
import { FileText } from "lucide-react";

interface SectionListProps {
  sections: NarrativeSection[];
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export function SectionList({
  sections,
  activeSectionId,
  onSelectSection,
}: SectionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {sections.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4 text-muted-foreground">
          <p className="text-sm sm:text-base">
            No sections in this category yet.
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={cn(
              "flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all text-left w-full",
              "hover:bg-muted/50 hover:border-primary/20",
              activeSectionId === section.id
                ? "bg-slate-200 border-primary/30 shadow-sm"
                : "bg-background border-border"
            )}
          >
            <FileText className="size-4 sm:size-5 text-muted-foreground shrink-0" />
            <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
              {section.name}
            </h3>
          </button>
        ))
      )}
    </div>
  );
}
