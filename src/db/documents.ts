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

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  // Title shown in sidebar + editor header
  title: varchar("title", { length: 255 }).notNull().default("Untitled"),

  // Small icon/emoji shown next to title
  icon: varchar("icon", { length: 16 }),

  // BlockNote JSON document
  content: jsonb("content")
    // .$type<BlockNoteContent>() // uncomment + replace when you have the type
    .notNull()
    .default(sql`'[]'::jsonb`),

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
