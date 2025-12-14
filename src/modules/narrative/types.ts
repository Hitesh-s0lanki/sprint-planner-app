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
  projectId: string;
  category: NarrativeCategory;
  name: string;
  type: NarrativeSectionType;
  content: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

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

