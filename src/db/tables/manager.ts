import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const manager = pgTable("manager", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
});
