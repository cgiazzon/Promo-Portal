import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { offersTable } from "./offers";
import { groupsTable } from "./groups";

export const sendHistoryTable = pgTable("send_history", {
  id: serial("id").primaryKey(),
  offerId: integer("offer_id").notNull().references(() => offersTable.id),
  groupId: integer("group_id").notNull().references(() => groupsTable.id),
  entrepreneurId: integer("entrepreneur_id").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  status: text("status").notNull().default("sent"),
  clicks: integer("clicks").notNull().default(0),
  shortUrl: text("short_url"),
});
