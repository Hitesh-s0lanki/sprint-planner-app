"use client";

import { SignUp } from "@clerk/nextjs";
import { IdeasChatHeader } from "./ideas-chat-header";
import { Rocket } from "lucide-react";

export function IdeasAuthView() {
  return (
    <div className="flex flex-col w-full">
      <IdeasChatHeader
        activeStep={0}
        stepName="Get Started"
        onOpenSteps={() => {}}
      />
      <div className="flex w-full md:justify-center lg:justify-center md:items-center lg:items-center px-4 sm:px-6 overflow-auto min-h-0">
        <div className="w-full max-w-md space-y-4 py-5">
          {/* Header */}
          <div className=" text-center space-y-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex justify-center shrink-0">
              <div className="rounded-full bg-blue-100 p-3 sm:p-4">
                <Rocket className="size-8 sm:size-10 text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Turn your idea into a <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>4-week venture
              </h2>
            </div>
          </div>

          {/* Clerk Auth Component */}
          <div className="flex justify-center pt-4">
            <div className="w-full max-w-md">
              <SignUp
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "shadow-lg border border-slate-200 rounded-lg",
                    headerTitle: "text-slate-900",
                    headerSubtitle: "text-slate-600",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
