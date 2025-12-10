"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { IdeasSidebarHeader } from "./ideas-sidebar-header";
import { IdeaStepper } from "./ideas-stepper";
import { IdeasSidebarFooter } from "./ideas-sidebar-footer";
import { useIdeasStage } from "./ideas-stage-context";

type IdeasAppSidebarProps = {
  children: React.ReactNode;
};

const IdeasAppSidebar = ({ children }: IdeasAppSidebarProps) => {
  const { activeStep } = useIdeasStage();

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <IdeasSidebarHeader />
        <SidebarContent className="gap-0">
          <IdeaStepper activePhaseId={activeStep} />
        </SidebarContent>
        <IdeasSidebarFooter />
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default IdeasAppSidebar;
