import { ReactNode } from "react";
import IdeasAppSidebar from "./_components/ideas-app-sidebar";
import { IdeasStageProvider } from "./_components/ideas-stage-context";

interface IdeasLayoutProps {
  children: ReactNode;
}

export default function IdeasLayout({ children }: IdeasLayoutProps) {
  return (
    <IdeasStageProvider>
      <div className="h-screen w-full">
        <IdeasAppSidebar>{children}</IdeasAppSidebar>
      </div>
    </IdeasStageProvider>
  );
}
