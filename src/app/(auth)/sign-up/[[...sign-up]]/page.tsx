import { SignUp } from "@clerk/nextjs";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Sign Up – SprintPlanner",
  description:
    "Create your SprintPlanner account and start your first 4-week venture sprint. Turn your ideas into executable ventures with our structured framework.",
  path: "/sign-up",
  image: "/og-image.png", // Use default OG image
  imageAlt: "Sign Up for SprintPlanner",
  keywords: ["sign up", "register", "create account", "SprintPlanner"],
});

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <SignUp />
    </div>
  );
}
