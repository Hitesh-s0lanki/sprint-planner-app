import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download, Settings } from "lucide-react";

export function QuickActionsCard() {
  return (
    <Card className="rounded-2xl border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter Tasks
        </Button>
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </CardContent>
    </Card>
  );
}

