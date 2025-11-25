"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarItems } from "./sidebar-items";
import { SidebarFooter } from "./sidebar-footer";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent className="gap-0">
          <SidebarItems />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}
