cnc-alpha/
├── docs/                                                     ← Randnotiz: Enthält Architektur-, API-, Prozess- und Migrationsdokumentation.
│   ├── architecture.md                                       ← Aufgabe: Beschreibt die Gesamtarchitektur von Client, Server, Shared und Datenfluss.
│   ├── domain-model.md                                       ← Aufgabe: Definiert die fachlichen Kernobjekte wie Order, WorkStep, HistoryEntry und UserRole.
│   ├── api-contract.md                                       ← Aufgabe: Dokumentiert alle Endpunkte, Request-/Response-Formate und Fehlerobjekte.
│   ├── status-flow.md                                        ← Aufgabe: Beschreibt die erlaubten Statuswechsel und die Geschäftsregeln dahinter.
│   ├── coding-standards.md                                   ← Aufgabe: Legt Benennung, Dateirollen, TypeScript-Regeln und Strukturstandards fest.
│   └── migration-checklist.md                                ← Aufgabe: Hält fest, welche Altdatei wohin migriert oder gelöscht wird.

├── shared/                                                   ← Randnotiz: Beinhaltet gemeinsam genutzte Typen, Konstanten, Schemas und Hilfsfunktionen.
│   ├── types/                                                ← Randnotiz: Enthält die zentrale Typdefinition als einzige Wahrheit für Client und Server.
│   │   ├── order.ts                                          ← Aufgabe: Definiert Order, CreateOrderInput, UpdateOrderInput und zugehörige View-Modelle.
│   │   ├── history.ts                                        ← Aufgabe: Definiert die Struktur einzelner Historieneinträge und Änderungsarten.
│   │   ├── events.ts                                         ← Aufgabe: Definiert die einheitlichen SSE-Eventtypen und Event-Payloads.
│   │   ├── auth.ts                                           ← Aufgabe: Definiert User, Session, LoginState und Rollen.
│   │   └── api.ts                                            ← Aufgabe: Definiert gemeinsame API-Erfolgs- und Fehlerantworten.
│   ├── constants/                                            ← Randnotiz: Enthält feste Werte, die projektweit identisch benutzt werden.
│   │   ├── order-status.ts                                   ← Aufgabe: Enthält alle erlaubten Auftragsstatus in fester Reihenfolge.
│   │   ├── work-steps.ts                                     ← Aufgabe: Enthält alle erlaubten Arbeitsschritte und ihre Anzeigenamen.
│   │   ├── user-roles.ts                                     ← Aufgabe: Enthält die Rollen wie office, worker und admin.
│   │   └── event-types.ts                                    ← Aufgabe: Enthält die festen Namen aller SSE-Events.
│   ├── schemas/                                              ← Randnotiz: Enthält Validierungsschemas für sichere Requests und Datenobjekte.
│   │   ├── order.schema.ts                                   ← Aufgabe: Validiert neue und aktualisierte Aufträge.
│   │   ├── status.schema.ts                                  ← Aufgabe: Validiert Statuswechsel und deren Übergangsregeln.
│   │   └── auth.schema.ts                                    ← Aufgabe: Validiert Login- und Sessiondaten.
│   └── utils/                                                ← Randnotiz: Enthält neutrale Hilfsfunktionen ohne UI- oder DB-Abhängigkeit.
│       ├── date.ts                                           ← Aufgabe: Kapselt Datumsformatierung und Datumsvergleiche.
│       ├── text.ts                                           ← Aufgabe: Kapselt String-Helfer wie Label-Umwandlungen und Fallbacks.
│       └── ids.ts                                            ← Aufgabe: Kapselt die Erzeugung und Prüfung technischer IDs.

