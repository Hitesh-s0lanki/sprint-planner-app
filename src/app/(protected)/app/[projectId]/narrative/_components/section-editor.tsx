"use client";

import { type NarrativeSection } from "@/modules/narrative/types";
import { SectionTextEditor } from "./section-text-editor";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionEditorProps {
  section: NarrativeSection | null;
  onUpdateSection: (
    sectionId: string,
    updates: Partial<NarrativeSection>
  ) => void;
  onOpenSidebar?: () => void;
}

export function SectionEditor({
  section,
  onUpdateSection,
  onOpenSidebar,
}: SectionEditorProps) {
  if (!section) {
    return (
      <div className="flex items-center justify-center h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] border rounded-lg sm:rounded-xl bg-muted/20">
        <div className="text-center px-3 sm:px-4 max-w-sm">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select a section to start editing
          </p>
          {onOpenSidebar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSidebar}
              className="mt-3 sm:mt-4 text-xs sm:text-sm"
            >
              Browse Sections
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleContentChange = (value: string) => {
    onUpdateSection(section.id, { content: value });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 h-full">
      {/* Content Editor */}
      {section.type === "text" ? (
        <SectionTextEditor
          key={section.id}
          content={section.content}
          onChange={handleContentChange}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">
              Files
            </label>
            <span className="text-xs text-muted-foreground">
              Upload and manage files
            </span>
          </div>
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[240px] md:min-h-[320px] border-2 border-dashed rounded-lg sm:rounded-xl bg-muted/20">
            <div className="text-center px-3 sm:px-4">
              <File className="size-8 sm:size-10 md:size-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                File upload coming soon
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
