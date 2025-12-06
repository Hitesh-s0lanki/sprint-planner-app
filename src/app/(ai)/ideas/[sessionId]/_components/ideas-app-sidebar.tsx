"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { IdeasSidebarHeader } from "./ideas-sidebar-header";
import { IdeaStepper } from "./ideas-stepper";

type IdeasAppSidebarProps = {
  children: React.ReactNode;
};

const IdeasAppSidebar = ({ children }: IdeasAppSidebarProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <IdeasSidebarHeader />
        <SidebarContent className="gap-0">
          <IdeaStepper activePhaseId={1} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default IdeasAppSidebar;
