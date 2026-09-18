# CHANGELOG — Dashboard Progress Backend V3.4.6

## Added
- `GET /jamaah/progress/summary`
- Agregasi progress resmi di Worker dari empat sumber backend:
  - Manasik: `umroh_progress_items`
  - Checklist: `umroh_progress_items`
  - Dokumen: `umroh_document_status` + current file metadata
  - Agenda: `umroh_agenda_reads`
- Dashboard total tidak lagi menghitung progress dari localStorage.

## Formula
Bobot tetap:
- Manasik 35%
- Checklist 35%
- Dokumen 20%
- Agenda 10%

Definisi kesiapan:
- Manasik: status `complete`
- Checklist: `complete` atau `not_applicable`
- Dokumen: hanya `admin_status = verified`
- Agenda: event yang sudah dibaca

## Changed
- Worker menjadi `3.4.6`.
- `jamaah-overall-progress.js` membaca satu endpoint backend.
- Quick card Checklist membaca D1 langsung.
- Label Dokumen pada Dashboard menjadi `terverifikasi`, bukan `siap`, agar sesuai sumber resmi Admin.

## Database
Tidak ada migration D1 baru.
