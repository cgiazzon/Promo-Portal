import { pgTable, serial, text, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketplacesTable = pgTable("marketplaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  affiliateCode: text("affiliate_code"),
  commissionPercent: real("commission_percent").notNull(),
  color: text("color").notNull(),
  secondaryColor: text("secondary_color"),
  logoUrl: text("logo_url"),
});

export const insertMarketplaceSchema = createInsertSchema(marketplacesTable).omit({ id: true });
export type InsertMarketplace = z.infer<typeof insertMarketplaceSchema>;
export type Marketplace = typeof marketplacesTable.$inferSelect;
