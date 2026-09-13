-- V12.3 VERIFIED MEMBER + Foto
-- Tabel status verifikasi anggota. Foto disimpan private di R2 REGISTRATION_DOCUMENTS.
CREATE TABLE IF NOT EXISTS participant_member_verifications (
  registration_id TEXT PRIMARY KEY,
  photo_object_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  consent_at TEXT,
  submitted_at TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT,
  review_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_member_verifications_status
ON participant_member_verifications(status);

CREATE INDEX IF NOT EXISTS idx_member_verifications_submitted
ON participant_member_verifications(submitted_at);
