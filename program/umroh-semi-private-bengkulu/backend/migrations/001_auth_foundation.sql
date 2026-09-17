-- Umroh Semi Private Bengkulu
-- Backend Foundation V3.0
-- Migration: 001_auth_foundation.sql
-- Target: Cloudflare D1 / SQLite
--
-- IMPORTANT:
-- - Do not store raw passwords, session tokens, or activation codes.
-- - Hash passwords with a modern password hashing algorithm in the Worker.
-- - Store only hashes of session tokens and activation codes.
-- - All timestamps are stored in UTC.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS umroh_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_uuid TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'jamaah'
    CHECK (role IN ('jamaah', 'admin', 'super_admin', 'tour_leader', 'pendamping')),
  member_no TEXT UNIQUE,
  email TEXT UNIQUE,
  whatsapp TEXT UNIQUE,
  password_hash TEXT,
  account_status TEXT NOT NULL DEFAULT 'pending_activation'
    CHECK (account_status IN ('pending_activation', 'active', 'suspended', 'disabled')),
  password_changed_at TEXT,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    role != 'jamaah'
    OR member_no IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_umroh_accounts_role
  ON umroh_accounts(role);

CREATE INDEX IF NOT EXISTS idx_umroh_accounts_status
  ON umroh_accounts(account_status);

CREATE TABLE IF NOT EXISTS umroh_jamaah_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  group_name TEXT,
  departure_batch TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS umroh_activation_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_umroh_activation_account
  ON umroh_activation_codes(account_id, used_at, expires_at);

CREATE TABLE IF NOT EXISTS umroh_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_umroh_sessions_account
  ON umroh_sessions(account_id, revoked_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_umroh_sessions_expiry
  ON umroh_sessions(expires_at);

CREATE TABLE IF NOT EXISTS umroh_progress_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  module TEXT NOT NULL
    CHECK (module IN ('manasik', 'checklist')),
  item_key TEXT NOT NULL,
  status TEXT NOT NULL
    CHECK (status IN ('pending', 'complete', 'not_applicable')),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (account_id, module, item_key),
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_umroh_progress_account_module
  ON umroh_progress_items(account_id, module);

CREATE TABLE IF NOT EXISTS umroh_document_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  document_key TEXT NOT NULL,
  jamaah_status TEXT NOT NULL DEFAULT 'unreviewed'
    CHECK (jamaah_status IN ('unreviewed', 'prepared', 'waiting')),
  admin_status TEXT NOT NULL DEFAULT 'not_reviewed'
    CHECK (admin_status IN ('not_reviewed', 'verified', 'needs_revision', 'rejected')),
  admin_note TEXT,
  reviewed_by_account_id INTEGER,
  reviewed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (account_id, document_key),
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by_account_id) REFERENCES umroh_accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_umroh_document_status_account
  ON umroh_document_status(account_id);

CREATE TABLE IF NOT EXISTS umroh_agenda_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TEXT,
  location_text TEXT,
  event_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (event_status IN ('draft', 'scheduled', 'confirmed', 'cancelled')),
  is_published INTEGER NOT NULL DEFAULT 0
    CHECK (is_published IN (0, 1)),
  created_by_account_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_account_id) REFERENCES umroh_accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_umroh_agenda_publish
  ON umroh_agenda_events(is_published, starts_at);

CREATE TABLE IF NOT EXISTS umroh_agenda_reads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  agenda_id INTEGER NOT NULL,
  read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (account_id, agenda_id),
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (agenda_id) REFERENCES umroh_agenda_events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS umroh_announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  announcement_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
    CHECK (category IN ('manasik', 'dokumen', 'perjalanan', 'keamanan', 'umum')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TEXT,
  is_published INTEGER NOT NULL DEFAULT 0
    CHECK (is_published IN (0, 1)),
  created_by_account_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_account_id) REFERENCES umroh_accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_umroh_announcements_publish
  ON umroh_announcements(is_published, published_at);

CREATE TABLE IF NOT EXISTS umroh_announcement_reads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  announcement_id INTEGER NOT NULL,
  read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (account_id, announcement_id),
  FOREIGN KEY (account_id) REFERENCES umroh_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (announcement_id) REFERENCES umroh_announcements(id) ON DELETE CASCADE
);

-- Optional helper trigger pattern:
-- D1/SQLite does not automatically update updated_at columns.
-- The Worker should set updated_at = CURRENT_TIMESTAMP on every UPDATE.
