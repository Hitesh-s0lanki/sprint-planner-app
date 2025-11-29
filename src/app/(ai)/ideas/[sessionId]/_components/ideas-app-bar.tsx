"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { UserButton } from "@/components/user-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface IdeasAppBarProps {
  activeStep: number;
  stepName: string;
  projectName?: string;
  onStepsClick?: () => void;
}

export function IdeasAppBar({
  activeStep,
  stepName,
  projectName,
  onStepsClick,
}: IdeasAppBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background flex items-center px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="SprintPlanner"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          {!isMobile && (
            <span className="font-semibold text-lg">SprintPlanner</span>
          )}
        </div>
        {projectName && (
          <div className="hidden md:flex flex-col ml-2">
            <span className="text-sm font-medium">{projectName}</span>
            <span className="text-xs text-muted-foreground">Social · Chat</span>
          </div>
        )}
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Step {activeStep} · {stepName}
          </span>
          <Badge variant="secondary" className="text-xs">
            {activeStep} of 6 steps
          </Badge>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 shrink-0">
        {isMobile && onStepsClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onStepsClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
