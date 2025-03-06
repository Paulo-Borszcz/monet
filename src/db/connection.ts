import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_X0YaHAwWo4kV@ep-late-shadow-a5xnd66w-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require";

const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  idle_timeout: 20,
  connection: {
    timeout: 5000,
  },
});

(async () => {
  try {
    const result = await client`SELECT 1 AS result`;
    console.log("✅ Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
})();

export const db = drizzle(client, { schema });
