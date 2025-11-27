import { BoardTask } from "../board-mock";
import { TaskCard } from "./task-card";
import { format } from "date-fns";

interface TimelineViewProps {
  tasks: BoardTask[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
  const withDueDate = tasks.filter((t) => t.dueDate);
  const withoutDueDate = tasks.filter((t) => !t.dueDate);

  const byDate = new Map<string, BoardTask[]>();
  for (const t of withDueDate) {
    const dateKey = t.dueDate!.slice(0, 10);
    if (!byDate.has(dateKey)) byDate.set(dateKey, []);
    byDate.get(dateKey)!.push(t);
  }

  const sortedDates = Array.from(byDate.keys()).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dateTasks = byDate.get(dateKey)!;
        const label = format(new Date(dateKey), "EEE, dd MMM");

        return (
          <div key={dateKey} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {dateTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))}
            </div>
          </div>
        );
      })}

      {withoutDueDate.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              No due date
            </h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {withoutDueDate.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tasks to show on the timeline.
        </p>
      )}
    </div>
  );
}

