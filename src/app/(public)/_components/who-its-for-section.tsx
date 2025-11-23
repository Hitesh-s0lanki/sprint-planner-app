"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, DollarSign } from "lucide-react";

const personas = [
  {
    icon: User,
    tag: "Solo builder",
    title: "Individuals validating ideas",
    body: "Perfect if you want to stop planning and start executing.",
    chips: ["Side project", "First-time founder", "Operator → Builder"],
  },
  {
    icon: Users,
    tag: "Startup team",
    title: "Small teams needing clarity",
    body: "Ideal for teams stuck between too many ideas and no direction.",
    chips: ["Idea maze", "Early-stage", "Clarity framework"],
  },
  {
    icon: DollarSign,
    tag: "Investor",
    title: "Investors running sprints",
    body: "Useful for testing founders through real execution — not pitches.",
    chips: ["Venture studio", "Scouts", "Pilot sprint"],
  },
];

export function WhoItsForSection() {
  return (
    <section
      id="who-its-for"
      className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white"
    >
      <div className="flex min-h-screen max-w-full flex-col justify-center px-4 py-12 md:py-16 md:px-10 lg:px-40">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-3">
          <div>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Who is it for?
            </Badge>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl lg:text-4xl">
              Built for people serious about execution.
            </h2>
          </div>
          <p className="max-w-md text-base text-slate-600 md:text-lg">
            If you want a 4-week structured execution sprint, this is made for
            you.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map(({ icon: Icon, tag, title, body, chips }) => (
            <Card
              key={tag}
              className="rounded-2xl border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {tag}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-700" />
                  </div>
                </div>

                <p className="text-base font-semibold text-slate-900">
                  {title}
                </p>
                <p className="text-sm text-slate-600">{body}</p>

                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
