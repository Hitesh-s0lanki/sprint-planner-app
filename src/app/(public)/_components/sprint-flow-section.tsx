"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, Wrench, Megaphone } from "lucide-react";

const phases = [
  {
    week: "Week 1",
    label: "Clarity & validation",
    icon: Lightbulb,
    bullets: [
      "Define real problem & persona.",
      "Set validation experiments.",
      "Generate your narrative draft.",
    ],
  },
  {
    week: "Week 2",
    label: "MVP blueprint",
    icon: Target,
    bullets: [
      "Map user journey.",
      "Prioritize features.",
      "Create execution tickets.",
    ],
  },
  {
    week: "Week 3",
    label: "Build & ship",
    icon: Wrench,
    bullets: [
      "Work on core modules.",
      "Track shipped vs blocked.",
      "Log learnings for story.",
    ],
  },
  {
    week: "Week 4",
    label: "Launch & story",
    icon: Megaphone,
    bullets: ["Final narrative memo.", "Metrics snapshot.", "Launch assets."],
  },
];

export function SprintFlowSection() {
  return (
    <section
      id="sprint-flow"
      className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white"
    >
      <div className="flex min-h-screen max-w-full flex-col justify-center px-4 py-12 md:py-16 md:px-10 lg:px-40">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-3">
          <div>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              4-week sprint playbook
            </Badge>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl lg:text-4xl">
              One clear path from idea to launch.
            </h2>
          </div>
          <p className="max-w-md text-base text-slate-600 md:text-lg">
            Each week has one focus — with tasks, templates, and checkpoints.
          </p>
        </div>

        {/* Sprint Cards */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map(({ week, label, icon: Icon, bullets }) => (
            <Card
              key={week}
              className="rounded-2xl border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {week}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <p className="text-base font-semibold text-slate-900">
                  {label}
                </p>

                <ul className="space-y-1.5 text-sm text-slate-600">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 rounded-full bg-primary/50" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
