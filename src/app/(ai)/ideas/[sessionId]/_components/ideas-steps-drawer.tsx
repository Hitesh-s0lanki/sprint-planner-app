"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface IdeasStepsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeStep: number;
}

export function IdeasStepsDrawer({
  open,
  onOpenChange,
}: IdeasStepsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Steps</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
