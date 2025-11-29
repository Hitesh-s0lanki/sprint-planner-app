"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/components/user-button";

interface IdeasChatHeaderProps {
  activeStep: number;
  stepName: string;
  onOpenSteps?: () => void;
}

export function IdeasChatHeader({}: IdeasChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-background">
      <SidebarTrigger />
      <UserButton />
    </div>
  );
}
