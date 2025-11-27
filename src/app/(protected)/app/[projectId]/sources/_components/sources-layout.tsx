"use client";

import { useState } from "react";
import { SourcesSidebar } from "./sources-sidebar";
import { SourceEditor } from "./source-editor";
import type { Document as SourceDocument } from "@/modules/documents/types";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface SourcesLayoutProps {
  docs: SourceDocument[];
  activeDocId: string | null;
  onCreateDoc: () => void;
  onSelectDoc: (id: string) => void;
  onUpdateDoc: (id: string, updates: Partial<SourceDocument>) => void;
  onSaveDoc: (id: string, updates: Partial<SourceDocument>) => Promise<void>;
  onDeleteDoc: (id: string) => void;
}

export function SourcesLayout({
  docs,
  activeDocId,
  onCreateDoc,
  onSelectDoc,
  onUpdateDoc,
  onSaveDoc,
  onDeleteDoc,
}: SourcesLayoutProps) {
  const activeDoc = docs.find((doc) => doc.id === activeDocId) || null;
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when doc is selected
  const handleSelectDoc = (id: string) => {
    onSelectDoc(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <SourcesSidebar
      docs={docs}
      activeDocId={activeDocId}
      onCreateDoc={() => {
        onCreateDoc();
        if (isMobile) {
          setSidebarOpen(false);
        }
      }}
      onSelectDoc={handleSelectDoc}
      onDeleteDoc={onDeleteDoc}
    />
  );

  return (
    <div className="flex h-full w-full">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden md:block w-[280px] shrink-0 border-r h-full bg-white">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Sheet/Drawer */}
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sources</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>{sidebarContent}</DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Right Editor */}
      <div className="flex-1 overflow-hidden bg-white h-full">
        <SourceEditor
          doc={activeDoc}
          onUpdateDoc={onUpdateDoc}
          onSaveDoc={onSaveDoc}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>
    </div>
  );
}
