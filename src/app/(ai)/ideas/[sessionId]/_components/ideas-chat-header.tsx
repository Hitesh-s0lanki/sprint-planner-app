"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { UserButton } from "@/components/user-button";
import Link from "next/link";

interface IdeasChatHeaderProps {
  activeStep: number;
  stepName: string;
  onOpenSteps?: () => void;
}

export function IdeasChatHeader({}: IdeasChatHeaderProps) {
  const { open } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {!open && (
          <Link href="/app" className="flex items-center gap-2">
            <div className="text-left text-sm leading-tight text-sidebar">
              <span className="truncate font-semibold">SprintPlanner</span>
            </div>
          </Link>
        )}
      </div>

      <UserButton />
    </div>
  );
}
