"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoryTabs } from "./_components/category-tabs";
import { SectionList } from "./_components/section-list";
import { SectionEditor } from "./_components/section-editor";
import {
  demoNarrative,
  NarrativeCategory,
  NarrativeSection,
} from "./_components/narrative-demo-data";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft } from "lucide-react";

export default function NarrativePage() {
  const [activeCategory, setActiveCategory] =
    useState<NarrativeCategory>("narrative");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sections, setSections] = useState(demoNarrative);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get sections for active category
  const categorySections = useMemo(() => {
    return sections[activeCategory] || [];
  }, [sections, activeCategory]);

  // Get active section
  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    return categorySections.find((s) => s.id === activeSectionId) || null;
  }, [categorySections, activeSectionId]);

  // Auto-select first section when category changes (but not when manually selecting)
  useEffect(() => {
    // Only auto-select if:
    // 1. There are sections but no active section, OR
    // 2. The current active section is not in the new category
    if (categorySections.length > 0) {
      if (!activeSectionId) {
        // No section selected, select first
        setActiveSectionId(categorySections[0].id);
      } else if (!categorySections.find((s) => s.id === activeSectionId)) {
        // Current section not in this category, select first
        setActiveSectionId(categorySections[0].id);
      }
    } else {
      // No sections in category
      setActiveSectionId(null);
    }
    // Only depend on category and sections, not activeSectionId to avoid interference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, categorySections]);

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<NarrativeSection>
  ) => {
    setSections((prev) => {
      const category = activeCategory;
      const categorySections = prev[category] || [];
      const updatedSections = categorySections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      return {
        ...prev,
        [category]: updatedSections,
      };
    });
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const sectionListContent = (
    <SectionList
      sections={categorySections}
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
    />
  );

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          // Reset active section when category changes
          const newSections = sections[category] || [];
          setActiveSectionId(newSections.length > 0 ? newSections[0].id : null);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
          {/* Desktop/Mobile Sidebar - Section List */}
          {/* Desktop: Always visible */}
          <div className="hidden md:block border-r overflow-y-auto p-4 md:p-6 bg-muted/20">
            <div className="max-w-2xl mx-auto w-full">{sectionListContent}</div>
          </div>

          {/* Mobile: Sheet/Drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="px-4 pt-6 pb-4 border-b">
                <SheetTitle>Sections</SheetTitle>
              </SheetHeader>
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                {sectionListContent}
              </div>
            </SheetContent>
          </Sheet>

          {/* Right Panel - Section Editor */}
          <div className="overflow-y-auto p-4 md:p-6 bg-background md:col-span-1 lg:col-span-2">
            <div className="max-w-3xl mx-auto w-full">
              {/* Mobile: Back button to section list */}
              {isMobile && activeSection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="mb-4 -ml-2"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Sections
                </Button>
              )}

              {/* Desktop: Menu button for section list (if needed) */}
              {!isMobile && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden"
                  >
                    <Menu className="size-4 mr-2" />
                    Sections
                  </Button>
                </div>
              )}

              <SectionEditor
                section={activeSection}
                onUpdateSection={handleUpdateSection}
                onOpenSidebar={() => setSidebarOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
