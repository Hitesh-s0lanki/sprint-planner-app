"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-white via-slate-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <SearchX className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-slate-900">
            Page not found
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <Button
            asChild
            className="mt-6 rounded-full bg-primary px-6 py-5 text-sm text-white hover:bg-primary/90"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Need help?{" "}
          <a
            href="mailto:hiteshsolanki4623@gmail.com"
            className="text-primary underline-offset-2 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
