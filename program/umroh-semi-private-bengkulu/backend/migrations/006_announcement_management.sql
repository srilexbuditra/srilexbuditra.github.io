ALTER TABLE umroh_announcements ADD COLUMN priority TEXT NOT NULL DEFAULT 'info' CHECK (priority IN ('info','important','warning','urgent'));
CREATE INDEX IF NOT EXISTS idx_umroh_announcements_management ON umroh_announcements(is_published, priority, published_at);
INSERT OR IGNORE INTO umroh_announcements (announcement_key, category, priority, title, body, published_at, is_published, created_at, updated_at) VALUES ('manasik-lanjutan','manasik','info','Manasik lanjutan','Informasi waktu dan lokasi akan ditampilkan pada Agenda setelah dikonfirmasi.

Jadwal manasik lanjutan masih menunggu konfirmasi pengelola. Gunakan Agenda & Perjalanan sebagai sumber jadwal resmi.','2026-09-17T08:00:00+07:00',0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO umroh_announcements (announcement_key, category, priority, title, body, published_at, is_published, created_at, updated_at) VALUES ('persiapan-dokumen','dokumen','important','Persiapan dokumen perjalanan','Pastikan data identitas dan dokumen perjalanan sesuai arahan resmi pengelola.

Periksa kembali dokumen yang diperlukan melalui menu Dokumen Saya dan ikuti status verifikasi yang diberikan pengelola.','2026-09-16T08:00:00+07:00',0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO umroh_announcements (announcement_key, category, priority, title, body, published_at, is_published, created_at, updated_at) VALUES ('pembagian-rombongan','perjalanan','info','Pembagian rombongan','Informasi rombongan akan tersedia setelah penetapan final.

Informasi resmi mengenai pembagian rombongan akan dipublikasikan oleh pengelola setelah proses penetapan selesai.','2026-09-15T08:00:00+07:00',0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO umroh_announcements (announcement_key, category, priority, title, body, published_at, is_published, created_at, updated_at) VALUES ('keamanan-dokumen','keamanan','warning','Keamanan dokumen pribadi','Jaga kerahasiaan paspor, identitas, data kesehatan, dan dokumen pribadi Anda.

Gunakan hanya fitur Dokumen Saya yang telah dilindungi autentikasi dan penyimpanan private R2. Jangan membagikan berkas pribadi melalui halaman publik atau kanal yang tidak resmi.','2026-09-15T08:00:00+07:00',0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
