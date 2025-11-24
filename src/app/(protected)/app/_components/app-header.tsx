"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@/components/user-button";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-linear-to-br from-background via-background to-muted/20 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
      <div className="max-w-full flex items-center justify-between p-2 md:p-4 md:px-10 lg:px-40">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-linear-to-r from-primary via-primary/80 to-primary/60 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Workspace
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {user?.firstName
                ? `${user.firstName}'s workspace`
                : "Personal workspace"}
            </h1>
            <Sparkles className="h-4 w-4 text-primary/60" />
          </div>
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
