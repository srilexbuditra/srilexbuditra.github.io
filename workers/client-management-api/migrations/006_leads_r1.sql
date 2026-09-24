PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  lead_code TEXT NOT NULL UNIQUE,

  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,

  source TEXT,
  service_interest TEXT,
  message TEXT,

  status TEXT NOT NULL DEFAULT 'new'
    CHECK (
      status IN (
        'new',
        'contacted',
        'qualified',
        'lost',
        'converted'
      )
    ),

  assigned_to_user_id TEXT,
  next_follow_up_at TEXT,

  converted_client_id TEXT,
  converted_at TEXT,

  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (assigned_to_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,

  FOREIGN KEY (converted_client_id)
    REFERENCES clients(id)
    ON DELETE SET NULL,

  FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL,

  FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_leads_status
  ON leads(status, updated_at);

CREATE INDEX IF NOT EXISTS idx_leads_follow_up
  ON leads(next_follow_up_at, status);

CREATE INDEX IF NOT EXISTS idx_leads_assigned
  ON leads(assigned_to_user_id, status);

CREATE INDEX IF NOT EXISTS idx_leads_created
  ON leads(created_at);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead
  ON lead_notes(lead_id, created_at);