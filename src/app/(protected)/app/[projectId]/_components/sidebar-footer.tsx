"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Settings } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter as UISidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const footerItems = [
  {
    title: "Help Center",
    icon: HelpCircle,
    href: () => `/contact`,
    color: "text-sidebar-primary-foreground",
  },
  {
    title: "Project Settings",
    icon: Settings,
    href: (projectId: string) => `/app/${projectId}/settings`,
    color: "text-sidebar-primary-foreground",
  },
];

export function SidebarFooter() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId as string;

  const { open } = useSidebar();

  return (
    <UISidebarFooter className="border-t border-sidebar-border/50 bg-linear-to-t from-sidebar via-sidebar to-sidebar-accent/5">
      <SidebarMenu className="px-2 py-2">
        {footerItems.map((item) => {
          const href = item.href(projectId);
          const isActive = pathname === href;
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.title} className={cn(open && "px-2")}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={cn(
                  "group relative h-8 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent/80 text-sidebar-accent-foreground shadow-sm"
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
                      <div className="absolute inset-0 rounded-md bg-primary/20 blur-md" />
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
                  <span className="font-medium text-xs text-sidebar-foreground">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </UISidebarFooter>
  );
}
