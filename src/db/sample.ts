import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sample = pgTable("sample", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
