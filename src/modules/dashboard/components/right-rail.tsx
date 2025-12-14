import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActionsCard } from "./quick-actions-card";
// import { FocusModeCard } from "./focus-mode-card";
import { ProjectMetaCard } from "./project-meta-card";
import { RecentActivityCard } from "./recent-activity-card";
import type { DashboardLists } from "../server/actions";

interface Props {
  project: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
  };
  lists: DashboardLists;
}

export function RightRail({ project, lists }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <ProjectMetaCard project={project} />
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest project updates.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <RecentActivityCard data={lists.recentActivity} />
        </CardContent>
      </Card>
      <QuickActionsCard />
      {/* <FocusModeCard /> */}
    </div>
  );
}
