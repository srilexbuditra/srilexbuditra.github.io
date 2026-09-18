# Dashboard Progress Backend V3.4.6 — Deploy & Test

## Tidak ada migration D1 baru

## 1. GitHub
Commit:

`Add Umroh Dashboard Progress Backend V3.4.6`

## 2. Worker
Deploy:

`backend/worker/worker.js`

Target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.6"}
```

## 3. Uji endpoint dari Dashboard
Login sebagai `SIM-0001`, lalu buka Dashboard Jemaah.

Untuk kondisi pengujian terakhir yang sudah diverifikasi:
- Manasik: 2 / 11
- Checklist: 4 / 12
- Dokumen terverifikasi: 1 / 4
- Agenda dibaca: 3 / 4

Dengan bobot 35 / 35 / 20 / 10, target total sekitar:

`31%`

Rincian yang diharapkan:
- Manasik: 18%
- Checklist: 33%
- Dokumen: 25%
- Agenda: 75%

Jika data berubah sebelum tes, total juga akan berubah sesuai data backend terbaru.

## 4. Uji lintas perangkat
1. Buka Dashboard pada laptop.
2. Buka Dashboard pada HP dengan akun yang sama.
3. Nilai total dan empat komponen harus sama.
4. Ubah salah satu progress (Manasik / Checklist / Agenda) pada salah satu perangkat.
5. Kembali ke Dashboard perangkat lain dan refresh.

Target: Dashboard mengikuti backend tanpa perlu menyamakan localStorage.

## 5. Catatan Dokumen
Progress Dokumen pada Dashboard menggunakan jumlah `Terverifikasi` oleh Admin.
Dokumen yang hanya terunggah atau masih `Menunggu verifikasi` belum menambah bobot Dokumen.

## 6. Agenda
Status baca sudah backend.
Isi/tanggal/lokasi Agenda masih simulasi V2.2 sampai modul Admin Agenda resmi dibuat.
