import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { technician } from "./technician";

export const technicianRange = pgTable("technician_range", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").references(() => technician.id),
  startRange: integer("start_range").notNull(),
  endRange: integer("end_range").notNull(),
});
