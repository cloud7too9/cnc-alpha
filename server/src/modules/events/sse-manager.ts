// =============================================================
// SSE Manager — Server-Sent Events Verwaltung
// =============================================================

const clients: any[] = [];

function connectClient(req: any, res: any) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.write("data: {\"type\":\"connected\"}\n\n");

  clients.push(res);
  console.log(`  SSE-Client verbunden (${clients.length} aktiv)`);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log(`  SSE-Client getrennt (${clients.length} aktiv)`);
  });
}

function broadcast(eventType: string, data: object) {
  const message = JSON.stringify({ type: eventType, ...data });

  clients.forEach((client) => {
    client.write(`data: ${message}\n\n`);
  });

  console.log(`  Broadcast "${eventType}" an ${clients.length} Clients`);
}

module.exports = { connectClient, broadcast };
