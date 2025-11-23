"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ListChecks, Clock3 } from "lucide-react";

const problems = [
  {
    icon: Clock3,
    title: "Ideas die in long planning cycles",
    body: "By the time you finish your 30-page deck, the market and energy have already moved on.",
  },
  {
    icon: ListChecks,
    title: "No clear weekly focus",
    body: "You're juggling validation, building, docs, and investor updates without a stable system.",
  },
  {
    icon: Brain,
    title: "Too much theory, not enough doing",
    body: "You read playbooks and threads, but translating them into structured execution is hard.",
  },
];

const solutions = [
  {
    title: "4-week sprint scaffolding",
    body: "A pre-built execution framework that guides you week by week.",
  },
  {
    title: "Done-for-you venture artefacts",
    body: "Narratives, user flows, and summaries generated as you execute.",
  },
  {
    title: "Execution-first, not deck-first",
    body: "Real work first. Story and investor clarity come from progress.",
  },
];

export function ProblemSolutionSection() {
  return (
    <section
      id="problem-solution"
      className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white"
    >
      <div className="flex min-h-screen max-w-full flex-col justify-center px-4 py-12 md:py-16 md:px-10 lg:px-40">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-3">
          <div>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              Why SprintPlanner
            </Badge>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl lg:text-4xl">
              Founders don&apos;t need more ideas they need execution rails.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 md:text-base">
            SprintPlanner turns ambiguity into a time-boxed 4-week execution
            system.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Problems */}
          <Card className="rounded-2xl border-slate-200 bg-slate-50/70 shadow">
            <CardContent className="p-6 space-y-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                The reality today
              </p>

              {problems.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {title}
                    </p>
                    <p className="text-xs text-slate-600">{body}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow">
            <CardContent className="p-6 space-y-5">
              <p className="text-xs font-semibold uppercase text-primary">
                What changes
              </p>

              {solutions.map(({ title, body }) => (
                <div key={title}>
                  <p className="text-sm font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="text-xs text-slate-600">{body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
