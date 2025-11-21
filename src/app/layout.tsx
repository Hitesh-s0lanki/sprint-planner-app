import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";

import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const font = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "SprintPlanner - Turning Ideas into Executable 4-Week Ventures",
  description:
    "SprintPlanner is a platform that helps you turn your ideas into executable 4-week ventures. It provides a framework for you to plan, execute, and track your venture.",
  icons: ["/logo.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className={`${font.className} antialiased`}>
            <Toaster />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
