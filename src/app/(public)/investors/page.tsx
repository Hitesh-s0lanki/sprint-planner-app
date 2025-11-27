"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Users,
  MessageCircle,
  FileText,
  Sparkles,
  ArrowDownRight,
  Timer,
  Layers,
  HelpCircle,
} from "lucide-react";

const profitPoints = [
  {
    icon: BarChart3,
    title: "Higher signal per founder",
    body: "See how founders behave over a real 4-week sprint — not just in one polished pitch meeting.",
  },
  {
    icon: Timer,
    title: "Faster yes / no decisions",
    body: "Time-boxed sprints give you enough evidence to move from “maybe” to a clear yes, no, or park.",
  },
  {
    icon: ShieldCheck,
    title: "Reduced risk on early bets",
    body: "You get proof of execution, experiments, and learning speed before wiring the first serious cheque.",
  },
  {
    icon: Users,
    title: "Scalable founder screening",
    body: "Run multiple founders through the same sprint framework and compare performance apples-to-apples.",
  },
];

const steps = [
  {
    label: "Step 1",
    title: "Idea intake & sprint setup",
    body: "You or the founder submit a concise idea brief. SprintPlanner converts it into a 4-week venture sprint.",
  },
  {
    label: "Step 2",
    title: "Execution & weekly check-ins",
    body: "Founders execute inside the sprint — logging tasks, launches, and learnings week by week.",
  },
  {
    label: "Step 3",
    title: "Anonymous Q&A & AI summaries",
    body: "You ask questions anonymously. Founders respond; AI keeps a clean, searchable summary of the thread.",
  },
  {
    label: "Step 4",
    title: "Decision-ready narrative",
    body: "At the end, you receive a compact narrative memo, metrics snapshot, and risk/edge highlights.",
  },
];

const qaBenefits = [
  "Ask hard questions without influencing founder behaviour or tone.",
  "Let AI cluster repeated questions, highlight unclear answers, and surface red flags.",
  "Keep all context in one thread instead of scattered emails and calls.",
  "Use the Q&A history as part of your IC / partner discussion material.",
];

export default function InvestorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero */}
      <section className="w-full border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-xl space-y-5">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              For Investors & Venture Studios
            </Badge>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Run serious 4-week idea sprints
              <br />
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                before you commit capital.
              </span>
            </h1>

            <p className="text-sm text-slate-600 md:text-base">
              SprintPlanner gives you an execution-first view of founders: how
              they plan, build, learn, and communicate over a focused 4-week
              sprint — with anonymous Q&amp;A and AI-powered summaries built in.
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500 md:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Idea sprints for early conviction
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                Narrative memos auto-generated
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                Comparable data across founders
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="gap-2 rounded-full bg-primary px-6 py-5 text-sm font-medium text-white hover:bg-primary/90">
                Start an investor sprint
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-sm text-slate-800 hover:bg-slate-50"
              >
                Book a 20-min walkthrough
              </Button>
            </div>
          </div>

          {/* Right: quick investor value card */}
          <div className="w-full max-w-md">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Investor view at a glance
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  One sprint → clear picture of founder quality, idea potential,
                  and execution speed.
                </p>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <ArrowDownRight className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      See week-on-week progress instead of one polished pitch
                      deck.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowDownRight className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      Track how founders react to feedback, blockers, and new
                      information.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowDownRight className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      Use the sprint narrative as input to IC memos and partner
                      discussions.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profit / Value for investors */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Why investors use SprintPlanner
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
                Better decisions, with less time in the maybe-zone.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 md:text-base">
              SprintPlanner helps you increase hit-rate on early bets while
              reducing time spent on founders and ideas that aren&apos;t ready.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {profitPoints.map((p) => (
              <Card
                key={p.title}
                className="rounded-2xl border-slate-200 bg-slate-50/70 shadow-sm"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <p.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-600 md:text-sm">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Step cycle: Idea → Sprint → Q&A → Decision */}
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Investor sprint cycle
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
                From idea intake to decision-ready narrative.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 md:text-base">
              A simple, repeatable cycle you can run with dozens of founders,
              across multiple themes or thesis areas.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card
                key={step.label}
                className="flex flex-col rounded-2xl border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex px-3 py-1 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {step.label}
                    </span>
                    <Layers className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-600 md:text-sm">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Anonymous Q&A feature */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1.1fr]">
            {/* Left: description */}
            <div className="space-y-4">
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Anonymous Q&A workspace
              </Badge>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Ask anything, stay anonymous.
              </h2>
              <p className="text-sm text-slate-600 md:text-base">
                SprintPlanner gives you an anonymous Q&amp;A lane with each
                founder. You ask the hard questions; founders respond in their
                own words; AI turns the conversation into a compact summary that
                travels with the sprint.
              </p>

              <div className="space-y-2 text-xs text-slate-600 md:text-sm">
                {qaBenefits.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <HelpCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual-ish card */}
            <Card className="rounded-2xl border-slate-200 bg-slate-50/80 shadow-sm">
              <CardContent className="space-y-4 p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Investor Q&amp;A Thread
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Anonymised · AI summarised
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                    Signal-focused
                  </span>
                </div>

                <div className="space-y-3 rounded-xl bg-white p-4 text-xs text-slate-700 shadow-sm">
                  <p className="font-semibold text-slate-900">
                    Sample questions you might ask:
                  </p>
                  <ul className="space-y-1.5">
                    <li>• What did you ship in the last 7 days?</li>
                    <li>• What changed in your thinking since Week 1?</li>
                    <li>• Which metric are you optimising for this sprint?</li>
                    <li>
                      • What&apos;s the biggest risk you uncovered so far?
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100">
                  <p className="mb-1 font-semibold">AI Q&amp;A Summary</p>
                  <p className="text-[11px] text-slate-300">
                    &quot;Founder moves fast on product, still early on
                    go-to-market clarity. Strong bias for iteration, open to
                    feedback, aware of main risks around distribution.&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8 lg:py-20">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
            Start your first investor sprint
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Turn &quot;interesting founder&quot; into a
            <br className="hidden md:block" /> 4-week execution snapshot.
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Invite a founder (or a full cohort) into SprintPlanner and see how
            they operate inside a real, time-boxed sprint before you commit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button className="gap-2 rounded-full bg-primary px-6 py-5 text-sm font-medium text-white hover:bg-primary/90">
              Get investor access
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-300 bg-white text-sm text-slate-800 hover:bg-slate-50"
            >
              Talk to the team
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
