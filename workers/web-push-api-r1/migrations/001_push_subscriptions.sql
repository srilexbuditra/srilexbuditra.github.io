-- REV22 R1
-- Anonymous browser/device Web Push subscription storage.
-- No name, email, phone, IP, client ID, participant ID, or profile data.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  endpoint_hash TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  ownership_token_hash TEXT NOT NULL
    CHECK (length(ownership_token_hash) = 64),
  expiration_time INTEGER,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'disabled')),
  failure_count INTEGER NOT NULL DEFAULT 0
    CHECK (failure_count >= 0),
  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  last_success_at TEXT,
  last_failure_at TEXT,
  last_test_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_status_updated
ON push_subscriptions(status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_last_seen
ON push_subscriptions(last_seen_at DESC);