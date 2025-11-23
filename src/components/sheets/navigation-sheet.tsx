"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigationSheet } from "@/hooks/use-navigation-sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NavigationSheet = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onClose } = useNavigationSheet();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Investors", path: "/investors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      // Handle anchor links
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(path);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-72 h-full" side="right">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="w-full h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-2 px-4 py-6 border-b">
            <Image
              src="/logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="font-semibold text-lg capitalize text-[#1d1c24]">
              SprintPlanner
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-1 px-2 py-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                variant="ghost"
                className={cn(
                  "justify-start text-left h-auto py-4 px-4 text-base hover:text-[#1d1c24] hover:bg-slate-50 transition-all rounded-lg",
                  pathname === item.path &&
                    "text-[#1d1c24] bg-slate-50 font-medium"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {item.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationSheet;
