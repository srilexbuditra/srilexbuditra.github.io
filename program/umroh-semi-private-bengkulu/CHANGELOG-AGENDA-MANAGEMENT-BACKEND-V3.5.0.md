# CHANGELOG — Agenda Management Backend V3.5.0

## Added
- Migration `005_agenda_management.sql`
- Admin page `/admin/agenda/`
- `GET /admin/agenda`
- `POST /admin/agenda`
- `PATCH /admin/agenda/:id`
- `GET /jamaah/agenda`
- Audit log: `agenda_created`, `agenda_updated`, `agenda_published`, `agenda_unpublished`
- Field Agenda: kategori dan waktu selesai
- Admin dapat membuat/edit status/publikasi Agenda
- Jemaah otomatis membaca agenda resmi dari D1 setelah dipublikasikan
- Admin Dashboard menampilkan agenda resmi mendatang dari D1

## Roles
- Super Admin: lihat + buat + edit + publikasi
- Admin: lihat + buat + edit + publikasi
- Tour Leader: lihat + buat + edit + publikasi
- Pendamping: lihat saja

## Compatibility
Empat agenda simulasi lama tetap dipertahankan sebagai baris D1 yang belum dipublikasikan.
Admin dapat mengedit baris lama tersebut lalu mempublikasikannya agar histori status baca dengan event key yang sama tetap terjaga.

## Fallback
Jika belum ada agenda yang dipublikasikan, halaman Jemaah tetap memakai data simulasi V2.2.
Begitu minimal satu agenda resmi dipublikasikan, sumber halaman beralih ke D1 resmi.
