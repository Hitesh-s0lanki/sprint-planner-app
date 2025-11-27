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
      content: `# Executive Summary

SprintPlanner is a **4-week venture execution system** that turns fuzzy ideas into structured, shippable projects.

- Target users: founders, PMs, tech leads
- Core value: connect *narrative → board → execution*
- Time horizon: intense 4-week sprints with clear outcomes`,
      position: 0,
    },
    {
      id: "n2",
      category: "narrative",
      name: "Press Release (PR-Style)",
      type: "text",
      content: `# Press Release — SprintPlanner Launch

**FOR IMMEDIATE RELEASE**

SprintPlanner today announced the launch of its **4-week venture execution platform**, helping founders and teams go from idea to shipped MVP with clarity and speed.

> “Most tools track tasks. SprintPlanner tracks *narratives*,” said the founding team.

Key highlights:
- Narrative-first planning
- Kanban board, list, and timeline views
- Investor- and stakeholder-ready documentation out of the box.`,
      position: 1,
    },
    {
      id: "n3",
      category: "narrative",
      name: "Customer FAQ (Working Backwards FAQ)",
      type: "text",
      content: `# Customer FAQ

## Q: Who is SprintPlanner for?
Founders, PMs, and tech leaders running **4–6 week product cycles**.

## Q: What problem does it solve?
It removes the gap between *strategic docs* and *execution boards*, so teams don't lose context once "work starts".

## Q: How is this different from Jira / Linear / Notion?
- Jira/Linear: great for tickets, less opinionated about narrative.
- Notion: great for docs, weak on structured execution.
- **SprintPlanner**: binds narrative, board, and metrics into one 4-week system.`,
      position: 2,
    },
    {
      id: "n4",
      category: "narrative",
      name: "Problem Statement",
      type: "text",
      content: `# Problem Statement

Teams struggle to **turn ideas into focused 4-week execution plans**.

## The Core Issues

- Strategy and execution are split across tools
- No single source of truth for “what are we doing this sprint and why?”
- Investor or stakeholder narratives are written *after* execution, not before

## Why It Matters

This leads to:
- Misaligned expectations
- Scope creep
- Wasted engineering capacity`,
      position: 3,
    },
    {
      id: "n5",
      category: "narrative",
      name: "Solution Overview",
      type: "text",
      content: `# Solution Overview

SprintPlanner is a **narrative-first sprint OS**.

## Core Concepts

1. **Narrative Sections** — Problem, Solution, Metrics, Risks, etc.
2. **Execution Board** — List, Board, Timeline views mapped to that narrative.
3. **Investor-Ready Story** — Always up-to-date docs for review.

## Impact

- Faster alignment across product, eng, and founders
- Clear “definition of done” for each 4-week sprint
- Easy storytelling for updates, funding, and reviews`,
      position: 4,
    },
    {
      id: "n6",
      category: "narrative",
      name: "Success Metrics & Goals",
      type: "text",
      content: `# Success Metrics & Key Goals

We focus on **input metrics**, not vanity outputs.

## Example 4-week goals

- 80% of tasks linked to a narrative section
- < 10% tasks without clear owner
- Weekly narrative update sent to stakeholders

## North Star

> % of teams that complete a full 4-week sprint with clear narrative → board → review cycle.`,
      position: 5,
    },
    {
      id: "n7",
      category: "narrative",
      name: "Implementation Plan",
      type: "text",
      content: `# Implementation Plan

1. MVP:
   - Narrative editor
   - Board + list + timeline views
   - Basic investor/social narrative export

2. v1:
   - Templates for founders / agencies
   - Collaborator roles and permissions
   - Simple progress analytics

3. v2:
   - AI-assisted narrative creation
   - Automated weekly investor updates
   - Deeper integrations (GitHub, Linear, Slack)`,
      position: 6,
    },
  ],

  product: [
    {
      id: "p1",
      category: "product",
      name: "Product Vision",
      type: "text",
      content: `# Product Vision

To become the **default 4-week venture execution tool** for founders and small product teams.

## Mission

Help teams:
- Start with narrative
- Plan with clarity
- Execute with focus
- Communicate with confidence.`,
      position: 0,
    },
    {
      id: "p2",
      category: "product",
      name: "User Personas",
      type: "text",
      content: `# User Personas

## Primary: Founder / Solo Builder

- Needs: Clarity on what to build in 4 weeks
- Pain: Overwhelm, scattered notes, no clear plan

## Secondary: Product Manager / Startup PM

- Needs: Narrative plus execution in one place
- Pain: Context loss between docs and tickets`,
      position: 1,
    },
    {
      id: "p3",
      category: "product",
      name: "Customer Problems & Insights",
      type: "text",
      content: `# Customer Problems & Insights

From early interviews:

- “Notion is where I think, Jira is where I execute — they never stay in sync.”
- “I write a pitch once, then the board drifts away from it.”
- “Investors ask for updates and I have to manually reconstruct the story.”`,
      position: 2,
    },
    {
      id: "p4",
      category: "product",
      name: "Feature Breakdown (MVP)",
      type: "text",
      content: `# Feature Breakdown — MVP

1. Narrative sections with markdown support
2. Board/List/Timeline views for tasks
3. Per-project navigation: Dashboard, Narrative, Sources, Social
4. Simple investor/social export from narrative`,
      position: 3,
    },
    {
      id: "p5",
      category: "product",
      name: "Success Criteria",
      type: "text",
      content: `# Success Criteria

For the first 10 active teams:

- Complete at least one 4-week narrative
- Create > 30 tasks tied to that narrative
- Use narrative export at least once for an update or pitch.`,
      position: 4,
    },
  ],

  engineering: [
    {
      id: "e1",
      category: "engineering",
      name: "Tech Stack",
      type: "text",
      content: `# Tech Stack

## Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ShadCN UI

## Backend
- tRPC
- Drizzle ORM
- PostgreSQL (Neon)

## Infra
- Vercel for frontend
- Serverless Postgres
- Clerk for auth`,
      position: 0,
    },
    {
      id: "e2",
      category: "engineering",
      name: "System Architecture",
      type: "text",
      content: `# System Architecture

- **App Layer**: Next.js app with app router
- **API Layer**: tRPC routers (projects, narrative, board, sources, social)
- **Data Layer**: Drizzle models for projects, narrative_sections, tasks, comments

Key principles:
- Keep narrative + tasks strongly linked
- Prefer simple, explicit data models over premature microservices.`,
      position: 1,
    },
    {
      id: "e3",
      category: "engineering",
      name: "Architecture Diagram",
      type: "files",
      content: "",
      position: 2,
    },
    {
      id: "e4",
      category: "engineering",
      name: "Testing & Quality",
      type: "text",
      content: `# Testing & Quality

- Unit tests for core hooks and components
- Integration tests for key flows (create project → add narrative → add tasks)
- Visual QA for board + timeline interactions`,
      position: 3,
    },
  ],

  administrative: [
    {
      id: "a1",
      category: "administrative",
      name: "Company Structure",
      type: "text",
      content: `# Company Structure

## Core Roles

- Product & UX
- Engineering
- Growth / GTM
- Ops & Finance

The structure should stay **lean and flexible** for rapid iteration.`,
      position: 0,
    },
    {
      id: "a2",
      category: "administrative",
      name: "Operational Rituals",
      type: "text",
      content: `# Operational Rituals

- Weekly build review
- Bi-weekly user feedback calls
- Monthly product narrative review`,
      position: 1,
    },
  ],

  people_hr: [
    {
      id: "h1",
      category: "people_hr",
      name: "Hiring Plan",
      type: "text",
      content: `# Hiring Plan

## Next 6–12 Months

- Founding Engineer (Full-stack)
- Product Designer
- Growth Generalist

Focus on **builders** who are comfortable with ambiguity and fast sprints.`,
      position: 0,
    },
    {
      id: "h2",
      category: "people_hr",
      name: "Culture & Principles",
      type: "text",
      content: `# Culture & Principles

- Narrative before roadmap
- Bias for shipping
- Clear ownership
- Honest retrospectives`,
      position: 1,
    },
  ],

  gtm: [
    {
      id: "g1",
      category: "gtm",
      name: "Go-to-Market Strategy",
      type: "text",
      content: `# Go-to-Market Strategy

## Target Users

- Solo founders
- Tiny startup teams (2–10)
- Indie hackers & studios

## Channels

- Product Hunt launch
- Twitter / LinkedIn founder content
- Partnerships with accelerators`,
      position: 0,
    },
    {
      id: "g2",
      category: "gtm",
      name: "Positioning & Messaging",
      type: "text",
      content: `# Positioning & Messaging

> “SprintPlanner — Turn your ideas into executable 4-week ventures.”

Messaging pillars:
- Narrative-first
- Execution-focused
- Investor-ready`,
      position: 1,
    },
  ],

  funding: [
    {
      id: "f1",
      category: "funding",
      name: "Financial Model (Spreadsheet)",
      type: "files",
      content: "",
      position: 0,
    },
    {
      id: "f2",
      category: "funding",
      name: "Investment Narrative",
      type: "text",
      content: `# Investment Narrative

SprintPlanner sits at the intersection of:
- Project management
- Venture building
- Founder tooling

The wedge: **4-week narrative-driven execution**, expanding into a broader founder OS.`,
      position: 1,
    },
  ],

  tools: [
    {
      id: "t1",
      category: "tools",
      name: "Tool Stack Overview",
      type: "text",
      content: `# Tool Stack Overview

## Dev & Ops
- GitHub
- Vercel
- Neon / Postgres
- Linear (for internal dogfooding or meta work)

## Collaboration
- Slack
- Notion (for non-product docs)
- Figma (for design)`,
      position: 0,
    },
    {
      id: "t2",
      category: "tools",
      name: "Build vs Buy Decisions",
      type: "text",
      content: `# Build vs Buy Decisions

We will **buy** where:
- Commodity infra (auth, emails, hosting)
- Not core to differentiation

We will **build** where:
- Narrative ↔ board experience
- 4-week execution workflows
- Investor/social narrative exports`,
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
