-- ---- ORDERS ----
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  article          TEXT NOT NULL,
  order_number     TEXT,
  customer         TEXT,
  material         TEXT NOT NULL,
  dimensions       TEXT NOT NULL,
  quantity         INTEGER NOT NULL,
  delivery_date    TEXT NOT NULL,
  notes            TEXT,
  status           TEXT NOT NULL,
  current_step     TEXT,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL,
  last_changed_by  TEXT
);
