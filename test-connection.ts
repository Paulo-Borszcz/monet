import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log("Conexão bem-sucedida:", result);
  } catch (error) {
    console.error("Erro na conexão:", error);
  } finally {
    await sql.end();
  }
}

testConnection();
