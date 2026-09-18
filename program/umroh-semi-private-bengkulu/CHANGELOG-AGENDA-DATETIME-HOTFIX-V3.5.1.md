# CHANGELOG — Agenda Date/Time Hotfix V3.5.1

## Fixed
- Edit Agenda tidak lagi menulis ulang `starts_at` jika tanggal/jam tidak berubah.
- Edit lokasi, judul, status, catatan, atau publikasi tidak boleh mengubah waktu agenda secara diam-diam.
- Parser form memprioritaskan nilai ISO `+07:00` secara literal sebelum fallback `Intl`.
- `ends_at` sekarang dapat dikosongkan secara eksplisit melalui PATCH.
- Backend membedakan field tanggal/jam yang tidak dikirim dengan field yang sengaja dikosongkan.
- Backend hanya menerima format agenda `YYYY-MM-DDTHH:mm:ss+07:00`.
- Agenda yang dipublikasikan wajib memiliki `starts_at`.
- Audit update menyimpan nilai waktu sebelum/sesudah.

## Database
Tidak ada migration D1 baru.
