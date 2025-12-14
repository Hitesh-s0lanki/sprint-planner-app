"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  backlog: "#64748b",
  todo: "#1e40af",
  in_progress: "#d97706",
  done: "#059669",
  cancelled: "#dc2626",
};

interface Props {
  data: { status: string; count: number }[];
}

export function StatusDistributionDonutChart({ data }: Props) {
  const renderLegend = (props: {
    payload?: Array<{ value: string; color?: string }>;
  }) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
        {payload.map((entry, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5">
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: entry.color ?? "hsl(var(--muted))",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "hsl(var(--muted))"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
