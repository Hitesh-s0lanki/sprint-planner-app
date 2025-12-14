import { format, parseISO } from "date-fns";

interface Props {
  data: {
    id: string;
    type: string;
    taskKey: string;
    taskTitle: string;
    actorName: string;
    createdAt: string;
    meta?: Record<string, unknown>;
  }[];
}

const ACTIVITY_ICONS: Record<string, string> = {
  task_created: "➕",
  comment_added: "💬",
  status_changed: "🔄",
  task_assigned: "👤",
};

const ACTIVITY_LABELS: Record<string, string> = {
  task_created: "created",
  comment_added: "commented on",
  status_changed: "changed status of",
  task_assigned: "assigned",
};

export function RecentActivityCard({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const createdAt = parseISO(item.createdAt);
        const icon = ACTIVITY_ICONS[item.type] ?? "📝";
        const label = ACTIVITY_LABELS[item.type] ?? "updated";
        const snippet = item.meta?.snippet;
        const snippetText = typeof snippet === "string" ? snippet : null;

        return (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border p-3"
          >
            <span className="text-lg">{icon}</span>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{item.actorName}</span> {label}{" "}
                <span className="font-medium">{item.taskKey}</span>
              </p>
              <p className="text-sm">{item.taskTitle}</p>
              {snippetText && (
                <p className="text-xs text-muted-foreground italic">
                  &quot;{snippetText}&quot;
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {format(createdAt, "MMM dd, HH:mm")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

