import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SprintVelocityRadarChart } from "./charts/sprint-velocity-radar-chart";
import { StatusDistributionDonutChart } from "./charts/status-distribution-donut";
import { dashboardMock } from "../dashboard-mock";

export interface ChartsRowProps {
  charts: (typeof dashboardMock)["charts"];
}

export function ChartsRow({ charts }: ChartsRowProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="rounded-2xl border border-border shadow-sm lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Sprint Velocity Radar
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Velocity, risk, docs and engagement in one view.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <SprintVelocityRadarChart data={charts.sprintRadar} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Status Distribution
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Tasks across backlog, todo, in progress and done.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <StatusDistributionDonutChart data={charts.statusDistribution} />
        </CardContent>
      </Card>
    </div>
  );
}
