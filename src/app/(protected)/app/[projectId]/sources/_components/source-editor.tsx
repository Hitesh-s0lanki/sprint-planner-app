"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

import type { Document as SourceDocument } from "@/modules/documents/types";
import type { Block } from "@blocknote/core";
import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { AlertCircle, Menu, Save, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SourceEditorProps {
  doc: SourceDocument | null;
  onUpdateDoc: (id: string, updates: Partial<SourceDocument>) => void;
  onSaveDoc: (id: string, updates: Partial<SourceDocument>) => Promise<void>;
  onOpenSidebar?: () => void;
}

// Separate component that creates editor instance - will remount when doc.id changes
function BlockNoteEditorWrapper({
  doc,
  onContentChange,
}: {
  doc: SourceDocument;
  onContentChange: (content: Block[]) => void;
}) {
  const editor = useCreateBlockNote({
    initialContent:
      doc.content && doc.content.length > 0 ? doc.content : undefined,
  });

  const handleChange = useCallback(() => {
    const content = editor.document;
    onContentChange(content);
  }, [editor, onContentChange]);

  return (
    <BlockNoteView
      editor={editor}
      onChange={handleChange}
      className="min-h-full"
    />
  );
}

export function SourceEditor({
  doc,
  onSaveDoc,
  onOpenSidebar,
}: SourceEditorProps) {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setisEditing] = useState(false);
  const [value, setValue] = useState("Untitled");
  const [originalTitle, setOriginalTitle] = useState("Untitled");
  const [originalContent, setOriginalContent] = useState<Block[] | null>(null);
  const [currentContent, setCurrentContent] = useState<Block[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();

  // Track original values when doc changes
  useEffect(() => {
    if (doc) {
      setOriginalTitle(doc.title);
      setValue(doc.title);
      setOriginalContent(doc.content);
      setCurrentContent(doc.content);
    }
  }, [doc]);

  // Check if there are any unsaved changes
  const hasTitleChanges = value !== originalTitle;
  const hasContentChanges =
    JSON.stringify(currentContent) !== JSON.stringify(originalContent);
  const hasChanges = hasTitleChanges || hasContentChanges;

  const enableInput = () => {
    setisEditing(true);
    setTimeout(() => {
      setValue(doc?.title || "Untitled");
      inputRef.current?.focus();
    }, 0);
  };

  const cancelEdit = () => {
    if (!doc) return;
    setValue(originalTitle);
    setCurrentContent(originalContent);
    setisEditing(false);
  };

  const handleSave = async () => {
    if (!doc || !hasChanges) return;

    setIsSaving(true);
    try {
      await onSaveDoc(doc.id, {
        title: value || "Untitled",
        content: currentContent,
        updatedAt: new Date(),
      });
      setOriginalTitle(value || "Untitled");
      setOriginalContent(currentContent);
      setisEditing(false);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onInput = (newValue: string) => {
    setValue(newValue);
  };

  const handleContentChange = useCallback((content: Block[]) => {
    setCurrentContent(content);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            No note selected
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first source from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col md:py-10 lg:py-10 relative">
      {hasChanges && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:right-10 lg:right-10 z-50 bg-background rounded-3xl border shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[200px]">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>You have unsaved changes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="h-8"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-8 bg-[#1d1c24] text-white hover:bg-[#2a2830]"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={cn(
          "md:pl-[54px] p-5 flex items-center gap-2",
          isMobile && "pl-0 p-5"
        )}
      >
        {/* Mobile Menu Button */}
        {isMobile && onOpenSidebar && (
          <div className="">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSidebar}
              className="h-9 w-9"
            >
              <Menu className="size-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>
        )}

        <div className="flex-1 flex items-center gap-2">
          {isEditing ? (
            <>
              <TextAreaAutosize
                ref={inputRef}
                onKeyDown={onKeyDown}
                value={value}
                onChange={(e) => onInput(e.target.value)}
                className="flex-1 text-5xl bg-transparent font-bold wrap-break-words outline-none text-[#3F3F3F] dark:text-[#CfCFCF] resize-none"
              />
            </>
          ) : (
            <div
              onClick={enableInput}
              className="text-5xl font-bold wrap-break-words outline-none cursor-text"
            >
              {doc.title}
            </div>
          )}
        </div>
      </div>

      {/* BlockNote Editor */}
      <div
        className={cn("flex-1 overflow-auto", hasChanges && "pb-20 sm:pb-16")}
      >
        {doc && (
          <BlockNoteEditorWrapper
            key={doc.id}
            doc={doc}
            onContentChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
}
