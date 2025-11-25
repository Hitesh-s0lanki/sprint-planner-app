"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@/components/user-button";
import { Sparkles, LayoutGrid, Zap } from "lucide-react";

export function AppHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/80 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-linear-to-br from-primary/20 via-primary/10 to-transparent blur-sm" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Workspace
                  </span>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
                  {user?.firstName
                    ? `${user.firstName}'s workspace`
                    : "Personal workspace"}
                  <Sparkles className="h-4 w-4 text-primary/70" />
                </h1>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50">
              <Zap className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-xs font-medium text-muted-foreground">
                Quick Access
              </span>
            </div>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
