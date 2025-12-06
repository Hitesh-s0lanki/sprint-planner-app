"use client";

import { cn } from "@/lib/utils";
import {
  Lightbulb,
  User,
  FileSearch,
  LineChart,
  Cpu,
  Target,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";

export const IDEA_PHASES = [
  {
    id: 1,
    title: "Idea Summary",
    funTitle: "Spark the Idea",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "Team Details",
    funTitle: "Know Your Team",
    icon: User,
  },
  {
    id: 3,
    title: "Deep Idea Details",
    funTitle: "Deep Dive",
    icon: FileSearch,
  },
  {
    id: 4,
    title: "Market & Competition",
    funTitle: "Market & Rivals",
    icon: LineChart,
  },
  {
    id: 5,
    title: "Technology Needs",
    funTitle: "Tech Stack",
    icon: Cpu,
  },
  {
    id: 6,
    title: "Business Goals",
    funTitle: "Set the Targets",
    icon: Target,
  },
  {
    id: 7,
    title: "Execution Preferences",
    funTitle: "Execution Style",
    icon: PlayCircle,
  },
  {
    id: 8,
    title: "Constraints",
    funTitle: "Reality Check",
    icon: AlertTriangle,
  },
];

type PhaseState = "completed" | "active" | "upcoming";

interface IdeaStepperProps {
  activePhaseId: number;
  onPhaseChange?: (phaseId: number) => void;
}

function getPhaseState(phaseId: number, activePhaseId: number): PhaseState {
  if (phaseId < activePhaseId) return "completed";
  if (phaseId === activePhaseId) return "active";
  return "upcoming";
}

export function IdeaStepper({
  activePhaseId,
  onPhaseChange,
}: IdeaStepperProps) {
  return (
    <aside className="h-full flex flex-col px-4 py-6 ">
      {/* Timeline */}
      <div className="flex-1">
        {/* central vertical line (behind nodes) */}

        <div className="space-y-3 relative">
          <div className="absolute my-8 left-6 top-0 bottom-0 w-[2px] bg-slate-800/90 pointer-events-none" />
          {IDEA_PHASES.map((phase) => {
            const state = getPhaseState(phase.id, activePhaseId);
            const Icon = phase.icon;
            const isClickable = state === "completed" || state === "active";

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() =>
                  isClickable ? onPhaseChange?.(phase.id) : undefined
                }
                className={cn(
                  "group relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-0",
                  state === "active" &&
                    "bg-slate-900/80 shadow-[0_0_0_1px_rgba(59,130,246,0.65)]",
                  state === "completed" &&
                    "bg-slate-900/40 hover:bg-slate-900/60",
                  state === "upcoming" &&
                    "bg-transparent hover:bg-slate-900/40",
                  !isClickable && "cursor-default",
                  isClickable && "cursor-pointer"
                )}
                aria-current={state === "active" ? "step" : undefined}
              >
                {/* Node & line */}
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold transition-all duration-150",
                      state === "active" &&
                        "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.8)]",
                      state === "completed" &&
                        "border-emerald-500 bg-emerald-500/10 text-emerald-300",
                      state === "upcoming" &&
                        "border-slate-700 bg-slate-900 text-slate-500",
                      "group-hover:scale-[1.03]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0 justify-start items-start">
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        state === "active" && "text-slate-50",
                        state === "completed" && "text-slate-100",
                        state === "upcoming" && "text-slate-500"
                      )}
                    >
                      {phase.funTitle}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {phase.title}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
