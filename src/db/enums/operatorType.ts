import { pgEnum } from "drizzle-orm/pg-core";

export const operatorType = pgEnum("operator_type", ["ALT", "ACT"]);
