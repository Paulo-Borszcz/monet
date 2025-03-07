import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { operatorType } from "../enums/operatorType";
import { technician } from "./technician";
import { manager } from "./manager";

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
