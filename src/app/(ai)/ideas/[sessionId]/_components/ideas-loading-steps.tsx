"use client";

import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { IdeasChatHeader } from "./ideas-chat-header";
import type { EventType } from "@/modules/chat/types";

interface LoadingStep {
  id: EventType | "redirecting";
  label: string;
  status: "pending" | "loading" | "completed";
}

const STEP_LABELS: Record<EventType | "redirecting", string> = {
  team_members_synced: "Syncing Team Members",
  project_created: "Creating Project",
  sources_updated: "Updating Documents",
  sprint_plan_generated: "Generating Sprint Plan",
  narrative_sections_started: "Starting Narrative Generation",
  completed: "Finalizing",
  redirecting: "Heading to Project",
};

interface IdeasLoadingStepsProps {
  eventProgress?: Partial<Record<EventType, "idle" | "started" | "completed">>;
  isCompleted?: boolean;
  isRedirecting?: boolean;
}

export function IdeasLoadingSteps({
  eventProgress = {},
  isCompleted = false,
  isRedirecting = false,
}: IdeasLoadingStepsProps) {
  // Build steps based on event progress
  const eventOrder: (EventType | "redirecting")[] = [
    "team_members_synced",
    "project_created",
    "sources_updated",
    "sprint_plan_generated",
    "narrative_sections_started",
    "completed",
    "redirecting",
  ];

  const steps: LoadingStep[] = eventOrder.map((eventId) => {
    if (eventId === "redirecting") {
      return {
        id: "redirecting",
        label: STEP_LABELS.redirecting,
        status: isRedirecting
          ? "loading"
          : isCompleted
          ? "completed"
          : "pending",
      };
    }

    const progress = eventProgress[eventId];
    let status: "pending" | "loading" | "completed" = "pending";

    if (progress === "started") {
      status = "loading";
    } else if (progress === "completed") {
      status = "completed";
    } else if (eventId === "completed" && isCompleted) {
      status = "completed";
    }

    return {
      id: eventId,
      label: STEP_LABELS[eventId],
      status,
    };
  });

  // Calculate current step index (first non-completed step)
  const currentStepIndex = steps.findIndex(
    (step) => step.status !== "completed"
  );
  const activeStepIndex =
    currentStepIndex === -1 ? steps.length : currentStepIndex;

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
      <IdeasChatHeader
        activeStep={activeStepIndex}
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
          <div className="pt-4 md:px-10 px-4 lg:px-16">
            <div className="flex items-center justify-center text-xs text-slate-500 mb-2">
              <span>
                Step {Math.min(activeStepIndex + 1, steps.length)} of{" "}
                {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
