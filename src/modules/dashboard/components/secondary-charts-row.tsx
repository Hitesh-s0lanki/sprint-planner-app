import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBarChart } from "./charts/priority-bar-chart";
import { ExecutionHeatmapChart } from "./charts/execution-heatmap-chart";
import { GoalVsActualChart } from "./charts/goal-vs-actual-chart";
import { RiskBubbleChart } from "./charts/risk-bubble-chart";
import type { DashboardCharts } from "../server/actions";

export interface SecondaryChartsRowProps {
  charts: DashboardCharts;
}

export function SecondaryChartsRow({ charts }: SecondaryChartsRowProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Priority Distribution
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Tasks by priority level.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <PriorityBarChart data={charts.priorityDistribution} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Goal vs Actual</CardTitle>
          <p className="text-xs text-muted-foreground">
            Planned vs completed tasks this week.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <GoalVsActualChart data={charts.goalVsActual} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Execution Heatmap
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Daily task creation and completion over time.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <ExecutionHeatmapChart data={charts.executionHeatmap} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Risk Bubble Chart
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Tasks by urgency and priority score.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <RiskBubbleChart data={charts.riskBubbles} />
        </CardContent>
      </Card>
    </div>
  );
}
