import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { offersTable } from "./offers";

export const featuredOffersTable = pgTable("featured_offers", {
  id: serial("id").primaryKey(),
  offerId: integer("offer_id").notNull().references(() => offersTable.id),
  motivationalMessage: text("motivational_message"),
  setAt: timestamp("set_at").notNull().defaultNow(),
});
