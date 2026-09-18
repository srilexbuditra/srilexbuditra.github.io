# Departure Event Selection Hotfix V3.5.2 — Deploy & Test

## Deploy
Patch ini frontend-only.

1. Copy isi patch ke repository dan pilih Replace files.
2. Commit:

`Fix Umroh Departure Event Selection V3.5.2`

3. Push origin.
4. Tidak perlu deploy Worker.
5. Worker `/health` tetap boleh menunjukkan `3.5.1`.

## Uji Dashboard Jemaah
Buka:

`/program/umroh-semi-private-bengkulu/jamaah/dashboard/`

Lakukan `Ctrl + F5`.

Target kartu keberangkatan:
- 30 September 2026
- countdown mengikuti tanggal 30 September 2026
- tidak lagi mengambil 29 September 2026 dari Briefing.

## Uji Agenda Jemaah
Buka:

`/program/umroh-semi-private-bengkulu/jamaah/agenda/`

Lakukan `Ctrl + F5`.

Target **Informasi Keberangkatan**:
- Rencana tanggal: 30 Sep 2026
- Waktu: 12:00 WIB
- Titik kumpul: `Titik kumpul akan diinformasikan oleh pengelola`

Agenda `Briefing Keberangkatan` tetap tampil normal sebagai agenda tersendiri pada 29 Sep 2026, 19:30.

## Expected progress
Status baca Agenda tidak diubah oleh hotfix ini. Jika akun sebelumnya 3/4, tetap 3/4 sampai Jemaah menandai agenda keempat sebagai sudah dibaca.
