import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Clock } from "lucide-react";

interface BoardTabsProps {
  value: "list" | "board" | "timeline";
  onValueChange: (value: "list" | "board" | "timeline") => void;
}

export function BoardTabs({ value, onValueChange }: BoardTabsProps) {
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
        <TabsTrigger value="timeline">
          <Clock className="h-4 w-4" />
          Timeline
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
