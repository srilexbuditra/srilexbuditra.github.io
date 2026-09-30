PRAGMA foreign_keys = ON;

-- LEAD CONSULTATION R1
-- Menyimpan deskripsi kebutuhan konsultasi tanpa menimpa message registrasi.

ALTER TABLE leads
ADD COLUMN consultation_description TEXT;

ALTER TABLE leads
ADD COLUMN consultation_submitted_at TEXT;
