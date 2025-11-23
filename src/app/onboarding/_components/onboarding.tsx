"use client";

import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Rocket, Sparkles } from "lucide-react";

const Onboarding = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { signOut } = useClerk();

  const { mutate: createUser } = useMutation(
    trpc.clerkAuth.createUser.mutationOptions({
      onSuccess: (res) => {
        toast.success(res.message);
        router.push(`/`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create user");
        // Clerk logout
        signOut();
      },
    })
  );

  useEffect(() => {
    createUser();
  }, [createUser]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-md backdrop-blur-sm">
          {/* subtle gradient accents */}
          <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="relative space-y-6">
            {/* Icon + label */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Setting things up
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Creating your SprintPlanner workspace
                </p>
              </div>
            </div>

            {/* Loader */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Setting up your account…
              </p>
              <p className="max-w-sm text-center text-xs text-slate-500">
                We&apos;re connecting your account and preparing your first
                4-week sprint workspace. This usually takes just a few seconds.
              </p>
            </div>

            {/* Progress line / hints */}
            <div className="space-y-2 pt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 animate-[pulse_1.3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-primary to-indigo-400" />
              </div>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>• Creating your user profile</li>
                <li>• Linking your auth session with SprintPlanner</li>
                <li>• Preparing your dashboard & first sprint view</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          If this takes more than a minute, please refresh the page or try
          signing in again.
        </p>
      </div>
    </main>
  );
};

export default Onboarding;
