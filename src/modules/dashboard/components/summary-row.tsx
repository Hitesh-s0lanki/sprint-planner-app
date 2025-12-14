import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, AlertCircle, Ban, Calendar } from "lucide-react";

interface SummaryRowProps {
  kpis: {
    totalTasks: number;
    openTasks: number;
    overdueTasks: number;
    blockedTasks: number;
    dueThisWeek: number;
    myOpenTasks: number;
  };
}

export function SummaryRow({ kpis }: SummaryRowProps) {
  const items = [
    {
      label: "Open Tasks",
      value: kpis.openTasks,
      icon: CheckSquare,
      iconColor: "text-sidebar-primary",
    },
    {
      label: "Overdue",
      value: kpis.overdueTasks,
      icon: AlertCircle,
      iconColor: "text-destructive",
    },
    {
      label: "Blocked",
      value: kpis.blockedTasks,
      icon: Ban,
      iconColor: "text-muted-foreground",
    },
    {
      label: "Due This Week",
      value: kpis.dueThisWeek,
      icon: Calendar,
      iconColor: "text-chart-2",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="rounded-2xl border border-border shadow-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {item.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
