import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roles = pgEnum("role", ["individual", "investor", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  role: roles("role").notNull().default("individual"),
  description: text("description").notNull().default(""),
  profession: text("profession").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
