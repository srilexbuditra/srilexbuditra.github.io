# Keamanan & Persetujuan Privasi — Formulir Estimasi

## Tujuan
Menambahkan gerbang persetujuan privasi pada formulir estimasi agar aksi **Kirim ke WhatsApp** dan **Cetak / Simpan PDF** tidak dapat digunakan sebelum pengunjung memberikan persetujuan.

## Implementasi

### 1. Checkbox HTML
Checkbox ditempatkan di panel hasil estimasi, tepat sebelum tombol aksi:

- ID: `privacyConsentCheckbox`
- Label menjelaskan bahwa pengguna telah membaca dan menyetujui Kebijakan Privasi.
- Tautan diarahkan ke `/privacy.html`.
- Checkbox tidak dicentang secara default.

### 2. Status tombol
Kedua tombol berikut menggunakan atribut `disabled` sejak awal:

- `#waBtn`
- `#pdfBtn`

Atribut `aria-disabled="true"` juga digunakan agar status terkunci dapat dipahami oleh teknologi bantu.

### 3. Kontrol JavaScript
Fungsi `updatePrivacyConsentState()` memeriksa status checkbox:

- Belum dicentang → kedua tombol tetap `disabled`.
- Dicentang → kedua tombol diaktifkan.
- Checkbox diubah → status tombol diperbarui secara langsung.

### 4. Keamanan alur
Event klik untuk WhatsApp dan PDF tetap terpasang pada tombol yang sama. Karena tombol benar-benar menggunakan `disabled`, browser mencegah interaksi klik sebelum persetujuan diberikan.

## File yang diubah

- `index.html`
- `script.js`
- `style.css`
- `PRIVACY_CONSENT_FORM.md`

## Pengujian yang disarankan

1. Buka halaman utama.
2. Gulir ke bagian **Estimate / Hitung Estimasi**.
3. Pastikan checkbox belum dicentang saat pertama kali tampil.
4. Pastikan **Kirim ke WhatsApp** dan **Cetak / Simpan PDF** dalam keadaan terkunci.
5. Centang checkbox.
6. Pastikan kedua tombol langsung aktif.
7. Hapus centang kembali.
8. Pastikan kedua tombol langsung terkunci kembali.
9. Uji pada desktop dan mobile untuk memastikan layout checkbox tidak keluar batas.