├── server/                                                   ← Randnotiz: Enthält die typisierte Backend-Anwendung mit API, DB und Eventlogik.
│   ├── package.json                                          ← Aufgabe: Definiert Backend-Abhängigkeiten und Skripte für Dev, Build und Start.
│   ├── tsconfig.json                                         ← Aufgabe: Konfiguriert die TypeScript-Kompilierung für den Server.
│   ├── .env.example                                          ← Aufgabe: Zeigt alle nötigen Umgebungsvariablen für lokale Entwicklung und Deployment.
│   └── src/                                                  ← Randnotiz: Enthält den gesamten produktiven Servercode ohne Altdateien.
│       ├── index.ts                                          ← Aufgabe: Startet den Serverprozess und bootet die Express-Anwendung.
│       ├── app/                                              ← Randnotiz: Baut die App zusammen und registriert globale Middleware und Routen.
│       │   ├── create-app.ts                                 ← Aufgabe: Erstellt und konfiguriert die Express-App.
│       │   ├── register-routes.ts                            ← Aufgabe: Hängt alle Modulrouten an die App.
│       │   └── register-middleware.ts                        ← Aufgabe: Registriert CORS, JSON-Parser, Logging und Fehlerbehandlung.
│       ├── config/                                           ← Randnotiz: Zentralisiert Konfiguration und Umgebungswerte.
│       │   ├── env.ts                                        ← Aufgabe: Liest und validiert Umgebungsvariablen typisiert ein.
│       │   └── constants.ts                                  ← Aufgabe: Enthält serverseitige Konstanten wie Ports und Standardlimits.
│       ├── db/                                               ← Randnotiz: Kapselt Datenbankverbindung, Migrationen und SQL-nahe Hilfslogik.
│       │   ├── pool.ts                                       ← Aufgabe: Erstellt den PostgreSQL-Connection-Pool.
│       │   ├── run-migrations.ts                             ← Aufgabe: Führt registrierte Migrationen in der richtigen Reihenfolge aus.
│       │   └── migrations/                                   ← Randnotiz: Enthält versionierte Datenbankänderungen.
│       │       ├── 001_init.sql                              ← Aufgabe: Erstellt die Grundtabellen für Orders, History und Users.
│       │       ├── 002_order_history.sql                     ← Aufgabe: Ergänzt die Historientabelle und zugehörige Indizes.
│       │       └── 003_roles_and_auth.sql                    ← Aufgabe: Ergänzt Rollen- und Sitzungsgrundlagen für spätere Rechteverwaltung.
│       ├── middleware/                                       ← Randnotiz: Enthält wiederverwendbare Express-Middleware.
│       │   ├── error-handler.ts                              ← Aufgabe: Wandelt interne Fehler in ein einheitliches API-Fehlerformat um.
│       │   ├── not-found.ts                                  ← Aufgabe: Beantwortet unbekannte Routen mit einer klaren 404-Antwort.
│       │   ├── require-auth.ts                               ← Aufgabe: Prüft, ob ein Benutzer angemeldet ist.
│       │   └── require-role.ts                               ← Aufgabe: Prüft, ob ein Benutzer die nötige Rolle besitzt.
│       ├── modules/                                          ← Randnotiz: Enthält die fachlichen Backend-Module getrennt nach Verantwortung.
│       │   ├── orders/                                       ← Randnotiz: Bündelt alle Auftragslogik an einem Ort.
│       │   │   ├── orders.routes.ts                          ← Aufgabe: Definiert die HTTP-Routen für Aufträge.
│       │   │   ├── orders.controller.ts                      ← Aufgabe: Nimmt Requests an und delegiert an Services.
│       │   │   ├── orders.service.ts                         ← Aufgabe: Enthält die Geschäftslogik rund um Anlegen, Lesen und Ändern von Aufträgen.
│       │   │   ├── orders.repository.ts                      ← Aufgabe: Kapselt alle SQL-Zugriffe für Aufträge.
│       │   │   ├── orders.mapper.ts                          ← Aufgabe: Wandelt DB-Zeilen in Domain-Objekte und zurück.
│       │   │   ├── orders.types.ts                           ← Aufgabe: Enthält serverinterne Ergänzungstypen für das Orders-Modul.
│       │   │   └── orders.validators.ts                      ← Aufgabe: Bindet die Validierungsschemas in das Modul ein.
│       │   ├── history/                                      ← Randnotiz: Verwaltet Änderungen und Nachvollziehbarkeit getrennt vom Orders-Modul.
│       │   │   ├── history.routes.ts                         ← Aufgabe: Definiert die HTTP-Routen für Auftragshistorien.
│       │   │   ├── history.service.ts                        ← Aufgabe: Erstellt und liest Historieneinträge.
│       │   │   ├── history.repository.ts                     ← Aufgabe: Kapselt alle SQL-Zugriffe für Historieneinträge.
│       │   │   └── history.mapper.ts                         ← Aufgabe: Wandelt DB-Zeilen in HistoryEntry-Objekte um.
│       │   ├── auth/                                         ← Randnotiz: Kapselt Anmeldung, Sessionprüfung und Rolleninformationen.
│       │   │   ├── auth.routes.ts                            ← Aufgabe: Definiert Login-, Logout- und Session-Endpunkte.
│       │   │   ├── auth.controller.ts                        ← Aufgabe: Verarbeitet Auth-Requests und erzeugt passende Antworten.
│       │   │   ├── auth.service.ts                           ← Aufgabe: Enthält die Geschäftslogik für Anmeldung und Sessionprüfung.
│       │   │   └── auth.repository.ts                        ← Aufgabe: Kapselt Benutzer- und Sessionabfragen gegen die Datenbank.
│       │   └── events/                                       ← Randnotiz: Kapselt Live-Updates und Eventverteilung.
│       │       ├── events.routes.ts                          ← Aufgabe: Stellt den SSE-Endpunkt für Live-Updates bereit.
│       │       ├── sse-manager.ts                            ← Aufgabe: Verwaltet verbundene SSE-Clients und Broadcasts.
│       │       └── event-publisher.ts                        ← Aufgabe: Veröffentlicht typisierte Events aus fachlichen Modulen.
│       ├── utils/                                            ← Randnotiz: Enthält serverseitige Hilfsfunktionen ohne Fachverantwortung.
│       │   ├── logger.ts                                     ← Aufgabe: Stellt ein zentrales Logging bereit.
│       │   ├── async-handler.ts                              ← Aufgabe: Verhindert doppelten Try-Catch in Async-Routen.
│       │   └── http.ts                                       ← Aufgabe: Enthält Helfer für Statuscodes und Standardantworten.
│       └── tests/                                            ← Randnotiz: Enthält Server-Tests für Kernabläufe und API-Verträge.
│           ├── orders.service.test.ts                        ← Aufgabe: Testet die Auftragslogik unabhängig von HTTP.
│           ├── orders.routes.test.ts                         ← Aufgabe: Testet die Orders-API gegen eine Testumgebung.
│           ├── history.service.test.ts                       ← Aufgabe: Testet das Schreiben und Lesen von Historie.
│           └── events.test.ts                                ← Aufgabe: Testet die Erzeugung und den Versand von SSE-Events.

