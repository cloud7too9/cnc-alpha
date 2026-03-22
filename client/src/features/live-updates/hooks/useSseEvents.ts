// =============================================================
// useSSE — Custom React Hook für Server-Sent Events
// =============================================================
//
// WAS MACHT DIESER HOOK?
// Er stellt eine SSE-Verbindung zum Server her und gibt dir
// einen Callback jedes Mal wenn ein Event reinkommt.
// Der Hook kümmert sich automatisch um:
// - Verbindung aufbauen beim Mounten der Komponente
// - Verbindung schließen beim Unmounten
// - Reconnect wenn die Verbindung abbricht
//
// VERWENDUNG:
//   useSSE("http://localhost:3001/api/events", (event) => {
//     if (event.type === "status_change") {
//       // Auftragsliste aktualisieren
//     }
//   });
//
// =============================================================

import { useEffect, useRef, useState } from "react";

export default function useSSE(url: string, onMessage: (data: any) => void) {
  const [connected, setConnected] = useState(false);
  // useRef speichert den Callback ohne dass der Effect
  // bei jeder Änderung neu startet
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    console.log("[SSE] Verbinde mit", url);

    // EventSource ist eine eingebaute Browser-API für SSE
    // — keine Bibliothek nötig!
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log("[SSE] ✓ Verbunden");
      setConnected(true);
    };

    // Jede Nachricht vom Server landet hier
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // "connected"-Heartbeat ignorieren wir hier
        if (data.type !== "connected") {
          onMessageRef.current(data);
        }
      } catch (err) {
        console.error("[SSE] Fehler beim Parsen:", err);
      }
    };

    eventSource.onerror = () => {
      console.log("[SSE] ✗ Verbindung verloren — Browser reconnected automatisch");
      setConnected(false);
      // EventSource reconnected automatisch!
      // Das ist einer der großen Vorteile gegenüber WebSocket.
    };

    // Cleanup: Verbindung schließen wenn die Komponente unmountet
    return () => {
      console.log("[SSE] Verbindung geschlossen");
      eventSource.close();
      setConnected(false);
    };
  }, [url]); // Nur neu verbinden wenn sich die URL ändert

  return { connected };
}
