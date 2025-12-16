import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ProductionAnalytics } from "@/components/analytics/production-analytics";
import { DM_Sans } from "next/font/google";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { DefaultStructuredData } from "@/components/seo/structured-data";

const font = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = generateSEOMetadata({
  title: "SprintPlanner - Turning Ideas into Executable 4-Week Ventures",
  description:
    "SprintPlanner helps you turn your ideas into executable 4-week ventures. Plan, execute, and track your venture with a focused framework designed for builders and investors. Start your first venture sprint today!",
  path: "/",
  image: "/og-image.png", // Default OG image - create a 1200x630px image
  imageAlt: "SprintPlanner - Turn ideas into executable 4-week ventures",
  keywords: [
    "sprint planning",
    "agile planning",
    "venture planning",
    "4-week sprint",
    "idea execution",
    "task management",
    "startup planning",
    "venture builder",
    "sprint framework",
    "execution planning",
  ],
});

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
            <DefaultStructuredData />
            <Toaster />
            {children}
            <ProductionAnalytics />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
