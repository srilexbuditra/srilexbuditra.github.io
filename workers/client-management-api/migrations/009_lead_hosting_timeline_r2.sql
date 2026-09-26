PRAGMA foreign_keys = ON;

-- ==========================================================
-- ESTIMATOR FLOW R2
-- HOSTING + TARGET TIMELINE
-- ==========================================================

ALTER TABLE leads
ADD COLUMN hosting_mode TEXT
  CHECK (
    hosting_mode IS NULL OR
    hosting_mode IN (
      'none',
      'owned',
      'needed'
    )
  );

ALTER TABLE leads
ADD COLUMN target_timeline TEXT
  CHECK (
    target_timeline IS NULL OR
    target_timeline IN (
      'flexible',
      '2_4_weeks',
      '1_2_months',
      'target_date'
    )
  );

ALTER TABLE leads
ADD COLUMN target_date TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_hosting_mode
  ON leads(hosting_mode, created_at);

CREATE INDEX IF NOT EXISTS idx_leads_target_timeline
  ON leads(target_timeline, created_at);