-- ==========================================================
-- CLIENT NOTIFICATIONS R1
-- Migration: 012_client_notifications_r1.sql
--
-- Purpose:
-- - Store user-targeted Client Portal notifications.
-- - Keep notifications separate from administrative activity logs.
-- - Support unread/read state through read_at.
-- - Allow direct navigation to the related entity.
--
-- Security model:
-- - recipient_user_id identifies the only portal user allowed
--   to receive/read the notification.
-- - Support internal notes must never create Client notifications.
-- ==========================================================

PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS client_notifications (
  id TEXT PRIMARY KEY,

  recipient_user_id TEXT NOT NULL,
  actor_user_id TEXT,

  type TEXT NOT NULL,

  entity_type TEXT,
  entity_id TEXT,

  title TEXT NOT NULL,
  description TEXT,

  read_at TEXT,
  created_at TEXT NOT NULL,

  FOREIGN KEY (recipient_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  FOREIGN KEY (actor_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);


CREATE INDEX IF NOT EXISTS
  idx_client_notifications_recipient_created
ON client_notifications(
  recipient_user_id,
  created_at DESC
);


CREATE INDEX IF NOT EXISTS
  idx_client_notifications_recipient_unread
ON client_notifications(
  recipient_user_id,
  read_at,
  created_at DESC
);


CREATE INDEX IF NOT EXISTS
  idx_client_notifications_entity
ON client_notifications(
  entity_type,
  entity_id,
  created_at DESC
);


PRAGMA foreign_key_check;
