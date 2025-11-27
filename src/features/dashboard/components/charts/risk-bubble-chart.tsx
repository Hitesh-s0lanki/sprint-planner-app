"use client";

import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface Props {
  data: {
    taskId: string;
    key: string;
    title: string;
    daysUntilDue: number;
    priorityScore: number;
    status: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  todo: "hsl(var(--warning))",
  in_progress: "hsl(var(--sidebar-primary))",
  done: "hsl(var(--success))",
  backlog: "hsl(var(--muted))",
};

export function RiskBubbleChart({ data }: Props) {
  const chartData = data.map((item) => ({
    x: item.daysUntilDue,
    y: item.priorityScore,
    z: 100,
    name: item.key,
    title: item.title,
    status: item.status,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            name="Days Until Due"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Priority Score"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 200]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload as typeof chartData[0];
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-xs text-muted-foreground">{data.title}</p>
                    <p className="text-xs">
                      Days: {data.x}, Priority: {data.y}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={chartData} fill="hsl(var(--sidebar-primary))">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  STATUS_COLORS[entry.status] ?? "hsl(var(--sidebar-primary))"
                }
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

