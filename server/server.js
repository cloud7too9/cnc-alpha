// =============================================================
// CNC-Werkstatt Alpha — Server
// =============================================================
//
// REST-API für Aufträge + Vorgänge (Ablaufkette)
// SSE-Endpunkt für Live-Updates
//
// Starten mit: node server.js
// =============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const auftraegeRoutes = require("./routes/auftraege");
const { connectClient } = require("./sse/manager");

const app = express();
const PORT = process.env.PORT || 3001;

// ----- MIDDLEWARE -----
app.use(cors());
app.use(express.json());

// ----- API-ROUTEN -----
// Aufträge + Vorgänge laufen über denselben Router:
//   /api/auftraege/...
//   /api/auftraege/:auftragId/vorgaenge/:id/...
app.use("/api/auftraege", auftraegeRoutes);

// ----- SSE-ENDPUNKT -----
app.get("/api/events", connectClient);

// ----- FRONTEND (nach Build) -----
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// ----- SERVER STARTEN -----
app.listen(PORT, () => {
  console.log("");
  console.log("  ┌─────────────────────────────────────────┐");
  console.log("  │   CNC-Werkstatt Alpha — Server läuft    │");
  console.log(`  │   http://localhost:${PORT}                  │`);
  console.log("  │                                         │");
  console.log("  │   API:    /api/auftraege                │");
  console.log("  │   SSE:    /api/events                   │");
  console.log("  └─────────────────────────────────────────┘");
  console.log("");
});
