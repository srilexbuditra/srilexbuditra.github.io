-- ==========================================================
-- LEAD PORTAL ACCOUNT R1
-- Migration: 011_lead_portal_account_r1.sql
--
-- Compatibility design:
-- - users.role keeps the legacy CHECK constraint.
-- - portal_role='lead' represents the effective Lead role.
-- - NULL portal_role means use the existing users.role.
-- - leads.account_user_id links a registered Lead Portal
--   account to the existing CRM lead record.
--
-- Existing users and existing leads are unaffected because
-- both new columns default to NULL.
-- ==========================================================

ALTER TABLE users
ADD COLUMN portal_role TEXT
CHECK (
  portal_role IS NULL OR
  portal_role = 'lead'
);


ALTER TABLE leads
ADD COLUMN account_user_id TEXT
REFERENCES users(id)
ON DELETE SET NULL;


CREATE INDEX IF NOT EXISTS idx_users_portal_role_status
ON users(portal_role, status);


CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_account_user
ON leads(account_user_id)
WHERE account_user_id IS NOT NULL;


PRAGMA foreign_key_check;
