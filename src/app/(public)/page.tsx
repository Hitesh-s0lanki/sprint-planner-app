import Hero from "./_components/hero";
import { ProblemSolutionSection } from "./_components/problem-solution-section";
import { SprintFlowSection } from "./_components/sprint-flow-section";
import { WhoItsForSection } from "./_components/who-its-for-section";
import { InvestorReadySection } from "./_components/investor-ready-section";
import { FaqSection } from "./_components/faq-section";
import Footer from "./_components/footer";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ProblemSolutionSection />
      <SprintFlowSection />
      <WhoItsForSection />
      <InvestorReadySection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default HomePage;
