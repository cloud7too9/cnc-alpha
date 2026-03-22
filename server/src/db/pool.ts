// =============================================================
// Datenbank-Verbindung (Connection Pool)
// =============================================================
// Wir nutzen einen "Pool" statt einer einzelnen Verbindung.
// Ein Pool hält mehrere Verbindungen zur DB offen und verteilt
// Anfragen automatisch — so blockiert eine langsame Query
// nicht alle anderen.
// =============================================================

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "testdb",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Test123",
});

// Verbindung testen beim Start
pool.query("SELECT NOW()")
  .then(() => console.log("✓ Datenbank verbunden"))
  .catch((err) => {
    console.error("✗ Datenbankverbindung fehlgeschlagen:", err.message);
    process.exit(1);
  });

module.exports = pool;
