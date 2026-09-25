PRAGMA defer_foreign_keys = ON;

-- ==========================================================
-- PUBLIC CALCULATOR -> LEAD SYNC R1
--
-- Existing Admin-created leads tetap memiliki
-- created_by_user_id.
--
-- Public Calculator leads menggunakan:
-- created_by_user_id = NULL
-- source = 'Website Calculator'
-- ==========================================================

ALTER TABLE lead_notes
RENAME TO lead_notes_r1_old;

ALTER TABLE leads
RENAME TO leads_r1_old;

CREATE TABLE leads (
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

  created_by_user_id TEXT,

  public_request_ref TEXT UNIQUE,
  package_name TEXT,

  estimated_amount INTEGER
    CHECK (
      estimated_amount IS NULL OR
      estimated_amount >= 0
    ),

  extra_feature TEXT,
  privacy_consent_at TEXT,

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

INSERT INTO leads (
  id,
  lead_code,
  full_name,
  company_name,
  email,
  phone,
  source,
  service_interest,
  message,
  status,
  assigned_to_user_id,
  next_follow_up_at,
  converted_client_id,
  converted_at,
  created_by_user_id,
  public_request_ref,
  package_name,
  estimated_amount,
  extra_feature,
  privacy_consent_at,
  created_at,
  updated_at
)
SELECT
  id,
  lead_code,
  full_name,
  company_name,
  email,
  phone,
  source,
  service_interest,
  message,
  status,
  assigned_to_user_id,
  next_follow_up_at,
  converted_client_id,
  converted_at,
  created_by_user_id,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  created_at,
  updated_at
FROM leads_r1_old;

CREATE TABLE lead_notes (
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

INSERT INTO lead_notes (
  id,
  lead_id,
  user_id,
  note,
  created_at
)
SELECT
  id,
  lead_id,
  user_id,
  note,
  created_at
FROM lead_notes_r1_old;

DROP TABLE lead_notes_r1_old;
DROP TABLE leads_r1_old;

CREATE INDEX idx_leads_status
  ON leads(status, updated_at);

CREATE INDEX idx_leads_follow_up
  ON leads(next_follow_up_at, status);

CREATE INDEX idx_leads_assigned
  ON leads(assigned_to_user_id, status);

CREATE INDEX idx_leads_created
  ON leads(created_at);

CREATE INDEX idx_leads_source
  ON leads(source, created_at);

CREATE INDEX idx_lead_notes_lead
  ON lead_notes(lead_id, created_at);