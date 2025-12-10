"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { IdeasChatHeader } from "./ideas-chat-header";

interface LoadingStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "completed";
}

const STEPS: LoadingStep[] = [
  { id: "project", label: "Project Creation", status: "pending" },
  { id: "tasking", label: "Sprint Generation", status: "pending" },
  { id: "source", label: "Sources Generation", status: "pending" },
  { id: "narrative", label: "Narrative Drafting", status: "pending" },
  { id: "invitation", label: "Inviting Team", status: "pending" },
  { id: "redirecting", label: "Heading to Project", status: "pending" },
];

// Initialize with first step as loading
const INITIAL_STEPS: LoadingStep[] = STEPS.map((step, idx) =>
  idx === 0 ? { ...step, status: "loading" as const } : step
);

export function IdeasLoadingSteps() {
  const [steps, setSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Process current step
    if (currentStepIndex < STEPS.length) {
      // After 2 seconds, mark as completed and move to next
      const timeout = setTimeout(() => {
        setSteps((prevSteps) =>
          prevSteps.map((step, idx) =>
            idx === currentStepIndex
              ? { ...step, status: "completed" as const }
              : step
          )
        );

        // Move to next step if not at the end
        if (currentStepIndex < STEPS.length - 1) {
          const nextIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextIndex);
          // Mark next step as loading
          setSteps((prevSteps) =>
            prevSteps.map((step, idx) =>
              idx === nextIndex ? { ...step, status: "loading" as const } : step
            )
          );
        } else {
          // All steps completed
          setCurrentStepIndex(STEPS.length);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentStepIndex]);

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
      <IdeasChatHeader
        activeStep={currentStepIndex}
        stepName="Planning Your Sprints"
        onOpenSteps={() => {}}
      />
      <div className="flex justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Planning Your Sprints
            </h2>
            <p className="text-sm text-slate-500">
              Please wait while we set everything up for you
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex justify-center items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50 transition-all"
              >
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                  {step.status === "completed" ? (
                    <CheckCircle2 className=" size-4 text-green-600" />
                  ) : step.status === "loading" ? (
                    <Loader2 className=" size-4 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className=" size-4 text-slate-300" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors",
                      step.status === "completed"
                        ? "text-green-700"
                        : step.status === "loading"
                        ? "text-blue-700"
                        : "text-slate-500"
                    )}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="pt-4md:px-10 px-4 lg:px-16">
            <div className="flex items-center justify-center text-xs text-slate-500 mb-2">
              <span>
                Step {Math.min(currentStepIndex + 1, STEPS.length)} of{" "}
                {STEPS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
