import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const commentRole = pgEnum("comment_role", ["ai", "user"]);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  role: commentRole("role").notNull().default("user"),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  // 🔴 must be uuid to match users.id
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
