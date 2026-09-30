-- LEAD SERVICE INTERESTS R1
-- Additional service interests selected by authenticated Lead Portal users.
-- Apply to STAGING D1 first.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS lead_service_interests (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,

  UNIQUE (lead_id, service_name),

  FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE,

  FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_lead_service_interests_lead
  ON lead_service_interests(lead_id, created_at);
