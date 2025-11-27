import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";

// Interest level enum
export const interestLevel = pgEnum("interest_level", [
  "high", // 🔥 High Interest
  "warm", // 🙂 Warm
  "exploring", // 🤔 Exploring
]);

// Investor rank/tier enum
export const investorRank = pgEnum("investor_rank", [
  "tier_a_vc", // Tier A VC
  "tier_b_vc", // Tier B VC
  "angel", // Angel
  "micro_gp", // Micro GP
  "syndicate", // Syndicate
  "other", // Other
]);

// Conversations table - represents a thread between an anonymous investor and founder
export const investorConversations = pgTable("investor_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  // Anonymous identifier (e.g., "Investor #7")
  investorNumber: integer("investor_number").notNull(),

  // Investor metadata
  rank: investorRank("rank").notNull().default("other"),
  interestLevel: interestLevel("interest_level").notNull().default("exploring"),

  // Tracking
  isRead: boolean("is_read").notNull().default(false),
  unreadCount: integer("unread_count").notNull().default(0),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
});

// Messages table - individual messages in a conversation
export const investorMessages = pgTable("investor_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => investorConversations.id, { onDelete: "cascade" }),

  // Message content
  body: text("body").notNull(),

  // Sender type
  senderType: varchar("sender_type", { length: 20 })
    .notNull()
    .default("investor"), // "investor" or "founder"

  // Optional tags/metadata (stored as JSON)
  tags: text("tags"), // e.g., "Concern: Moat", "Asking: Market Size"

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
