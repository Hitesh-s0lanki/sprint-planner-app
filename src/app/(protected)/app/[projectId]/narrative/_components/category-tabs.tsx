"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type NarrativeCategory,
  categoryLabels,
} from "@/modules/narrative/types";
import {
  FileText,
  Package,
  Code,
  Clipboard,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  LucideIcon,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  activeCategory: NarrativeCategory;
  onCategoryChange: (category: NarrativeCategory) => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

const categories: NarrativeCategory[] = [
  "narrative",
  "product",
  "engineering",
  "administrative",
  "people_hr",
  "gtm",
  "funding",
  "tools",
];

const categoryIcons: Record<NarrativeCategory, LucideIcon> = {
  narrative: FileText,
  product: Package,
  engineering: Code,
  administrative: Clipboard,
  people_hr: Users,
  gtm: TrendingUp,
  funding: DollarSign,
  tools: Settings,
};

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  onDownload,
  isDownloading = false,
}: CategoryTabsProps) {
  return (
    <div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          <Tabs
            value={activeCategory}
            onValueChange={(value) =>
              onCategoryChange(value as NarrativeCategory)
            }
            className="flex-1 w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto justify-start bg-slate-200 h-auto p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {categories.map((category) => {
                const Icon = categoryIcons[category];
                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs sm:text-sm px-2 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2"
                  >
                    <Icon className="size-3 sm:size-3.5 md:size-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {categoryLabels[category]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={isDownloading}
              className="shrink-0 gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Download className="size-3.5 sm:size-4 shrink-0" />
              <span className="text-xs sm:text-sm">
                {isDownloading ? "Generating..." : "Download PDF"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
