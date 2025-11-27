import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingDeadlinesCard } from "./upcoming-deadlines-card";
import { MyTasksCard } from "./my-tasks-card";
import { dashboardMock } from "../dashboard-mock";

export interface ListsRowProps {
  lists: (typeof dashboardMock)["lists"];
}

export function ListsRow({ lists }: ListsRowProps) {
  return (
    <div className="grid gap-2 lg:grid-cols-2">
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Deadlines
          </CardTitle>
          <p className="text-xs text-muted-foreground">Tasks due soon.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <UpcomingDeadlinesCard data={lists.upcomingDeadlines} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
          <p className="text-xs text-muted-foreground">
            Tasks assigned to you.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <MyTasksCard data={lists.myTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
