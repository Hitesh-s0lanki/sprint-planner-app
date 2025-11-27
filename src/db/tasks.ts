import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  primaryKey,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const taskStatus = pgEnum("task_status", [
  "backlog",
  "todo",
  "in_progress",
  "done",
  "cancelled",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),

  key: varchar("key", { length: 50 }).notNull().unique(), // e.g., "SP-12"
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),

  status: taskStatus("task_status").notNull().default("backlog"),
  priority: varchar("priority", { length: 50 }).notNull().default("Medium"),

  // 🔴 these must match users.id (uuid)
  assigneeId: uuid("assignee_id").references(() => users.id),
  reporterId: uuid("reporter_id").references(() => users.id),

  // ⭐ Parent task (nullable) - self-reference
  parentTaskId: uuid("parent_task_id"), // NULL allowed

  dueDate: timestamp("due_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Self-reference foreign key for parentTaskId
export const tasksParentTaskFk = foreignKey({
  columns: [tasks.parentTaskId],
  foreignColumns: [tasks.id],
});

//
// TASK DEPENDENCIES (Preceding / Blocking Tasks)
//
export const taskDependencies = pgTable(
  "task_dependencies",
  {
    taskId: uuid("task_id").notNull(),
    dependsOnTaskId: uuid("depends_on_task_id").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.dependsOnTaskId] }),
    taskFk: foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
    }),
    dependsOnFk: foreignKey({
      columns: [table.dependsOnTaskId],
      foreignColumns: [tasks.id],
    }),
  })
);
