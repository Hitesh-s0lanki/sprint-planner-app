import { ReactNode } from "react";
import IdeasAppSidebar from "./_components/ideas-app-sidebar";

interface IdeasLayoutProps {
  children: ReactNode;
}

export default function IdeasLayout({ children }: IdeasLayoutProps) {
  return (
    <div className="h-screen w-full">
      <IdeasAppSidebar>{children}</IdeasAppSidebar>
    </div>
  );
}
