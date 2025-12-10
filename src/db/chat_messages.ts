import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const chatMessages = pgTable(
  "chat_messages",
  {
    chatId: uuid("chat_id").primaryKey(),

    sessionId: varchar("session_id", { length: 128 }).notNull(),

    userId: varchar("user_id", { length: 128 }),

    role: varchar("role", { length: 32 }).notNull(), // user | assistant | system

    formattedOutput: text("formatted_output"),

    content: text("content").notNull(),

    metadata: jsonb("metadata")
      .notNull()
      .default(sql`'{}'::jsonb`),

    stage: integer("stage").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // ✅ CHECK constraint: stage between 1 and 9
    stageRangeCheck: sql`
        CHECK (${table.stage} >= 1 AND ${table.stage} <= 9)
      `,
  })
);
