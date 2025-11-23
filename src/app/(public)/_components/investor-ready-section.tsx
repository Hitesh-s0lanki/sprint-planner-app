"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, MessageCircle } from "lucide-react";

const artefacts = [
  {
    icon: FileText,
    title: "Narrative memo",
    body: "Clear 1-2 page story created from your real execution.",
  },
  {
    icon: BarChart3,
    title: "Metrics snapshot",
    body: "A quick overview of validation progress — not vanity numbers.",
  },
  {
    icon: MessageCircle,
    title: "Investor Q&A workspace",
    body: "Async Q&A layer, summarised automatically by AI.",
  },
];

export function InvestorReadySection() {
  return (
    <section
      id="investor-ready"
      className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white"
    >
      <div className="flex min-h-screen max-w-full flex-col justify-center px-4 py-12 md:py-16 md:px-10 lg:px-40">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-3">
          <div>
            <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              Investor-ready outputs
            </Badge>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl lg:text-4xl">
              Your sprint becomes investor-proof output.
            </h2>
          </div>
          <p className="max-w-md text-base text-slate-600 md:text-lg">
            Instead of forcing a deck, SprintPlanner turns your real execution
            data into usable investor artefacts.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {artefacts.map(({ icon: Icon, title, body }) => (
            <Card
              key={title}
              className="rounded-2xl border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <p className="text-base font-semibold text-slate-900">
                  {title}
                </p>
                <p className="text-sm text-slate-600">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
