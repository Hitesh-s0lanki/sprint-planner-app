import Hero from "./_components/hero";
import { ProblemSolutionSection } from "./_components/problem-solution-section";
import { SprintFlowSection } from "./_components/sprint-flow-section";
import { WhoItsForSection } from "./_components/who-its-for-section";
import { InvestorReadySection } from "./_components/investor-ready-section";
import { FaqSection } from "./_components/faq-section";
import Footer from "./_components/footer";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/seo/structured-data";
import {
  generateFAQSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/seo";

const faqs = [
  {
    question: "What is SprintPlanner?",
    answer:
      "SprintPlanner is a venture OS that helps you turn raw ideas into structured, executable 4-week sprints. It gives you a weekly focus, tasks, and investor-ready artefacts as you execute.",
  },
  {
    question: "Who is SprintPlanner for?",
    answer:
      "It's built for solo builders, small teams, and early-stage investors or studios who want a repeatable way to validate and launch ideas without getting stuck in planning mode.",
  },
  {
    question: "How does a 4-week sprint work?",
    answer:
      "Each sprint is broken into four themed weeks: clarity & validation, MVP blueprint, build & ship, and launch & narrative. You get prompts, checklists, and structure for each week so you always know what to work on next.",
  },
  {
    question: "Do I need to be a technical founder?",
    answer:
      "No. SprintPlanner is execution-first, not code-first. You can use it to validate problems, design journeys, run experiments, and collaborate with technical or non-technical partners.",
  },
  {
    question: "Can I run multiple ideas at once?",
    answer:
      "You can, but we strongly recommend focusing on one idea per sprint. The system is opinionated towards depth over juggling, so you give each idea a fair 4-week shot.",
  },
  {
    question: "What do I get at the end of a sprint?",
    answer:
      "You walk away with a validated (or invalidated) idea, a basic product or prototype, a clear narrative memo, a metrics snapshot, and a roadmap for what to do next.",
  },
  {
    question: "Can my team collaborate inside SprintPlanner?",
    answer:
      "Yes. You can invite collaborators, share sprint timelines, assign tasks, and keep one shared place for decisions, experiments, and learnings.",
  },
  {
    question: "Is there a free way to try SprintPlanner?",
    answer:
      "We plan to offer at least one free sprint so you can experience the full 4-week flow before committing. Pricing beyond that will be simple and sprint-based.",
  },
];

export const metadata = generateSEOMetadata({
  title: "SprintPlanner – Agile Sprint & Task Planning Software",
  description:
    "SprintPlanner helps teams plan and manage agile sprints with ease. Turn your ideas into executable 4-week ventures. Track tasks, collaborate, and deliver faster. Sign up free!",
  path: "/",
  image: "/og-home.png", // Recommended: Create a 1200x630px OG image for homepage
  imageAlt: "SprintPlanner - Turn ideas into executable 4-week ventures",
  keywords: [
    "sprint planning",
    "agile planning app",
    "task management tool",
    "4-week sprint",
    "venture planning",
    "idea execution",
    "startup planning",
    "sprint framework",
  ],
});

const HomePage = () => {
  return (
    <>
      <StructuredData
        data={[generateFAQSchema(faqs), generateSoftwareApplicationSchema()]}
      />
      <div>
        <Hero />
        <ProblemSolutionSection />
        <SprintFlowSection />
        <WhoItsForSection />
        <InvestorReadySection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
