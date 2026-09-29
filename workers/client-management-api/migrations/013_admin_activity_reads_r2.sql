-- ADMIN NOTIFICATION READ STATE R2
-- Per-user read state for activity-based admin notifications.
-- Apply to STAGING D1 first.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_activity_reads (
  user_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  read_at TEXT NOT NULL,

  PRIMARY KEY (user_id, activity_id),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  FOREIGN KEY (activity_id)
    REFERENCES activity_logs(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_reads_activity
  ON admin_activity_reads(activity_id);

CREATE INDEX IF NOT EXISTS idx_admin_activity_reads_user_read
  ON admin_activity_reads(user_id, read_at);