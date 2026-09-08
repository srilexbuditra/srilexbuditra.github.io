CREATE TABLE IF NOT EXISTS participant_accounts (
  registration_id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL DEFAULT 210000,
  activated_at TEXT NOT NULL,
  last_login_at TEXT,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS participant_sessions (
  token_hash TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (registration_id) REFERENCES participant_accounts(registration_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_participant_sessions_registration ON participant_sessions(registration_id);
CREATE INDEX IF NOT EXISTS idx_participant_sessions_expiry ON participant_sessions(expires_at);
