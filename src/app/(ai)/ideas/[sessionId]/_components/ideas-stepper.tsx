"use client";

import { cn } from "@/lib/utils";

export const IDEA_PHASES = [
  { id: 1, title: "Idea Summary" }, // Stage 1
  { id: 2, title: "User Profile" }, // Stage 2
  { id: 3, title: "Deep Idea Details" }, // Stage 3
  { id: 4, title: "Market & Competition" }, // Stage 4
  { id: 5, title: "Technology Needs" }, // Stage 5
  { id: 6, title: "Business Goals" }, // Stage 6
  { id: 7, title: "Execution Preferences" }, // Stage 7
  { id: 8, title: "Constraints" }, // Stage 8
];

type PhaseState = "completed" | "active" | "upcoming";

interface IdeaStepperProps {
  activePhaseId: number;
  // keep this for later wiring (phase change via click, chat, etc.)
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
    <aside className="w-64 h-fullflex flex-col px-6 py-6">
      <div className="relative mt-2">
        {/* central vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-200" />

        <div className="space-y-6">
          {IDEA_PHASES.map((phase, index) => {
            const state = getPhaseState(phase.id, activePhaseId);
            const isLast = index === IDEA_PHASES.length - 1;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onPhaseChange?.(phase.id)}
                className="relative flex w-full items-start gap-4 text-left focus-visible:outline-none"
              >
                {/* node + line segment */}
                <div className="flex flex-col items-center">
                  {/* circle */}
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                      state === "active" &&
                        "border-blue-500 bg-white shadow-sm",
                      state === "completed" &&
                        "border-emerald-500 bg-emerald-500",
                      state === "upcoming" && "border-slate-300 bg-slate-100"
                    )}
                  >
                    {state === "completed" && (
                      <div className="h-3 w-3 rounded-full bg-white/90" />
                    )}
                    {state === "active" && (
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* line below node (stop at last) */}
                  {!isLast && (
                    <div
                      className={cn(
                        "mt-1 w-[2px] flex-1",
                        state === "completed"
                          ? "bg-emerald-500"
                          : "bg-slate-200"
                      )}
                    />
                  )}
                </div>

                {/* text */}
                <div className="flex-1 pt-0.5">
                  <div
                    className={cn(
                      "text-[11px] font-semibold tracking-[0.16em] uppercase",
                      state === "active" && "text-blue-500",
                      state === "completed" && "text-emerald-600",
                      state === "upcoming" && "text-slate-400"
                    )}
                  >
                    Phase {phase.id}
                  </div>
                  <div
                    className={cn(
                      "mt-1 text-sm font-semibold",
                      state === "active" && "text-white",
                      state === "completed" && "text-white",
                      state === "upcoming" && "text-slate-400"
                    )}
                  >
                    {phase.title}
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
