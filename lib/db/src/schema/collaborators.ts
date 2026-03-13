import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const collaboratorsTable = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  entrepreneurId: integer("entrepreneur_id").notNull().references(() => usersTable.id),
  userId: integer("user_id").references(() => usersTable.id),
  email: text("email").notNull(),
  name: text("name"),
  permissions: text("permissions").notNull().default("[]"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
