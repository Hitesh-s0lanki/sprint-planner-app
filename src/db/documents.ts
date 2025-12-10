import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projects } from "./projects";

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),

  // OPTIONAL project reference
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),

  // OPTIONAL session identifier (chat / agent session)
  sessionId: varchar("session_id", { length: 128 }),

  // Title shown in sidebar + editor header
  title: varchar("title", { length: 255 }).notNull().default("Untitled"),

  // Small icon/emoji shown next to title
  icon: varchar("icon", { length: 16 }),

  // BlockNote JSON document
  content: jsonb("content")
    .notNull()
    .default(sql`'[]'::jsonb`),

  // Who added the document: user or AI
  addedBy: varchar("added_by", { length: 16 }).notNull().default("user"), // allowed values: 'user' | 'ai'

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  // For future “Trash” feature
  isTrashed: boolean("is_trashed").notNull().default(false),
  trashedAt: timestamp("trashed_at", { withTimezone: true }),
});
