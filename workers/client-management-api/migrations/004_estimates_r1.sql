PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS estimates (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  project_id TEXT,
  estimate_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  currency TEXT NOT NULL DEFAULT 'IDR',
  issue_date TEXT NOT NULL,
  valid_until TEXT,

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (
      status IN (
        'draft',
        'sent',
        'approved',
        'rejected',
        'expired',
        'cancelled'
      )
    ),

  subtotal INTEGER NOT NULL DEFAULT 0
    CHECK (subtotal >= 0),

  tax_amount INTEGER NOT NULL DEFAULT 0
    CHECK (tax_amount >= 0),

  total_amount INTEGER NOT NULL DEFAULT 0
    CHECK (total_amount >= 0),

  notes TEXT,

  sent_at TEXT,
  approved_at TEXT,
  rejected_at TEXT,

  converted_invoice_id TEXT,

  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE,

  FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE SET NULL,

  FOREIGN KEY (converted_invoice_id)
    REFERENCES invoices(id)
    ON DELETE SET NULL,

  FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS estimate_items (
  id TEXT PRIMARY KEY,
  estimate_id TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1
    CHECK (quantity > 0),
  unit_price INTEGER NOT NULL DEFAULT 0
    CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL DEFAULT 0
    CHECK (line_total >= 0),
  position INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,

  FOREIGN KEY (estimate_id)
    REFERENCES estimates(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_estimates_client
  ON estimates(client_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_estimates_project
  ON estimates(project_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_estimates_status
  ON estimates(status, valid_until);

CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate
  ON estimate_items(estimate_id, position);