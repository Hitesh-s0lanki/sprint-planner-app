"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Database, Share2 } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Home",
    icon: LayoutDashboard,
    href: (projectId: string) => `/app/${projectId}`,
    color: "text-sidebar-primary-foreground",
  },
  {
    title: "Narrative",
    icon: FileText,
    href: (projectId: string) => `/app/${projectId}/narrative`,
    color: "text-sidebar-primary-foreground",
  },
  {
    title: "Sources",
    icon: Database,
    href: (projectId: string) => `/app/${projectId}/sources`,
    color: "text-sidebar-primary-foreground",
  },
  {
    title: "Social",
    icon: Share2,
    href: (projectId: string) => `/app/${projectId}/social`,
    color: "text-sidebar-primary-foreground",
  },
];

export function SidebarItems() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId as string;

  return (
    <SidebarMenu className="px-2 py-2">
      {navigationItems.map((item) => {
        const href = item.href(projectId);
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const Icon = item.icon;

        return (
          <SidebarMenuItem key={item.title} className="px-2">
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              className={cn(
                "group relative h-8 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-sidebar-accent to-sidebar-accent/80 text-sidebar-accent-foreground shadow-sm shadow-sidebar-accent/20"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <Link href={href} className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "relative flex items-center justify-center",
                    isActive && "scale-110"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-md bg-primary/20 blur-md animate-pulse" />
                  )}
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 relative transition-all duration-200",
                      isActive
                        ? item.color
                        : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                    )}
                  />
                </div>
                <span className="font-medium text-sm text-sidebar-foreground">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
