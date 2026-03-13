import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { marketplacesTable } from "./marketplaces";

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  originalPrice: real("original_price").notNull(),
  finalPrice: real("final_price").notNull(),
  discountPercent: real("discount_percent").notNull(),
  couponCode: text("coupon_code"),
  category: text("category"),
  imageUrl: text("image_url"),
  productUrl: text("product_url"),
  marketplaceId: integer("marketplace_id").notNull().references(() => marketplacesTable.id),
  status: text("status").notNull().default("active"),
  expiresAt: timestamp("expires_at"),
  sendCount: integer("send_count").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offersTable).omit({ id: true, createdAt: true, sendCount: true, clickCount: true });
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offersTable.$inferSelect;
