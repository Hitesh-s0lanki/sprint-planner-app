"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SquarePen } from "lucide-react";

interface SectionTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function SectionTextEditor({
  content,
  onChange,
}: SectionTextEditorProps) {
  const [markdownValue, setMarkdownValue] = useState(content);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  // Sync local state with prop changes
  useEffect(() => {
    setMarkdownValue(content);
  }, [content]);

  const wordCount = useMemo(() => {
    const text = markdownValue.trim();
    if (!text) return { words: 0, chars: 0 };
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    return { words, chars: text.length };
  }, [markdownValue]);

  const handleChange = (value: string) => {
    setMarkdownValue(value);
  };

  const handleStartWriting = () => {
    setActiveTab("edit");
  };

  const onSave = () => {
    onChange(markdownValue);
    setActiveTab("preview");
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Edit/Preview Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
          <p className="text-xs text-muted-foreground pl-2">
            Use Markdown for headings, lists, emphasis, etc.
          </p>

          {activeTab === "preview" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartWriting}
              className="hover:bg-slate-200 shrink-0"
            >
              <SquarePen className="size-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Cancel Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab("preview");
                  setMarkdownValue(content);
                }}
                className="h-8 hover:bg-slate-200 flex-1 sm:flex-initial"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={onSave}
                className="hover:bg-slate-200 h-8 flex-1 sm:flex-initial"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Edit Mode */}
        <TabsContent value="edit" className="mt-4 h-full">
          <div className="relative">
            <Textarea
              value={markdownValue}
              onChange={(e) => handleChange(e.target.value)}
              className={cn(
                "min-h-[240px] sm:min-h-[320px] resize-none font-mono text-sm",
                "bg-muted/40 rounded-xl p-3 sm:p-4",
                "focus-visible:ring-2 focus-visible:ring-primary/20"
              )}
              placeholder="Start writing your narrative in Markdown..."
            />
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-2 sm:gap-4">
              <p className="text-xs text-muted-foreground">
                {wordCount.words} {wordCount.words === 1 ? "word" : "words"}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Preview Mode */}
        <TabsContent value="preview" className="mt-4 h-full">
          {markdownValue.trim() ? (
            <div className="bg-background border rounded-xl p-4 sm:p-6 [&_h1]:text-xl sm:[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-4 [&_h1]:mt-0 [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-3 [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 sm:[&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-4 sm:[&_ol]:ml-6 [&_ol]:mb-4 [&_li]:my-1 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs sm:[&_code]:text-sm [&_code]:font-mono [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-3 sm:[&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-primary/20 [&_blockquote]:pl-3 sm:[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownValue}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 border rounded-xl bg-muted/20">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Nothing here yet. Switch to Edit to start writing your
                narrative.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartWriting}
                className="rounded-full"
              >
                Start Writing
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
