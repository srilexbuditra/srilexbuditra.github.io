-- ============================================================
-- LEAD PUBLIC SHARE R1
-- Secure public read-only document for Lead / Estimate
-- ============================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS lead_public_shares (
  id TEXT PRIMARY KEY,

  lead_id TEXT NOT NULL UNIQUE,

  version INTEGER NOT NULL DEFAULT 1
    CHECK (version >= 1),

  status TEXT NOT NULL DEFAULT 'active'
    CHECK (
      status IN (
        'active',
        'revoked'
      )
    ),

  created_by_user_id TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  expires_at TEXT,
  last_accessed_at TEXT,
  revoked_at TEXT,

  FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE,

  FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS
  idx_lead_public_shares_status
  ON lead_public_shares(
    status,
    expires_at
  );

CREATE INDEX IF NOT EXISTS
  idx_lead_public_shares_access
  ON lead_public_shares(
    last_accessed_at
  );