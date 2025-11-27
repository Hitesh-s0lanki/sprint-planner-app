"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Props {
  data: { date: string; createdCount: number; completedCount: number }[];
}

export function ExecutionHeatmapChart({ data }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    dateLabel: format(parseISO(item.date), "MMM dd"),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="createdCount"
            fill="hsl(var(--sidebar-primary))"
            name="Created"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="completedCount"
            fill="hsl(var(--success))"
            name="Completed"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

