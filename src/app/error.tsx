"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-white via-slate-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            An unexpected error occurred. You can try again or return home.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={() => reset()}
              className="rounded-full bg-primary px-6 py-5 text-sm text-white hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            >
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          If this keeps happening, please contact support.
        </p>
      </div>
    </main>
  );
}
