"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  data: {
    velocity: number;
    executionConfidence: number;
    riskLevel: number;
    documentationQuality: number;
    stakeholderEngagement: number;
    focusScore: number;
  };
}

export function SprintVelocityRadarChart({ data }: Props) {
  const chartData = [
    { label: "Velocity", value: data.velocity },
    { label: "Confidence", value: data.executionConfidence },
    { label: "Risk", value: data.riskLevel },
    { label: "Docs", value: data.documentationQuality },
    { label: "Engagement", value: data.stakeholderEngagement },
    { label: "Focus", value: data.focusScore },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip />
          <Radar
            dataKey="value"
            stroke="hsl(var(--sidebar-primary))"
            fill="hsl(var(--sidebar-primary))"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

