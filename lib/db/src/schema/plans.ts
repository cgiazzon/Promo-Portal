import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";

export const plansTable = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: real("price").notNull(),
  maxGroups: integer("max_groups").notNull(),
  maxSchedulesPerMonth: integer("max_schedules_per_month").notNull(),
  maxCollaborators: integer("max_collaborators").notNull(),
  hasAdvancedMetrics: boolean("has_advanced_metrics").notNull().default(false),
  isPopular: boolean("is_popular").notNull().default(false),
});
