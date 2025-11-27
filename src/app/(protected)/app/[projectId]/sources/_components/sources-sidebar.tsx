"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileIcon, SquarePen, Trash2 } from "lucide-react";
import type { Document as SourceDocument } from "@/modules/documents/types";
import { Separator } from "@/components/ui/separator";

interface SourcesSidebarProps {
  docs: SourceDocument[];
  activeDocId: string | null;
  onCreateDoc: () => void;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

export function SourcesSidebar({
  docs,
  activeDocId,
  onCreateDoc,
  onSelectDoc,
  onDeleteDoc,
}: SourcesSidebarProps) {
  return (
    <div className="flex h-full flex-col p-4 gap-2">
      <div className="pb-2 px-1">
        <Button
          onClick={onCreateDoc}
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2"
        >
          <SquarePen className="h-4 w-4" />
          New note
        </Button>
      </div>
      {/* Header */}

      <Separator />

      {/* Docs List */}
      <div className="flex-1 overflow-y-auto">
        {docs.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No notes yet
          </div>
        ) : (
          <div className="space-y-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors text-left group relative h-8 cursor-pointer",
                  "hover:bg-slate-200",
                  activeDocId === doc.id && "bg-slate-200"
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectDoc(doc.id);
                  }
                }}
              >
                <FileIcon className=" shrink-0 h-[18px] w-[18px] mr-2" />
                <span className="flex-1 truncate">
                  {doc.title.slice(0, 20)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDoc(doc.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded ml-auto shrink-0"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
