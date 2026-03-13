import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const walletsTable = pgTable("wallets", {
  id: serial("id").primaryKey(),
  entrepreneurId: integer("entrepreneur_id").notNull().references(() => usersTable.id).unique(),
  availableBalance: real("available_balance").notNull().default(0),
  pendingBalance: real("pending_balance").notNull().default(0),
  totalWithdrawn: real("total_withdrawn").notNull().default(0),
  pixKeyType: text("pix_key_type"),
  pixKey: text("pix_key"),
});

export const commissionsTable = pgTable("commissions", {
  id: serial("id").primaryKey(),
  entrepreneurId: integer("entrepreneur_id").notNull().references(() => usersTable.id),
  saleAmount: real("sale_amount").notNull(),
  commissionPercent: real("commission_percent").notNull(),
  commissionAmount: real("commission_amount").notNull(),
  marketplaceName: text("marketplace_name"),
  offerTitle: text("offer_title"),
  groupName: text("group_name"),
  status: text("status").notNull().default("pending"),
  saleDate: timestamp("sale_date").notNull(),
  releaseDate: timestamp("release_date").notNull(),
});

export const withdrawalsTable = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  entrepreneurId: integer("entrepreneur_id").notNull().references(() => usersTable.id),
  amount: real("amount").notNull(),
  pixKey: text("pix_key").notNull(),
  pixKeyType: text("pix_key_type"),
  status: text("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const walletTransactionsTable = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => walletsTable.id),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
