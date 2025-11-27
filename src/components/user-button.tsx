"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { GenerateAvatar } from "@/components/ui/generate-avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSheet } from "@/components/profile-sheet";

export function UserButton() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  if (!isLoaded || !user) {
    return null;
  }

  const getUserName = () => {
    if (user.fullName) return user.fullName;
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.emailAddresses[0]?.emailAddress || "User";
  };

  const getUserEmail = () => {
    return user.emailAddresses[0]?.emailAddress || "";
  };

  const onLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (isMobile) {
    return (
      <>
        <Drawer>
          <DrawerTrigger>
            <GenerateAvatar
              seed={getUserName()}
              variant="initials"
              className="size-9"
            />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{getUserName()}</DrawerTitle>
              <DrawerDescription>{getUserEmail()}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="outline" onClick={() => router.push("/app")}>
                <LayoutDashboard className="size-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/app/settings")}
              >
                <Settings className="size-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => setProfileSheetOpen(true)}
              >
                <User className="size-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <ProfileSheet
          open={profileSheetOpen}
          onOpenChange={setProfileSheetOpen}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <GenerateAvatar
            seed={getUserName()}
            variant="initials"
            className="size-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-72">
          <DropdownMenuLabel>
            <div className="flex items-center gap-4">
              <GenerateAvatar
                seed={getUserName()}
                variant="initials"
                className="size-9"
              />
              <div className="flex flex-col gap-1">
                <span className="truncate font-medium">{getUserName()}</span>
                <span className="font-sm text-muted-foreground truncate font-normal">
                  {getUserEmail()}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between"
            onClick={() => router.push("/app")}
          >
            Home
            <LayoutDashboard className="size-4" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between"
            onClick={() => router.push("/app/settings")}
          >
            Settings
            <Settings className="size-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setProfileSheetOpen(true)}
          >
            Profile
            <User className="size-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between"
            onClick={onLogout}
            variant="destructive"
          >
            Logout
            <LogOut className="size-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileSheet
        open={profileSheetOpen}
        onOpenChange={setProfileSheetOpen}
      />
    </>
  );
}
