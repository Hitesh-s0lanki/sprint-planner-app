import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const narrativeSectionCategory = pgEnum("narrative_section_category", [
  "narrative",
  "product",
  "engineering",
  "administrative",
  "people_hr",
  "gtm",
  "funding",
  "tools",
]);

export const narrativeSectionType = pgEnum("narrative_section_type", [
  "text",
  "files",
]);

export const narrativeSections = pgTable("narrative_sections", {
  id: uuid("id").defaultRandom().primaryKey(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  // narrative | product | engineering | ...
  category: narrativeSectionCategory("category").notNull(),

  // e.g. "Problem Statement", "User Persona", "Tech Architecture"
  name: varchar("name", { length: 200 }).notNull(),

  // text | files (map to "Text" | "Files" in TS)
  type: narrativeSectionType("type").notNull().default("text"),

  // For type = "text". For type = "files" you can keep this empty or use as notes.
  content: text("content").notNull().default(""),

  // For ordering inside each category
  position: integer("position").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const narrativeSectionFiles = pgTable("narrative_section_files", {
  id: uuid("id").defaultRandom().primaryKey(),

  sectionId: uuid("section_id")
    .notNull()
    .references(() => narrativeSections.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),

  // optional extras for future:
  // mimeType: varchar("mime_type", { length: 100 }),
  // sizeBytes: integer("size_bytes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
