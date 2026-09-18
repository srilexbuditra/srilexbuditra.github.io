
CREATE TABLE IF NOT EXISTS umroh_manasik_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_key TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  icon_key TEXT NOT NULL DEFAULT 'book',
  content_json TEXT NOT NULL DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_umroh_manasik_management
  ON umroh_manasik_materials(is_published, sort_order, material_key);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('persiapan', 1, 'Persiapan Sebelum Berangkat', 'Pastikan ibadah siap, dokumen lengkap, dan kondisi perjalanan terencana.', 'suitcase', '[{"type":"section","heading":"Dokumen","body":"- Paspor & dokumen perjalanan\n- Tiket / itinerary\n- Identitas jemaah\n- Dokumen kesehatan sesuai ketentuan perjalanan"},{"type":"section","heading":"Perlengkapan","body":"- Kain ihram bagi laki-laki\n- Mukena & pakaian muslim\n- Sandal/sepatu nyaman\n- Obat & kebutuhan pribadi"},{"type":"section","heading":"Kesiapan Ibadah","body":"- Pelajari tata cara umroh\n- Hafalkan niat & talbiyah\n- Jaga fisik dan istirahat\n- Ikuti arahan pembimbing & tour leader"}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('ihram-miqat', 2, 'Ihram & Miqat', 'Ihram dimulai dengan niat umroh pada tempat/waktu yang ditentukan.', 'map-pin', '[{"type":"section","heading":"Sebelum Miqat","body":"Mandi sunnah, memakai pakaian ihram, merapikan diri, dan bersiap untuk niat."},{"type":"arabic","heading":"Niat Umroh","arabic":"لَبَّيْكَ اللَّهُمَّ عُمْرَةً","body":"“Labbaik Allahumma ‘umratan.”"},{"type":"section","heading":"Setelah Niat","body":"Perbanyak talbiyah, dzikir dan doa. Jaga larangan ihram sampai tahallul."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('talbiyah', 3, 'Talbiyah', 'Dibaca setelah niat ihram dan diperbanyak selama perjalanan menuju Makkah.', 'sparkles', '[{"type":"arabic","heading":"Bacaan Talbiyah","arabic":"لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ\nلَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ\nإِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ\nلَا شَرِيكَ لَكَ","body":""},{"type":"note","body":"Utamakan kekhusyukan dan ikuti tuntunan pembimbing."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('tata-cara-umroh', 4, 'Tata Cara Umroh', 'Urutan utama yang perlu dipahami setiap jemaah.', 'route', '[{"type":"steps","items":[{"number":"01","title":"Ihram","detail":"Niat di miqat"},{"number":"02","title":"Thawaf","detail":"7 putaran mengelilingi Ka’bah"},{"number":"03","title":"Sa’i","detail":"7 kali perjalanan Shafa–Marwah"},{"number":"04","title":"Tahallul","detail":"Memotong/mencukur rambut"}]}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('thawaf', 5, 'Thawaf', '7 putaran dimulai dari area Hajar Aswad dan berakhir di putaran ketujuh.', 'thawaf', '[{"type":"section","heading":"Sebelum Thawaf","body":"Pastikan wudhu dan pakaian suci. Niat thawaf umroh. Ka’bah berada di sebelah kiri."},{"type":"section","heading":"Saat Thawaf","body":"Berjalan 7 putaran. Perbanyak dzikir, doa, dan bacaan yang dipahami. Tidak ada doa khusus yang wajib untuk setiap putaran."},{"type":"section","heading":"Selesai Thawaf","body":"Shalat sunnah thawaf jika memungkinkan, lalu menuju tempat yang diarahkan untuk memulai sa’i."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('sai', 6, 'Sa’i', 'Sa’i dilakukan 7 kali perjalanan antara Shafa dan Marwah.', 'sai', '[{"type":"section","heading":"Urutan","body":"- Mulai dari Shafa → Marwah = 1\n- Marwah → Shafa = 2\n- Lanjut hingga perjalanan ke-7 berakhir di Marwah."},{"type":"section","heading":"Selama Sa’i","body":"Perbanyak doa dan dzikir. Berjalan sesuai jalur. Laki-laki disunnahkan berlari kecil di area yang ditandai."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('tahallul', 7, 'Tahallul', 'Tahallul menandai selesainya rangkaian umroh.', 'scissors', '[{"type":"section","heading":"Laki-Laki","body":"Mencukur atau memendekkan rambut. Mencukur habis lebih utama menurut banyak ulama."},{"type":"section","heading":"Perempuan","body":"Memotong ujung rambut secukupnya sesuai tuntunan pembimbing."},{"type":"note","body":"Setelah tahallul, larangan ihram berakhir."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('larangan-ihram', 8, 'Larangan Ihram', 'Jaga sikap dan kondisi selama dalam ihram.', 'ban', '[{"type":"section","heading":"Diantara Larangan","body":"- Memotong rambut/kuku\n- Menggunakan wewangian setelah ihram\n- Berburu hewan darat\n- Hubungan suami-istri\n- Akad nikah\n- Bagi laki-laki: menutup kepala dengan penutup yang melekat"},{"type":"section","heading":"Catatan Penting","body":"- Hindari pertengkaran dan ucapan buruk\n- Jangan menyakiti makhluk\n- Untuk kasus khusus, segera tanyakan pembimbing\n- Detail larangan memiliki ketentuan hukum yang berbeda"}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('adab-tanah-suci', 9, 'Adab di Tanah Suci', 'Kenyamanan bersama adalah bagian dari pelayanan kepada sesama jemaah.', 'mosque', '[{"type":"section","heading":"Ibadah","body":"Jaga shalat, dzikir, membaca Al-Qur’an dan niatkan perjalanan untuk ibadah."},{"type":"section","heading":"Kebersihan","body":"Buang sampah pada tempatnya dan jaga kebersihan kamar serta area masjid."},{"type":"section","heading":"Ketertiban","body":"Ikuti jadwal bus, hotel, makan, ziarah, dan titik kumpul."},{"type":"section","heading":"Keselamatan","body":"Jangan berjalan sendiri tanpa informasi. Simpan identitas dan nomor kontak."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('ziarah-madinah', 10, 'Ziarah Madinah', 'Lakukan ziarah dengan tertib, hormat, dan mengikuti arahan pembimbing.', 'landmark', '[{"type":"section","heading":"Masjid Nabawi","body":"Perbanyak shalat dan ibadah. Jaga suara, antrean, dan aturan yang berlaku di area masjid."},{"type":"section","heading":"Ziarah","body":"Rasulullah ﷺ • Abu Bakar Ash-Shiddiq • Umar bin Khattab • Masjid Quba • Jabal Uhud • lokasi lain sesuai program perjalanan."},{"type":"note","body":"Jadwal dan akses area dapat berubah mengikuti kebijakan setempat."}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO umroh_manasik_materials
  (material_key, sort_order, title, summary, icon_key, content_json, is_published, published_at, created_at, updated_at)
VALUES
  ('tips-perjalanan', 11, 'Tips Selama Perjalanan', 'Ringan, praktis, dan mudah diingat.', 'lightbulb', '[{"type":"tips","items":[{"number":"01","title":"Minum cukup air & jaga stamina","detail":""},{"number":"02","title":"Gunakan alas kaki yang nyaman","detail":""},{"number":"03","title":"Simpan nomor hotel & tour leader","detail":""},{"number":"04","title":"Jangan membawa barang berlebihan","detail":""},{"number":"05","title":"Datang ke titik kumpul tepat waktu","detail":""},{"number":"06","title":"Jika tersesat, tetap tenang dan hubungi rombongan","detail":""}]}]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
