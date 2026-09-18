-- Umroh Semi Private Bengkulu
-- Migration 005: Agenda Management Backend V3.5.0
-- Run ONCE after 004_secure_documents.sql and before deploying Worker V3.5.0.

ALTER TABLE umroh_agenda_events ADD COLUMN category TEXT;
ALTER TABLE umroh_agenda_events ADD COLUMN ends_at TEXT;

CREATE INDEX IF NOT EXISTS idx_umroh_agenda_management
  ON umroh_agenda_events(is_published, event_status, starts_at);

UPDATE umroh_agenda_events
SET category = CASE event_key
  WHEN 'manasik-tata-cara' THEN 'Manasik'
  WHEN 'pemeriksaan-dokumen' THEN 'Dokumen'
  WHEN 'briefing-keberangkatan' THEN 'Briefing'
  WHEN 'keberangkatan' THEN 'Keberangkatan'
  WHEN '__agenda-read-sync-v1__' THEN 'Sistem'
  ELSE COALESCE(category, 'Perjalanan')
END
WHERE category IS NULL OR trim(category) = '';
