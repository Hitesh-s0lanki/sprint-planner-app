"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative w-full min-h-screen border-b bg-linear-to-b from-background via-white to-[#c9d4f3]">
      <div className="flex max-w-full flex-col items-center gap-10 px-4 py-8 sm:py-12 md:flex-row md:gap-14 md:py-20 md:px-10 lg:px-40 lg:py-24">
        {/* ---------------- Left Side ---------------- */}
        <div className="flex-1 w-full space-y-5 sm:space-y-6 text-center md:text-left">
          {/* Badge */}
          <div className="flex justify-center md:justify-start">
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/20 bg-primary/10 text-primary px-3 py-1 text-xs"
            >
              <Sparkles className="mr-1.5 h-3 w-3" /> Venture in 4 Weeks
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-balance text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight md:text-5xl lg:text-5xl">
            Got an idea?{" "}
            <span className="bg-linear-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Let&apos;s turn it into a reality!
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-balance text-sm sm:text-base text-gray-600 leading-relaxed md:text-lg lg:text-xl max-w-xl mx-auto md:mx-0">
            Turning your ideas into executable 4-week ventures.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2 md:justify-start">
            <Button
              className="gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-sm"
              onClick={() => {
                router.push("/ideas");
              }}
            >
              Start your first venture
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="gap-2 rounded-full border-slate-300 bg-white px-6 py-2.5 text-sm text-slate-800 hover:bg-slate-50 w-full sm:w-auto shadow-sm"
              onClick={() => {
                const element = document.getElementById("problem-solution");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Rocket className="h-4 w-4 text-primary" />
              Watch how it works
            </Button>
          </div>
        </div>

        {/* ---------------- Right Side (Sprint Preview Card) ---------------- */}
        <div className="flex justify-center md:justify-end md:min-w-sm lg:min-w-sm mt-4 sm:mt-0">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl rounded-2xl border border-slate-100 bg-white/90 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary">
                  Sprint Overview
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Idea → Validate → Build → Launch
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-emerald-700 self-start sm:self-auto">
                Week 1 of 4
              </span>
            </div>

            {/* Sprint Steps */}
            <div className="space-y-2.5 sm:space-y-3">
              {[
                {
                  label: "Week 1",
                  title: "Clarity & Validation",
                  active: true,
                },
                { label: "Week 2", title: "MVP Blueprint" },
                { label: "Week 3", title: "Build & Ship" },
                { label: "Week 4", title: "Launch & Narrative" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50 px-2.5 sm:px-3 py-2 transition-all hover:shadow-sm"
                >
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold shrink-0 ${
                      item.active
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {item.label} · {item.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                      {item.active ? "In progress" : "Upcoming"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
              Keep all tasks, docs & learnings in one sprint timeline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