├── client/                                                   ← Randnotiz: Enthält die typisierte React-Anwendung für Büro- und Werkeroberfläche.
│   ├── package.json                                          ← Aufgabe: Definiert Frontend-Abhängigkeiten und Skripte für Dev und Build.
│   ├── tsconfig.json                                         ← Aufgabe: Konfiguriert die TypeScript-Kompilierung für das Frontend.
│   ├── public/                                               ← Randnotiz: Enthält statische Dateien, die direkt ausgeliefert werden.
│   │   └── index.html                                        ← Aufgabe: Definiert das HTML-Grundgerüst für die React-App.
│   └── src/                                                  ← Randnotiz: Enthält den gesamten produktiven Frontendcode.
│       ├── main.tsx                                          ← Aufgabe: Bootstrapped React und bindet globale Provider ein.
│       ├── App.tsx                                           ← Aufgabe: Kapselt die App-Komposition und bindet Routing und globale Layouts ein.
│       ├── app/                                              ← Randnotiz: Enthält Routing, Provider und App-weite Einstiegskomponenten.
│       │   ├── providers/                                    ← Randnotiz: Bündelt globale React-Provider an einem Ort.
│       │   │   └── AppProviders.tsx                          ← Aufgabe: Registriert Auth-, Router- und weitere globale Provider.
│       │   ├── routes/                                       ← Randnotiz: Enthält die zentrale Routenbeschreibung der Anwendung.
│       │   │   └── AppRouter.tsx                             ← Aufgabe: Definiert alle Seitenrouten und ihre Guards.
│       │   └── guards/                                       ← Randnotiz: Enthält Zugriffsschutz für Rollen und Authentifizierung.
│       │       ├── RequireAuth.tsx                           ← Aufgabe: Lässt nur angemeldete Benutzer zu geschützten Seiten.
│       │       └── RequireRole.tsx                           ← Aufgabe: Lässt nur Benutzer mit passender Rolle zur Route durch.
│       ├── pages/                                            ← Randnotiz: Enthält nur Seiten-Komposition ohne tiefe Fachlogik.
│       │   ├── OfficePage.tsx                                ← Aufgabe: Setzt die Büroansicht aus Features und Layoutbausteinen zusammen.
│       │   ├── WorkerPage.tsx                                ← Aufgabe: Setzt die Werkeransicht aus Features und Layoutbausteinen zusammen.
│       │   ├── LoginPage.tsx                                 ← Aufgabe: Zeigt die Loginoberfläche und bindet das Auth-Feature ein.
│       │   └── NotFoundPage.tsx                              ← Aufgabe: Zeigt eine saubere 404-Seite für unbekannte Routen.
│       ├── features/                                         ← Randnotiz: Enthält fachliche Frontendmodule mit klarer Verantwortung.
│       │   ├── orders/                                       ← Randnotiz: Bündelt die gesamte Auftragsdarstellung und -bearbeitung.
│       │   │   ├── api/                                      ← Randnotiz: Enthält ausschließlich auftragsbezogene HTTP-Funktionen.
│       │   │   │   └── orders.api.ts                         ← Aufgabe: Kapselt alle Requests rund um Aufträge.
│       │   │   ├── components/                               ← Randnotiz: Enthält UI-Komponenten mit direktem Auftragsbezug.
│       │   │   │   ├── OrdersTable.tsx                       ← Aufgabe: Zeigt Aufträge tabellarisch mit klaren Spalten an.
│       │   │   │   ├── OrderForm.tsx                         ← Aufgabe: Erfasst neue oder bearbeitete Auftragsdaten in einem Formular.
│       │   │   │   ├── OrderStatusBadge.tsx                  ← Aufgabe: Zeigt den aktuellen Auftragsstatus einheitlich formatiert an.
│       │   │   │   ├── OrderTimeline.tsx                     ← Aufgabe: Visualisiert den Bearbeitungsfortschritt eines Auftrags.
│       │   │   │   └── OrderFilters.tsx                      ← Aufgabe: Bietet Filter- und Sortierfelder für die Auftragsliste an.
│       │   │   ├── hooks/                                    ← Randnotiz: Enthält auftragsbezogene React-Hooks.
│       │   │   │   ├── useOrders.ts                          ← Aufgabe: Lädt, speichert und aktualisiert Auftragslisten.
│       │   │   │   ├── useOrderDetails.ts                    ← Aufgabe: Lädt und verwaltet die Detailansicht eines einzelnen Auftrags.
│       │   │   │   └── useOrderFilters.ts                    ← Aufgabe: Verwaltet Filter-, Such- und Sortierzustände.
│       │   │   ├── lib/                                      ← Randnotiz: Enthält reine Hilfslogik für Auftragsdarstellung.
│       │   │   │   ├── order-formatters.ts                   ← Aufgabe: Formatiert Order-Daten für Anzeigezwecke.
│       │   │   │   └── order-mappers.ts                      ← Aufgabe: Wandelt API-Daten in UI-freundliche Modelle um.
│       │   │   └── model/                                    ← Randnotiz: Enthält kleine zustandsnahe Frontendmodelle für Orders.
│       │   │       └── order-ui.ts                           ← Aufgabe: Enthält UI-spezifische Labels und Zuordnungen für Orderdarstellung.
│       │   ├── history/                                      ← Randnotiz: Bündelt die Anzeige der Änderungshistorie.
│       │   │   ├── api/history.api.ts                        ← Aufgabe: Lädt Historieneinträge eines Auftrags vom Server.
│       │   │   ├── components/HistoryList.tsx                ← Aufgabe: Zeigt die Historie eines Auftrags chronologisch an.
│       │   │   └── hooks/useOrderHistory.ts                  ← Aufgabe: Lädt und verwaltet den Historiezustand im Frontend.
│       │   ├── auth/                                         ← Randnotiz: Bündelt Anmeldung, Sessionzustand und rollenabhängige Anzeige.
│       │   │   ├── api/auth.api.ts                           ← Aufgabe: Kapselt Login-, Logout- und Sessionanfragen.
│       │   │   ├── components/LoginForm.tsx                  ← Aufgabe: Erfasst Zugangsdaten und startet den Loginprozess.
│       │   │   ├── context/AuthContext.tsx                   ← Aufgabe: Stellt den globalen Auth-Zustand im Frontend bereit.
│       │   │   ├── hooks/useAuth.ts                          ← Aufgabe: Gibt einfachen Zugriff auf den Auth-Kontext.
│       │   │   └── lib/auth-helpers.ts                       ← Aufgabe: Enthält kleine Helfer für Rollenprüfung und Sessionlogik.
│       │   └── live-updates/                                 ← Randnotiz: Bündelt SSE und sofortige UI-Aktualisierung.
│       │       ├── hooks/useSseEvents.ts                     ← Aufgabe: Baut die SSE-Verbindung auf und verarbeitet Eventeingänge.
│       │       ├── lib/apply-order-events.ts                 ← Aufgabe: Überträgt eingehende Events auf den lokalen UI-Zustand.
│       │       └── model/live-update-types.ts                ← Aufgabe: Enthält eventnahe Frontend-Hilfstypen.
│       ├── shared/                                           ← Randnotiz: Enthält UI-neutrale Frontendbausteine und wiederverwendbare Helfer.
│       │   ├── api/                                          ← Randnotiz: Enthält den allgemeinen HTTP-Unterbau.
│       │   │   ├── http-client.ts                            ← Aufgabe: Kapselt fetch, Basis-URL, Header und Fehlerbehandlung.
│       │   │   └── api-error.ts                              ← Aufgabe: Vereinheitlicht die Behandlung von API-Fehlern im Frontend.
│       │   ├── components/                                   ← Randnotiz: Enthält fachneutrale UI-Bausteine.
│       │   │   ├── PageHeader.tsx                            ← Aufgabe: Zeigt einheitliche Seitenüberschriften an.
│       │   │   ├── LoadingState.tsx                          ← Aufgabe: Zeigt einen einheitlichen Ladezustand an.
│       │   │   ├── EmptyState.tsx                            ← Aufgabe: Zeigt einen einheitlichen Leerzustand an.
│       │   │   └── ErrorState.tsx                            ← Aufgabe: Zeigt einen einheitlichen Fehlerzustand an.
│       │   ├── hooks/                                        ← Randnotiz: Enthält fachneutrale React-Hooks.
│       │   │   ├── useDebounce.ts                            ← Aufgabe: Verzögert Werte für Sucheingaben oder Filter.
│       │   │   └── useLocalStorage.ts                        ← Aufgabe: Speichert kleine UI-Zustände lokal im Browser.
│       │   ├── lib/                                          ← Randnotiz: Enthält kleine allgemeine Frontendhilfen.
│       │   │   ├── dates.ts                                  ← Aufgabe: Formatiert Datumswerte für die Oberfläche.
│       │   │   └── classnames.ts                             ← Aufgabe: Vereinfacht das sichere Zusammenbauen von CSS-Klassen.
│       │   ├── styles/                                       ← Randnotiz: Enthält globale Styles, Tokens und thematische Grundregeln.
│       │   │   ├── global.css                                ← Aufgabe: Definiert globale Basestyles für die gesamte App.
│       │   │   ├── tokens.css                                ← Aufgabe: Definiert Farben, Abstände, Radius und Schriften als Design-Tokens.
│       │   │   └── theme.css                                 ← Aufgabe: Definiert das eigentliche Theme auf Basis der Tokens.
│       │   └── ui/                                           ← Randnotiz: Enthält atomare generische UI-Bausteine.
│       │       ├── Button.tsx                                ← Aufgabe: Stellt einen einheitlichen Button für die gesamte App bereit.
│       │       ├── Input.tsx                                 ← Aufgabe: Stellt ein einheitliches Eingabefeld bereit.
│       │       ├── Select.tsx                                ← Aufgabe: Stellt ein einheitliches Auswahlfeld bereit.
│       │       ├── Card.tsx                                  ← Aufgabe: Stellt einen einheitlichen Kartencontainer bereit.
│       │       └── Badge.tsx                                 ← Aufgabe: Stellt eine neutrale Badge-Komponente bereit.
│       └── tests/                                            ← Randnotiz: Enthält Frontendtests für Kernfeatures und Zustände.
│           ├── orders.test.tsx                               ← Aufgabe: Testet die Auftragsdarstellung und Filterlogik.
│           ├── auth.test.tsx                                 ← Aufgabe: Testet Login- und Rollenverhalten.
│           └── live-updates.test.tsx                         ← Aufgabe: Testet die Verarbeitung eingehender SSE-Events.

├── package.json                                              ← Aufgabe: Definiert Root-Skripte für paralleles Starten von Client und Server.
├── .gitignore                                                ← Aufgabe: Schließt Build-, Cache-, Env- und Node-Artefakte vom Repository aus.
└── README.md                                                 ← Aufgabe: Gibt einen schnellen Einstieg in Ziel, Setup, Struktur und Entwicklungsablauf.