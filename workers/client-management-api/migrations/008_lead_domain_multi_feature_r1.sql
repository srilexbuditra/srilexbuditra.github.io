PRAGMA foreign_keys = ON;

-- ==========================================================
-- MULTI FEATURE + DOMAIN LEAD R1
-- ==========================================================

ALTER TABLE leads
ADD COLUMN domain_mode TEXT
  CHECK (
    domain_mode IS NULL OR
    domain_mode IN (
      'none',
      'owned',
      'new'
    )
  );

ALTER TABLE leads
ADD COLUMN domain_name TEXT;

ALTER TABLE leads
ADD COLUMN domain_status TEXT
  CHECK (
    domain_status IS NULL OR
    domain_status IN (
      'none',
      'owned',
      'unregistered',
      'registered',
      'unknown'
    )
  );

ALTER TABLE leads
ADD COLUMN domain_checked_at TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_domain_name
  ON leads(domain_name);

CREATE INDEX IF NOT EXISTS idx_leads_domain_status
  ON leads(domain_status, created_at);