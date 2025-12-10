"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter as UISidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function IdeasSidebarFooter() {
  const router = useRouter();
  const { open } = useSidebar();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearSession = async () => {
    if (isClearing) return;

    setIsClearing(true);
    try {
      const response = await fetch("/api/session/clear", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the new session
        router.push(`/ideas/${data.sessionId}`);
        router.refresh();
      } else {
        console.error("Failed to clear session");
      }
    } catch (error) {
      console.error("Error clearing session:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <UISidebarFooter className="border-t border-sidebar-border/50">
      <SidebarMenu className="px-2 py-2">
        <SidebarMenuItem className={cn(open && "px-2")}>
          <SidebarMenuButton
            onClick={handleClearSession}
            disabled={isClearing}
            tooltip="New Session"
            size="sm"
            variant="outline"
            className={cn(
              "group relative h-8 rounded-lg transition-all duration-200 bg-transparent",
              "border-dotted border-2",
              "justify-center! text-center! text-xs!",
              "hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <RotateCcw
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isClearing && "animate-spin"
                )}
              />
              <span className="font-semibold text-xs text-center">
                {isClearing ? "New Session..." : "New Session"}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </UISidebarFooter>
  );
}
