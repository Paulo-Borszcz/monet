import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { ipType } from "../enums/ipType";
import { downtimeStatus } from "../enums/downtimeStatus";
import { branch } from "./branch";

export const downtime = pgTable("downtime", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id),
  ipType: ipType("ip_type").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  status: downtimeStatus("status").default("open"),
});
