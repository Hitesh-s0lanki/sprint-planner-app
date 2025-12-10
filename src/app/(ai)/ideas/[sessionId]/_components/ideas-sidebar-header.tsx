"use client";

import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function IdeasSidebarHeader() {
  return (
    <UISidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className=" hover:bg-transparent gap-2"
            asChild
          >
            <Link href="/app">
              <Image
                src="/logo.svg"
                alt="SprintPlanner Logo"
                width={36}
                height={36}
                className="relative h-9 w-9 shrink-0 drop-shadow-sm"
              />
              <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground">
                <span className="truncate font-semibold">SprintPlanner</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </UISidebarHeader>
  );
}
