import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("medium"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  sentiment: text("sentiment").default("neutral"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  userName: true,
  userEmail: true,
  category: true,
  priority: true,
  message: true,
}).extend({
  userEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export const FEEDBACK_CATEGORIES = [
  "bug-report",
  "feature-request", 
  "ui-ux",
  "performance",
  "general",
  "other"
] as const;

export const FEEDBACK_PRIORITIES = [
  "low",
  "medium", 
  "high"
] as const;

export const FEEDBACK_STATUSES = [
  "new",
  "reviewed",
  "in-progress",
  "resolved"
] as const;

export const SENTIMENT_TYPES = [
  "positive",
  "neutral",
  "negative"
] as const;
