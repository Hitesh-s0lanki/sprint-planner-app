import { pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ideaState = pgTable("idea_state", {
  sessionId: varchar("session_id", { length: 128 }).primaryKey(),

  data: jsonb("data")
    .notNull()
    .default(sql`'{}'::jsonb`),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
