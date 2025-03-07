import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const technician = pgTable("technician", {
  id: serial("id").primaryKey(),
  discordUserId: varchar("discord_user_id", { length: 255 }).unique().notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
