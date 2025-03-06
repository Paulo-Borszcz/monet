import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://";

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
