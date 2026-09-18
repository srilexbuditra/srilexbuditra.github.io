# Agenda Management Backend V3.5.0 — Deploy & Test

## URUTAN WAJIB

### 1. Jalankan Migration 005 terlebih dahulu
Buka D1 Console `umroh-semi-private-bengkulu-db`, lalu jalankan isi:

`backend/migrations/005_agenda_management.sql`

Migration menambah:
- `category`
- `ends_at`

Lalu verifikasi:

```sql
PRAGMA table_info(umroh_agenda_events);
```

Target terdapat kolom `category` dan `ends_at`.

Jalankan juga:

```sql
PRAGMA foreign_key_check;
```

Target: tidak ada pelanggaran.

### 2. GitHub
Commit:

`Add Umroh Agenda Management Backend V3.5.0`

Push origin.

### 3. Deploy Worker
Deploy:

`backend/worker/worker.js`

Target `/health`:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.5.0"}
```

## Uji Admin
Buka:

`/program/umroh-semi-private-bengkulu/admin/agenda/`

Target:
- 4 baris agenda lama muncul sebagai belum dipublikasikan
- tombol Tambah Agenda aktif untuk Super Admin/Admin/Tour Leader
- edit salah satu agenda lama
- pastikan judul, tanggal, jam, lokasi, kategori, status sudah benar
- ubah status dari Draft bila perlu
- centang `Publikasikan ke Jemaah`
- simpan

Saran pengujian pertama:
edit baris `manasik-tata-cara` atau agenda lama lain, bukan membuat duplikat, agar event key dan status baca lama tetap tersambung.

## Uji Jemaah
Setelah minimal satu agenda dipublikasikan, buka:

`/program/umroh-semi-private-bengkulu/jamaah/agenda/`

Target:
- banner berubah menjadi `Agenda resmi telah dipublikasikan`
- Data simulasi tidak lagi menjadi sumber list
- judul/waktu/lokasi/status sesuai Admin
- status baca tetap tersimpan ke akun D1

## Uji Dashboard
Dashboard Jemaah dan Admin harus mengambil ringkasan agenda dari backend.

## Catatan
Jangan mempublikasikan baris Draft. Worker menolak publikasi Draft secara server-side.
