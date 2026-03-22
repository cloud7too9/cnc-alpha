// =============================================================
// SSE Manager — Server-Sent Events Verwaltung
// =============================================================
//
// WAS IST DAS?
// Dieses Modul verwaltet alle SSE-Verbindungen. Wenn ein Browser
// sich verbindet, wird er in eine Liste aufgenommen. Wenn sich
// ein Auftragsstatus ändert, schicken wir eine Nachricht an
// ALLE verbundenen Browser gleichzeitig.
//
// WIE FUNKTIONIERT SSE?
// 1. Der Browser öffnet eine spezielle HTTP-Verbindung die
//    offen bleibt (statt sofort eine Antwort zu bekommen)
// 2. Der Server kann jederzeit Daten "reinschreiben"
// 3. Der Browser empfängt diese als Events
// 4. Format: "data: {json}\n\n" (zwei Zeilenumbrüche = Ende)
//
// WARUM NICHT WEBSOCKET?
// SSE reicht für unseren Fall: Der Server schickt Updates an
// die Büro-Browser. Die Werker senden ihre Änderungen per
// normaler REST-API (POST-Request). Wir brauchen keine
// bidirektionale Verbindung.
// =============================================================

// Liste aller aktiven SSE-Verbindungen
// Jeder Eintrag ist ein Express-Response-Objekt das offen bleibt
const clients = [];

/**
 * Verbindet einen neuen SSE-Client.
 * Wird als Express-Route-Handler verwendet: GET /api/events
 */
function connectClient(req, res) {
  // SSE-Header setzen — das sagt dem Browser:
  // "Diese Verbindung bleibt offen, es kommen Text-Events"
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // SSE-Format
    "Cache-Control": "no-cache",          // Nicht cachen!
    "Connection": "keep-alive",           // Verbindung offen halten
    "Access-Control-Allow-Origin": "*",   // CORS erlauben
  });

  // Sofort ein Herzschlag-Event senden damit der Browser weiß
  // dass die Verbindung steht
  res.write("data: {\"type\":\"connected\"}\n\n");

  // Client in die Liste aufnehmen
  clients.push(res);
  console.log(`  ↳ SSE-Client verbunden (${clients.length} aktiv)`);

  // Wenn der Browser die Verbindung schließt (Tab zu, Seite verlassen),
  // entfernen wir ihn aus der Liste
  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log(`  ↳ SSE-Client getrennt (${clients.length} aktiv)`);
  });
}

/**
 * Sendet ein Event an ALLE verbundenen Clients.
 * @param {string} eventType - z.B. "status_change" oder "new_order"
 * @param {object} data - Die Daten die gesendet werden
 */
function broadcast(eventType, data) {
  const message = JSON.stringify({ type: eventType, ...data });

  clients.forEach((client) => {
    // SSE-Format: "data: ...\n\n"
    client.write(`data: ${message}\n\n`);
  });

  console.log(`  📡 Broadcast "${eventType}" an ${clients.length} Clients`);
}

module.exports = { connectClient, broadcast };
