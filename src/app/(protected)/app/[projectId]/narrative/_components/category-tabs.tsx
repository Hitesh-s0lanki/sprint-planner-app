"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NarrativeCategory, categoryLabels } from "./narrative-demo-data";

interface CategoryTabsProps {
  activeCategory: NarrativeCategory;
  onCategoryChange: (category: NarrativeCategory) => void;
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

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <Tabs
          value={activeCategory}
          onValueChange={(value) =>
            onCategoryChange(value as NarrativeCategory)
          }
        >
          <TabsList className="w-full justify-start bg-slate-200 h-auto p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs sm:text-sm px-3 sm:px-4"
              >
                {categoryLabels[category]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
