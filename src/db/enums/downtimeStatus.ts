import { pgEnum } from "drizzle-orm/pg-core";

export const downtimeStatus = pgEnum("downtime_status", ["open", "closed"]);
