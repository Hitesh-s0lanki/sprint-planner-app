"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoryTabs } from "./_components/category-tabs";
import { SectionList } from "./_components/section-list";
import { SectionEditor } from "./_components/section-editor";
import {
  type NarrativeCategory,
  type NarrativeSection,
} from "@/modules/narrative/types";
import { generateNarrativePDF } from "./_components/generate-pdf";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NarrativePage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] =
    useState<NarrativeCategory>("narrative");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();

  // Fetch narrative sections
  const { data: narrativeData, isLoading } = useQuery(
    trpc.narrative.getAll.queryOptions({ projectId })
  );

  // Fetch project name for PDF
  const { data: projectData } = useQuery(
    trpc.projects.getById.queryOptions({ projectId })
  );

  const sections: Record<NarrativeCategory, NarrativeSection[]> =
    useMemo(() => {
      const fetchedSections = (
        narrativeData as {
          data?: { sections?: Record<NarrativeCategory, NarrativeSection[]> };
        }
      )?.data?.sections;

      // Initialize all categories with empty arrays
      const result: Record<NarrativeCategory, NarrativeSection[]> = {
        narrative: [],
        product: [],
        engineering: [],
        administrative: [],
        people_hr: [],
        gtm: [],
        funding: [],
        tools: [],
      };

      if (fetchedSections) {
        // Merge fetched sections with defaults
        for (const category in fetchedSections) {
          const cat = category as NarrativeCategory;
          if (result[cat] !== undefined) {
            result[cat] = fetchedSections[cat] || [];
          }
        }
      }

      return result;
    }, [narrativeData]);

  // Update section mutation
  const updateMutation = useMutation(
    trpc.narrative.update.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch narrative sections
        queryClient.invalidateQueries({
          queryKey: trpc.narrative.getAll.queryKey({ projectId }),
        });
        toast.success("Section updated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update section");
      },
    })
  );

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

  const handleUpdateSection = async (
    sectionId: string,
    updates: Partial<NarrativeSection>
  ) => {
    try {
      await updateMutation.mutateAsync({
        sectionId,
        ...updates,
      });
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Create section mutation
  const createMutation = useMutation(
    trpc.narrative.create.mutationOptions({
      onSuccess: (response) => {
        // Invalidate and refetch narrative sections
        queryClient.invalidateQueries({
          queryKey: trpc.narrative.getAll.queryKey({ projectId }),
        });

        // Auto-select the newly created section
        const newSection = (
          response as { data?: { section?: NarrativeSection } }
        )?.data?.section;
        if (newSection) {
          setActiveSectionId(newSection.id);
        }

        toast.success("Section created successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create section");
      },
    })
  );

  const handleCreateSection = async (name: string, type: "text" | "files") => {
    try {
      await createMutation.mutateAsync({
        projectId,
        category: activeCategory,
        name,
        type,
        content: "",
      });
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleDownloadPDF = () => {
    try {
      setIsDownloading(true);
      const projectName =
        (projectData as { data?: { item?: { name?: string } } })?.data?.item
          ?.name || "Project Narrative";

      generateNarrativePDF({
        sections,
        projectName,
      });

      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const sectionListContent = (
    <SectionList
      sections={categorySections}
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
      category={activeCategory}
      onCreateSection={handleCreateSection}
      isCreating={createMutation.isPending}
    />
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">
          Loading narrative sections...
        </p>
      </div>
    );
  }

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
        onDownload={handleDownloadPDF}
        isDownloading={isDownloading}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex h-full overflow-hidden">
          {/* Desktop/Mobile Sidebar - Section List */}
          {/* Desktop: Always visible */}
          <div className="hidden lg:block border-r overflow-y-auto p-2 md:p-3 bg-muted/20 w-64 xl:w-72 h-full flex-shrink-0">
            <div className="px-2 w-full">{sectionListContent}</div>
          </div>

          {/* Tablet: Sheet/Drawer for medium screens */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] md:w-[360px] p-0"
            >
              <SheetHeader className="px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
                <SheetTitle className="text-base sm:text-lg">
                  Sections
                </SheetTitle>
              </SheetHeader>
              <div className="p-3 sm:p-4 overflow-y-auto h-[calc(100vh-80px)]">
                {sectionListContent}
              </div>
            </SheetContent>
          </Sheet>

          {/* Right Panel - Section Editor */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-background h-full min-w-0">
            <div className="max-w-3xl mx-auto w-full">
              {/* Mobile/Tablet: Back button to section list */}
              {(isMobile || !sidebarOpen) && activeSection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="mb-3 sm:mb-4 -ml-1 sm:-ml-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Sections</span>
                  <span className="sm:hidden">Sections</span>
                </Button>
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
