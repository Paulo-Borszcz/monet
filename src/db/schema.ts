import { pgTable, serial, text, timestamp, integer, varchar, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const operatorType = pgEnum("operator_type", ["ALT", "ACT"]);
export const ipType = pgEnum("ip_type", ["switch", "ata"]);
export const downtimeStatus = pgEnum("downtime_status", ["open", "closed"]);

// Tabelas
export const manager = pgTable("manager", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
});

export const technician = pgTable("technician", {
  id: serial("id").primaryKey(),
  discordUserId: varchar("discord_user_id", { length: 255 }).unique().notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const technicianRange = pgTable("technician_range", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").references(() => technician.id),
  startRange: integer("start_range").notNull(),
  endRange: integer("end_range").notNull(),
});

export const branch = pgTable("branch", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  branchNumber: integer("branch_number").unique().notNull(),
  switchIp: varchar("switch_ip", { length: 15 }).unique().notNull(),
  ataIp: varchar("ata_ip", { length: 15 }).unique().notNull(),
  operator: operatorType("operator").notNull(),
  managerId: integer("manager_id").references(() => manager.id),
  technicianId: integer("technician_id").references(() => technician.id),
});

export const downtime = pgTable("downtime", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id),
  ipType: ipType("ip_type").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  status: downtimeStatus("status").default("open"),
});
