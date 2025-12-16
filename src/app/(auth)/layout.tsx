import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock, Rocket } from "lucide-react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Sign In – SprintPlanner",
  description:
    "Sign in to SprintPlanner to start your 4-week venture sprint. Turn your ideas into executable ventures with our structured framework.",
  path: "/sign-in",
  keywords: ["sign in", "login", "SprintPlanner account"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left / Brand panel */}
      <div className="relative hidden w-0 flex-1 flex-col justify-between border-r border-slate-200 bg-slate-950 px-10 py-8 text-slate-50 lg:flex lg:w-[52%]">
        {/* Top nav-ish */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl" />
              <Image
                src="/logo.svg"
                alt="SprintPlanner"
                fill
                className="relative rounded-2xl object-contain"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              SprintPlanner
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="space-y-6 w-full px-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Turn ideas into 4-week ventures
          </p>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Give one idea a serious
              <br />
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                4-week execution sprint.
              </span>
            </h1>
            <p className="max-w-md text-sm text-slate-300">
              SprintPlanner helps you move from “I&apos;ll do it someday” to a
              focused, time-boxed sprint — with structure, clarity, and
              investor-ready outputs baked in.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>4-week, time-boxed sprints with clear weekly focus.</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Execution-first — ship experiments, not just decks.</span>
            </div>
          </div>
        </div>

        {/* Bottom mini-note */}
        <div className="text-[11px] text-slate-500 px-10">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-300 underline-offset-2 hover:underline"
          >
            Terms
          </Link>{" "}
          &{" "}
          <Link
            href="/privacy"
            className="text-slate-300 underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>

      {/* Right / Auth panel */}
      <div className="flex min-h-screen w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:w-[48%] lg:px-10">
        {children}
      </div>
    </div>
  );
}
