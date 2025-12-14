"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from "lucide-react";

interface BoardTabsProps {
  value: "list" | "board";
  onValueChange: (value: "list" | "board") => void;
}

export function BoardTabs({ value, onValueChange }: BoardTabsProps) {
  const [isMounted] = useState(true);

  // Render placeholder to prevent layout shift
  if (!isMounted) {
    return (
      <div className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-slate-200 p-[3px]">
        <div className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium">
          <List className="h-4 w-4" />
          List
        </div>
        <div className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium">
          <Grid className="h-4 w-4" />
          Board
        </div>
      </div>
    );
  }

  return (
    <Tabs
      value={value}
      onValueChange={(val) => onValueChange(val as BoardTabsProps["value"])}
    >
      <TabsList className="bg-slate-200">
        <TabsTrigger value="list">
          <List className="h-4 w-4" />
          List
        </TabsTrigger>
        <TabsTrigger value="board">
          <Grid className="h-4 w-4" />
          Board
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
