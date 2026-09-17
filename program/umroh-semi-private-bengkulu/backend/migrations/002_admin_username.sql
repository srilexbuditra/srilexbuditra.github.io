-- Umroh Semi Private Bengkulu
-- Migration 002: admin username support
-- Run after 001_auth_foundation.sql

ALTER TABLE umroh_accounts ADD COLUMN username TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_umroh_accounts_username_unique
ON umroh_accounts(username)
WHERE username IS NOT NULL;
