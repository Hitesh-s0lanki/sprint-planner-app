import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: {
    id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
  }[];
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  todo: "default",
  in_progress: "default",
  done: "secondary",
  backlog: "outline",
};

export function MyTasksCard({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No tasks assigned
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-3 rounded-lg border p-3"
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {item.key}
              </span>
              <Badge variant={STATUS_COLORS[item.status] ?? "default"} className="text-xs">
                {item.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm font-medium">{item.title}</p>
            {item.dueDate && (
              <p className="text-xs text-muted-foreground">
                Due: {format(parseISO(item.dueDate), "MMM dd, yyyy")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

