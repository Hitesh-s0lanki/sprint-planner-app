import { parseISO, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Props {
  data: {
    id: string;
    key: string;
    title: string;
    dueDate: string;
    assigneeName: string | null;
    status: string;
    priority: string;
  }[];
}

export function UpcomingDeadlinesCard({ data }: Props) {
  const [now] = useState(() => Date.now());

  if (data.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No upcoming deadlines
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const dueDate = parseISO(item.dueDate);
        const isOverdue = isPast(dueDate);
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-lg border p-3"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.key}
                </span>
                <Badge
                  variant={
                    item.priority === "High" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {item.priority}
                </Badge>
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.assigneeName || "Unassigned"}</span>
                <span>•</span>
                <span
                  className={isOverdue ? "font-medium text-destructive" : ""}
                >
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysUntilDue)} days`
                    : `Due in ${daysUntilDue} days`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
