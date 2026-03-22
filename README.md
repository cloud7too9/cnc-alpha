# CNC-Werkstatt Alpha

Werkstatt-Management-Software für CNC-Metallbearbeitung.
**Alpha-Version:** Aufträge erstellen (Büro) + Status ändern (Werker) + Live-Updates per SSE.

---

## Was kann die Alpha?

| Funktion | Wer | Wie |
|---|---|---|
| Aufträge erstellen | Büro | Formular auf der Büro-Seite |
| Alle Aufträge sehen | Büro | Tabelle mit Live-Status |
| Status weitersetzen | Werker | Touch-Buttons auf der Werker-Seite |
| Live-Updates | Alle | SSE — Änderungen erscheinen sofort überall |

Status-Ablauf: **Offen** → **In Bearbeitung** → **Fertig**

---

## Projektstruktur

```
cnc-alpha/
├── server/                  ← Backend (Node.js + Express)
│   ├── server.js            ← Einstiegspunkt, startet Express
│   ├── package.json
│   ├── .env.example         ← Vorlage für Umgebungsvariablen
│   ├── db/
│   │   ├── schema.sql       ← Datenbank-Schema + Testdaten
│   │   └── pool.js          ← PostgreSQL Connection Pool
│   ├── routes/
│   │   └── auftraege.js     ← API-Endpunkte (GET, POST, PATCH)
│   └── sse/
│       └── manager.js       ← SSE-Verbindungsverwaltung + Broadcast
│
├── client/                  ← Frontend (React)
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js         ← React-Einstiegspunkt
│       ├── App.js           ← Router + Navigation
│       ├── api.js           ← Alle API-Aufrufe zentral
│       ├── hooks/
│       │   └── useSSE.js    ← Custom Hook für SSE-Verbindung
│       ├── components/
│       │   └── StatusBadge.js
│       ├── pages/
│       │   ├── BueroSeite.js   ← Auftragsübersicht + Erstellen
│       │   └── WerkerSeite.js  ← Status-Updates
│       └── styles/
│           └── global.css   ← Design-System (Farben, Badges, etc.)
│
├── .gitignore
└── README.md
```

---

## Setup-Anleitung (Schritt für Schritt)

### Voraussetzungen

Du brauchst diese Programme installiert:
- **Node.js** (v18+) — https://nodejs.org
- **PostgreSQL** (v14+) — https://www.postgresql.org/download/

### 1. Datenbank einrichten

```bash
# PostgreSQL-Shell öffnen
psql -U postgres

# Datenbank erstellen
CREATE DATABASE cnc_werkstatt;

# Shell verlassen
\q

# Schema + Testdaten laden
psql -U postgres -d cnc_werkstatt -f server/db/schema.sql
```

### 2. Server starten

```bash
cd server

# .env-Datei erstellen (Vorlage kopieren und Passwort anpassen)
cp .env.example .env
# → .env öffnen und DB_PASSWORD auf dein PostgreSQL-Passwort setzen

# Abhängigkeiten installieren
npm install

# Server starten (Entwicklungsmodus mit Auto-Reload)
npm run dev
```

Du solltest sehen:
```
  ┌─────────────────────────────────────────┐
  │   CNC-Werkstatt Alpha — Server läuft    │
  │   http://localhost:3001                  │
  └─────────────────────────────────────────┘
  ✓ Datenbank verbunden
```

### 3. Frontend starten

```bash
# Neues Terminal öffnen!
cd client

# Abhängigkeiten installieren
npm install

# React-Entwicklungsserver starten
npm start
```

Browser öffnet sich automatisch auf `http://localhost:3000`.

### 4. Testen

1. Öffne `http://localhost:3000` — du siehst die **Büro-Ansicht**
2. Öffne einen zweiten Tab mit `http://localhost:3000/werker` — die **Werker-Ansicht**
3. Klick in der Werker-Ansicht auf "→ In Bearbeitung"
4. Schau zurück zum Büro-Tab — **der Status hat sich live geändert!**

---

## Wie funktioniert SSE? (Kurzversion)

```
         ┌──────────┐                    ┌──────────┐
         │  Werker   │                    │   Büro   │
         │  (Handy)  │                    │ (Browser)│
         └────┬─────┘                    └────┬─────┘
              │                                │
              │  PATCH /api/auftraege/5/status  │  GET /api/events (bleibt offen)
              │  { "status": "In Bearbeitung" } │  ← SSE-Verbindung steht
              ▼                                │
         ┌──────────┐                          │
         │  Server   │──── broadcast ──────────▶ data: {"type":"status_change",...}
         │ (Node.js) │                          │
         └────┬─────┘                          │
              │                                ▼
         ┌──────────┐                    Tabelle aktualisiert
         │PostgreSQL │                    sich sofort ✓
         └──────────┘
```

1. Der Werker sendet einen normalen REST-Request (PATCH)
2. Der Server speichert in PostgreSQL
3. Der Server schickt per SSE eine Nachricht an alle offenen Verbindungen
4. Der Büro-Browser empfängt das Event und aktualisiert die Tabelle

**Kein Polling, kein manuelles Neuladen, keine Extra-Bibliothek im Browser.**

---

## API-Endpunkte

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/auftraege` | Alle Aufträge abrufen |
| `POST` | `/api/auftraege` | Neuen Auftrag erstellen |
| `PATCH` | `/api/auftraege/:id/status` | Status eines Auftrags ändern |
| `GET` | `/api/events` | SSE-Stream für Live-Updates |

### Beispiel: Auftrag erstellen
```json
POST /api/auftraege
{
  "auftragsnr": "2024-0153",
  "kunde": "Neuer Kunde GmbH",
  "beschreibung": "Welle Ø50×300"
}
```

### Beispiel: Status ändern
```json
PATCH /api/auftraege/5/status
{
  "status": "In Bearbeitung"
}
```

---

## Nächste Schritte (nach der Alpha)

- [ ] Authentifizierung (Büro vs. Werker Login)
- [ ] Materialerfassung anbinden
- [ ] Zeichnungen hochladen
- [ ] Mobile PWA für die Werkstatt
- [ ] Deployment auf Hetzner
