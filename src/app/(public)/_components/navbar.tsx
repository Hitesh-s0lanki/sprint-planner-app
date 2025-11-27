"use client";

import { cn } from "@/lib/utils";
import { Menu, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNavigationSheet } from "@/hooks/use-navigation-sheet";
import NavigationSheet from "@/components/sheets/navigation-sheet";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GenerateAvatar } from "@/components/ui/generate-avatar";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { onOpen } = useNavigationSheet();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Investors", path: "/investors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <nav className="w-full flex justify-between items-center p-4 md:p-6 md:px-10 lg:px-40">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <h1 className="font-semibold text-base md:text-lg capitalize text-[#1d1c24]">
            SprintPlanner
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm md:text-base text-primary hover:text-[#1d1c24] hover-underline-animation center transition-all inline-block",
                pathname === item.path && "text-[#1d1c24] link-active"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {item.name}
              </span>
            </Link>
          ))}

          {/* User Button - Desktop */}
          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto p-1.5 rounded-full hover:bg-slate-100"
                >
                  <GenerateAvatar
                    seed={user?.fullName || ""}
                    variant="initials"
                    className="size-9"
                  />
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push("/app")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* User Button - Mobile */}
          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1.5 h-auto p-1.5 rounded-full hover:bg-neutral-100"
                >
                  <GenerateAvatar
                    seed={user?.fullName || ""}
                    variant="initials"
                    className="size-9"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push("/app")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            onClick={onOpen}
            className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      <NavigationSheet />
    </>
  );
};

export default Navbar;
