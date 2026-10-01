-- 016_lead_official_estimate_r1.sql
-- Extend the existing Estimate system so one Estimate can belong to:
-- 1) an existing Client, or
-- 2) a Lead before conversion.
--
-- Existing Client Estimate rows are preserved with lead_id = NULL.
-- Lead-owned Estimate rows may start with client_id = NULL.
-- After Lead -> Client conversion, both lead_id and client_id may be populated.
--
-- estimate_items is rebuilt together with estimates so ON DELETE CASCADE
-- cannot remove existing items while the parent table is replaced.

PRAGMA defer_foreign_keys = ON;

CREATE TABLE estimates_r1_new (
  id TEXT PRIMARY KEY,

  client_id TEXT,
  lead_id TEXT,
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

  CHECK (
    client_id IS NOT NULL
    OR lead_id IS NOT NULL
  ),

  FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE,

  FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE RESTRICT,

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

INSERT INTO estimates_r1_new (
  id,
  client_id,
  lead_id,
  project_id,
  estimate_code,
  title,
  description,
  currency,
  issue_date,
  valid_until,
  status,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  sent_at,
  approved_at,
  rejected_at,
  converted_invoice_id,
  created_by_user_id,
  created_at,
  updated_at
)
SELECT
  id,
  client_id,
  NULL,
  project_id,
  estimate_code,
  title,
  description,
  currency,
  issue_date,
  valid_until,
  status,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  sent_at,
  approved_at,
  rejected_at,
  converted_invoice_id,
  created_by_user_id,
  created_at,
  updated_at
FROM estimates;

CREATE TABLE estimate_items_r1_new (
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
    REFERENCES estimates_r1_new(id)
    ON DELETE CASCADE
);

INSERT INTO estimate_items_r1_new (
  id,
  estimate_id,
  description,
  quantity,
  unit_price,
  line_total,
  position,
  created_at
)
SELECT
  id,
  estimate_id,
  description,
  quantity,
  unit_price,
  line_total,
  position,
  created_at
FROM estimate_items;

DROP TABLE estimate_items;
DROP TABLE estimates;

ALTER TABLE estimates_r1_new
  RENAME TO estimates;

ALTER TABLE estimate_items_r1_new
  RENAME TO estimate_items;

CREATE INDEX idx_estimates_client
  ON estimates(client_id, status, created_at);

CREATE INDEX idx_estimates_lead
  ON estimates(lead_id, status, created_at);

CREATE INDEX idx_estimates_project
  ON estimates(project_id, status, created_at);

CREATE INDEX idx_estimates_status
  ON estimates(status, valid_until);

CREATE INDEX idx_estimate_items_estimate
  ON estimate_items(estimate_id, position);

PRAGMA foreign_key_check;