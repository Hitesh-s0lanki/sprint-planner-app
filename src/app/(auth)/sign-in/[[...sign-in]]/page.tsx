import { SignIn } from "@clerk/nextjs";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Sign In – SprintPlanner",
  description:
    "Sign in to SprintPlanner to start your 4-week venture sprint. Turn your ideas into executable ventures with our structured framework.",
  path: "/sign-in",
  image: "/og-image.png", // Use default OG image
  imageAlt: "Sign In to SprintPlanner",
  keywords: ["sign in", "login", "SprintPlanner account"],
});

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <SignIn />
    </div>
  );
}
