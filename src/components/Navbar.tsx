"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header
      className="
        sticky top-0 z-50
        h-14
        border-b
        bg-background/70
        backdrop-blur-lg
        supports-backdrop-filter:bg-background/40
        flex items-center
        px-6
        shadow-sm
      "
    >
      {/* LEFT: Logo */}
      <div className="flex flex-1 items-center">
        <Link
          href="/"
          className="text-[18px] font-semibold tracking-tight hover:opacity-80 transition"
        >
          YourLogo
        </Link>
      </div>

      {/* RIGHT: User Button */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
