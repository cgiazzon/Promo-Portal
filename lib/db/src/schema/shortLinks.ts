import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { marketplacesTable } from "./marketplaces";

export const shortLinksTable = pgTable("short_links", {
  id: serial("id").primaryKey(),
  entrepreneurId: integer("entrepreneur_id").notNull().references(() => usersTable.id),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  marketplaceId: integer("marketplace_id").references(() => marketplacesTable.id),
  clicks: integer("clicks").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ShortLink = typeof shortLinksTable.$inferSelect;
export type InsertShortLink = typeof shortLinksTable.$inferInsert;
