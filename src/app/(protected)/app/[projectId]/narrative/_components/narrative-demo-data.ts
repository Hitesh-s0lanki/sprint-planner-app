export type NarrativeCategory =
  | "narrative"
  | "product"
  | "engineering"
  | "administrative"
  | "people_hr"
  | "gtm"
  | "funding"
  | "tools";

export type NarrativeSectionType = "text" | "files";

export interface NarrativeSection {
  id: string;
  category: NarrativeCategory;
  name: string;
  type: NarrativeSectionType;
  content: string;
  position: number;
}

export const demoNarrative: Record<NarrativeCategory, NarrativeSection[]> = {
  narrative: [
    {
      id: "n1",
      category: "narrative",
      name: "Executive Summary",
      type: "text",
      content:
        "# Executive Summary\nBrix is a full-stack home construction platform combining standardized architectural plans, AI-driven planning automation, real-time progress monitoring, and build-now-pay-later (BNPL) financing. It solves India's core construction problems—delays, cost overruns, poor supervision, and lack of trust—by offering predictable delivery, transparent pricing, and a 10-year structural warranty. The first MVP focuses on automated planning, cost estimation, and monitoring mockups.",
      position: 0,
    },
    {
      id: "n2",
      category: "narrative",
      name: "PR-Style Launch",
      type: "text",
      content:
        "# PR-Style Launch\n**Introducing Brix: India's first tech-led home construction platform with on-time delivery and BNPL financing.**\nBrix empowers landowners to build homes confidently through AI-generated project plans, transparent pricing, and real-time execution visibility. With standardized designs and quality assurance baked into every step, Brix aims to redefine trust and efficiency in construction.",
      position: 1,
    },
    {
      id: "n3",
      category: "narrative",
      name: "Customer FAQ",
      type: "text",
      content:
        "# Customer FAQ\n**Q: How does Brix guarantee on-time delivery?**\n- Standardized workflows, vetted partners, and milestone tracking.\n\n**Q: What is BNPL for construction?**\n- Eligible landowners can start building now and pay in structured installments.\n\n**Q: How is quality ensured?**\n- Fixed material specs, daily progress logs, milestone-based checks.",
      position: 2,
    },
    {
      id: "n4",
      category: "narrative",
      name: "Problem Statement",
      type: "text",
      content:
        "# Problem Statement\nIndia’s home construction ecosystem is fragmented and unreliable. Customers face:\n- Lack of trustworthy contractors\n- Hidden costs and overruns\n- Delays due to poor coordination\n- No real-time visibility\n- Limited financing options\nThese gaps create anxiety and inefficiency for landowners.",
      position: 3,
    },
    {
      id: "n5",
      category: "narrative",
      name: "Solution Overview",
      type: "text",
      content:
        "# Solution Overview\nBrix delivers predictable, transparent construction through:\n- **Standardized plans** with clear cost and timeline\n- **AI-driven planning** that generates a detailed execution blueprint\n- **Real-time monitoring dashboard** with mock CCTV/API integrations\n- **10-year structural warranty**\n- **BNPL financing** for affordability",
      position: 4,
    },
    {
      id: "n6",
      category: "narrative",
      name: "Success Metrics",
      type: "text",
      content:
        "# Success Metrics\n- **10 qualified leads** within first month\n- **2 signed projects** in pilot phase\n- **3 vendor partners** onboarded\n- **AI planning accuracy > 80%** (timeline + costing)\n- **Landing page conversion ≥ 5%**",
      position: 5,
    },
  ],

  product: [
    {
      id: "p1",
      category: "product",
      name: "Product Vision",
      type: "text",
      content:
        "# Product Vision\nTo build India's most trusted, technology-first construction platform where homes are delivered predictably, transparently, and affordably. Brix becomes the digital backbone of physical construction—standardizing execution while enhancing visibility and financing flexibility.",
      position: 0,
    },
    {
      id: "p2",
      category: "product",
      name: "User Personas",
      type: "text",
      content:
        "# User Personas\n### 1. Urban Landowner\n- Wants to build on family land.\n- Frustrated with unreliable contractors.\n- Needs predictable timelines and financing.\n\n### 2. NRI Owner\n- Remote, needs transparency.\n- Requires live updates, warranty, trust.\n\n### 3. Small Builder/Contractor\n- Wants access to standard templates + workflow tools.",
      position: 1,
    },
    {
      id: "p3",
      category: "product",
      name: "Customer Problems",
      type: "text",
      content:
        "# Customer Problems\n- No visibility on actual progress\n- Unpredictable pricing and overruns\n- Lack of professional project management\n- No financing support\n- Quality inconsistencies",
      position: 2,
    },
    {
      id: "p4",
      category: "product",
      name: "Feature Breakdown (MVP)",
      type: "text",
      content:
        "# Feature Breakdown (MVP)\n- **AI Planning Engine:** Generates timeline, materials, and cost.\n- **Standard Plan Library:** 5–10 ready architectural templates.\n- **Monitoring Mock Dashboard:** Milestones, progress %, mock data feed.\n- **Financing Eligibility Flow:** Rules-based affordability scoring.\n- **Lead Capture System:** Form + admin review panel.",
      position: 3,
    },
    {
      id: "p5",
      category: "product",
      name: "Success Criteria",
      type: "text",
      content:
        "# Success Criteria\n- Users generate a full plan in < 2 minutes\n- Cost estimate accuracy within ±10%\n- Dashboard clearly communicates progress stages\n- Financing decision flow completes in < 45 seconds",
      position: 4,
    },
  ],

  engineering: [
    {
      id: "e1",
      category: "engineering",
      name: "Tech Stack",
      type: "text",
      content:
        "# Tech Stack\n**Frontend:** Next.js, Tailwind, React Query\n**Backend:** Node.js / Express or Django\n**Database:** PostgreSQL\n**AI:** OpenAI GPT-4.1 + prompt engineering layer\n**Cloud:** AWS EC2 + RDS or Vercel\n**Integrations:** Razorpay/PayU, SMS gateway, CCTV vendor APIs",
      position: 0,
    },
    {
      id: "e2",
      category: "engineering",
      name: "System Architecture",
      type: "text",
      content:
        "# System Architecture (High-Level)\n- Client initiates plan selection → backend fetches template\n- AI engine generates cost, timeline, materials\n- Backend stores lead + eligibility output\n- Monitoring dashboard retrieves mock milestone data from a simulation service\n- Financing engine runs rule-based scoring\n- Admin panel fetches leads and project metadata",
      position: 1,
    },
    {
      id: "e3",
      category: "engineering",
      name: "Testing Strategy",
      type: "text",
      content:
        "# Testing Strategy\n- **Unit Tests:** API endpoints, cost engine, eligibility logic\n- **Integration Tests:** AI planning workflow + DB\n- **UI Tests:** Landing page conversion flows\n- **Load Tests:** Estimator API and plan generator\n- **Security Tests:** Input validation, rate limiting",
      position: 2,
    },
  ],

  administrative: [
    {
      id: "a1",
      category: "administrative",
      name: "Company Structure",
      type: "text",
      content:
        "# Company Structure\n- **Founder & CEO:** Product, technology, operations\n- **Contract Architects (Future):** Template design and validation\n- **Project Ops (Future):** Vendor coordination, QC\n- **Finance Partner (External):** BNPL underwriting\nThis lean structure supports rapid MVP execution.",
      position: 0,
    },
    {
      id: "a2",
      category: "administrative",
      name: "Operational Rituals",
      type: "text",
      content:
        "# Operational Rituals\n- Weekly sprint planning\n- Sunday 1-hour strategy review\n- Vendor onboarding reviews\n- Monthly financial + performance audit",
      position: 1,
    },
  ],

  people_hr: [
    {
      id: "ph1",
      category: "people_hr",
      name: "Hiring Plan",
      type: "text",
      content:
        "# Hiring Plan (6–12 Months)\n**Phase 1:** (0–3 months)\n- Part-time architect/structural engineer\n\n**Phase 2:** (3–6 months)\n- Full-stack developer\n- Operations coordinator\n\n**Phase 3:** (6–12 months)\n- Vendor acquisition lead\n- Quality supervisor (onsite)",
      position: 0,
    },
    {
      id: "ph2",
      category: "people_hr",
      name: "Culture & Principles",
      type: "text",
      content:
        "# Culture & Principles\n- Build with trust and transparency\n- Prioritize safety and compliance\n- Move fast with clear execution plans\n- Be customer-obsessed\n- Document everything",
      position: 1,
    },
  ],

  gtm: [
    {
      id: "g1",
      category: "gtm",
      name: "Go-to-Market Strategy",
      type: "text",
      content:
        "# Go-to-Market Strategy\n- Launch landing page + LinkedIn ads for NCR\n- Partner with local architects & brokers\n- Offer free AI planning for early adopters\n- Case study from first 1–2 builds\n- NRI outreach via targeted social campaigns",
      position: 0,
    },
    {
      id: "g2",
      category: "gtm",
      name: "Positioning & Messaging",
      type: "text",
      content:
        "# Positioning & Messaging\n**Tagline:** Build Your Home. On Time, Every Time.\n\n**Messaging Pillars:**\n- Predictable timelines\n- Transparent pricing\n- Real-time visibility\n- Quality you can trust\n- Financing made simple",
      position: 1,
    },
  ],

  funding: [
    {
      id: "f1",
      category: "funding",
      name: "Investment Narrative",
      type: "text",
      content:
        "# Investment Narrative\nBrix sits at the intersection of prop-tech, fintech, and construction automation—an underserved $30B+ market in India. The platform standardizes construction workflows using AI and integrates financing to unlock latent demand. With every project, Brix captures high-margin service revenue and data flywheel advantages. Early capital accelerates vendor onboarding, tech automation, and regional scaling.",
      position: 0,
    },
  ],

  tools: [
    {
      id: "t1",
      category: "tools",
      name: "Tool Stack Overview",
      type: "text",
      content:
        "# Tool Stack Overview\n- **Notion:** Documentation + roadmap\n- **Figma:** UI/UX design\n- **VSCode:** Development\n- **OpenAI API:** AI planning engine\n- **Whimsical/Figma:** Architecture diagrams\n- **AWS/Vercel:** Hosting + deployment",
      position: 0,
    },
    {
      id: "t2",
      category: "tools",
      name: "Build vs Buy Decisions",
      type: "text",
      content:
        "# Build vs Buy Decisions\n- **Build:** AI planner, cost estimator, monitoring dashboard, admin panel\n- **Buy:** Payment gateway, SMS/Email, CCTV integrations, financing partners\nThis keeps engineering lean while maximizing value creation.",
      position: 1,
    },
  ],
};

export const categoryLabels: Record<NarrativeCategory, string> = {
  narrative: "Narrative",
  product: "Product",
  engineering: "Engineering",
  administrative: "Administrative",
  people_hr: "People & HR",
  gtm: "GTM",
  funding: "Funding",
  tools: "Tools",
};
