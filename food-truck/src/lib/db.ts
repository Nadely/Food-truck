import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "mysql-teamseniornad.alwaysdata.net",
  user: process.env.DB_USER || "449602",
  password: process.env.DB_PASSWORD || "Enola2908@",
  database: process.env.DB_NAME || "teamseniornad_foodtruck_db",
};

let pool: mysql.Pool | null = null;

export async function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}
