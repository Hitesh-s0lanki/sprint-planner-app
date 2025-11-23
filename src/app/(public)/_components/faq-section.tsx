"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is SprintPlanner?",
    answer:
      "SprintPlanner is a venture OS that helps you turn raw ideas into structured, executable 4-week sprints. It gives you a weekly focus, tasks, and investor-ready artefacts as you execute.",
  },
  {
    question: "Who is SprintPlanner for?",
    answer:
      "It’s built for solo builders, small teams, and early-stage investors or studios who want a repeatable way to validate and launch ideas without getting stuck in planning mode.",
  },
  {
    question: "How does a 4-week sprint work?",
    answer:
      "Each sprint is broken into four themed weeks: clarity & validation, MVP blueprint, build & ship, and launch & narrative. You get prompts, checklists, and structure for each week so you always know what to work on next.",
  },
  {
    question: "Do I need to be a technical founder?",
    answer:
      "No. SprintPlanner is execution-first, not code-first. You can use it to validate problems, design journeys, run experiments, and collaborate with technical or non-technical partners.",
  },
  {
    question: "Can I run multiple ideas at once?",
    answer:
      "You can, but we strongly recommend focusing on one idea per sprint. The system is opinionated towards depth over juggling, so you give each idea a fair 4-week shot.",
  },
  {
    question: "What do I get at the end of a sprint?",
    answer:
      "You walk away with a validated (or invalidated) idea, a basic product or prototype, a clear narrative memo, a metrics snapshot, and a roadmap for what to do next.",
  },
  {
    question: "Can my team collaborate inside SprintPlanner?",
    answer:
      "Yes. You can invite collaborators, share sprint timelines, assign tasks, and keep one shared place for decisions, experiments, and learnings.",
  },
  {
    question: "Is there a free way to try SprintPlanner?",
    answer:
      "We plan to offer at least one free sprint so you can experience the full 4-week flow before committing. Pricing beyond that will be simple and sprint-based.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white"
    >
      <div className="flex min-h-screen max-w-full flex-col justify-center px-4 py-12 md:py-16 md:px-10 lg:px-40">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
            FAQ
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            Your questions, answered.
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Everything you need to know before you start your first 4-week
            sprint.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="w-full max-w-5xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-none"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "group flex flex-1 items-center justify-between gap-4 rounded-xl px-5 py-4 text-left transition-all hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                      "data-[state=open]:bg-slate-50/50"
                    )}
                  >
                    <span className="text-sm font-semibold text-slate-900 md:text-base">
                      {faq.question}
                    </span>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-data-[state=open]:bg-primary/20">
                      <Plus className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:hidden" />
                      <Minus className="h-4 w-4 transition-transform duration-200 hidden group-data-[state=open]:block" />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-slate-600 md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
