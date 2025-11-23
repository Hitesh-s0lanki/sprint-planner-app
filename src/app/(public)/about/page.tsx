"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket,
  Target,
  Compass,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const principles = [
  {
    title: "Execution over theory",
    body: "We care more about what you ship in 4 weeks than how many threads or playbooks you’ve saved.",
  },
  {
    title: "One focused sprint at a time",
    body: "Real progress happens when you give one idea a dedicated window, not when you juggle ten at once.",
  },
  {
    title: "Narratives from real work",
    body: "Investor stories, decks, and memos should come from actual experiments and progress — not fiction.",
  },
  {
    title: "Builder-first experience",
    body: "The product is designed to remove friction for solo builders and small teams, not create more admin.",
  },
];

const howItWorks = [
  {
    label: "1",
    title: "Pick one idea",
    body: "Capture your idea, audience, and problem in a simple, guided brief. No 30-page template required.",
  },
  {
    label: "2",
    title: "Set a 4-week sprint",
    body: "SprintPlanner turns that idea into a four-week structure with themes, prompts, and milestones.",
  },
  {
    label: "3",
    title: "Execute with focus",
    body: "Each week gets a focus: clarity, MVP design, build, and launch. You always know what matters now.",
  },
  {
    label: "4",
    title: "Walk away with proof",
    body: "End the sprint with shipped work, learnings, a narrative memo, and a metrics snapshot you can share.",
  },
];

const founderCards = [
  {
    name: "Built for builders",
    role: "By people who have been in the zero-to-one trenches.",
    text: "SprintPlanner is shaped by actual product and venture-building experience — not just generic templates. The goal is simple: give you rails so you can focus on doing the work.",
  },
  {
    name: "Aligned with investors",
    role: "Designed to make conversations easier.",
    text: "The sprint structure naturally produces the artefacts investors care about: clarity of problem, evidence of execution, and a simple view of traction and next steps.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero */}
      <section className="w-full border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-xl space-y-5">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              About SprintPlanner
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Turning ideas into execution-ready{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                4-week ventures.
              </span>
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              SprintPlanner exists for builders who are tired of “someday”. It’s
              a focused system that helps you give one idea a serious 4-week
              shot — with clear structure, fewer distractions, and
              investor-ready outputs.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 md:text-sm">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                4-week, time-boxed sprints
              </span>
              <span className="inline-flex items-center gap-1">
                <Rocket className="h-4 w-4 text-primary" />
                From idea to launch, step by step
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                Built for solo builders & small teams
              </span>
            </div>
          </div>

          <div className="w-full max-w-md">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  What we are
                </p>
                <p className="text-sm font-medium text-slate-900">
                  A venture OS for focused 4-week sprints — not a generic task
                  app.
                </p>
                <div className="grid gap-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      Structure for idea → validation → build → launch.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      Execution-first workflows instead of endless planning.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      Outputs that naturally translate into investor narratives.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why we built SprintPlanner / Who it's for */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2 lg:px-8 lg:py-18">
          <Card className="rounded-2xl border-slate-200 bg-slate-50/70 shadow-sm">
            <CardContent className="space-y-3 p-6 md:p-7">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Why we built this
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Too many good ideas die between “not started” and
                “over-planned”.
              </p>
              <p className="text-sm text-slate-600">
                Most builders don’t lack ideas — they lack a simple, reliable
                way to move one idea from “interesting” to “I actually tried
                this properly”. SprintPlanner exists to give you a time-boxed,
                guided path from zero to “I gave it a real shot in 4 weeks”.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-slate-50/70 shadow-sm">
            <CardContent className="space-y-3 p-6 md:p-7">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Who it’s for
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Builders, small teams, and investors who care about execution.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Solo builders wanting to seriously test a new idea.</li>
                <li>
                  • Early teams that need one clear direction for 4 weeks.
                </li>
                <li>
                  • Investors and studios running structured idea sprints.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                How SprintPlanner works
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
                A simple 4-step flow from idea to proof.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 md:text-base">
              The goal is not to plan forever — it’s to give your idea a crisp,
              well-run 4-week sprint that results in real evidence.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <Card
                key={step.label}
                className="flex flex-col rounded-2xl border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {step.label}
                    </span>
                    <Target className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-600">{step.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Our principles
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
                The guardrails behind every sprint.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 md:text-base">
              SprintPlanner is intentionally opinionated — these principles
              shape how the product works and how we make decisions.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {principles.map((p) => (
              <Card
                key={p.title}
                className="rounded-2xl border-slate-200 bg-slate-50/70 shadow-sm"
              >
                <CardContent className="space-y-2.5 p-6">
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

      {/* Builder / investor alignment */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-18">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Built at the intersection of builders and investors.
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              SprintPlanner is meant to feel natural for the people doing the
              work, while making it easy to communicate with the people backing
              it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {founderCards.map((item) => (
              <Card
                key={item.name}
                className="rounded-2xl border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="space-y-2.5 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.role}
                  </p>
                  <p className="text-xs text-slate-600 md:text-sm">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500 md:text-sm">
            The mission is simple: help more builders move from “I have an idea”
            to “I ran a real sprint and here’s what I learned”.
          </p>
        </div>
      </section>
    </main>
  );
}
