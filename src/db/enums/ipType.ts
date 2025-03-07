import { pgEnum } from "drizzle-orm/pg-core";

export const ipType = pgEnum("ip_type", ["switch", "ata"]);
