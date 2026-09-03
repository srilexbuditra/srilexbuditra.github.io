# V7 — Mobile Contract Signature Refinement

- Tanda tangan Pihak Pertama tidak lagi diinput pengguna; menggunakan aset digital `assets/signature-provider.svg`.
- Tanda tangan Pihak Kedua tetap wajib digambar pada signature pad.
- Signature pad menggunakan Pointer Events, pointer capture, `touch-action: none`, DPR-aware canvas sizing, dan ResizeObserver agar responsif pada layar sentuh.
- Modal perjanjian dibuat mobile-first dengan tinggi viewport dinamis (`100dvh`), tanpa horizontal overflow, dan kontrol aksi yang mudah disentuh.
- Gate persetujuan hanya membutuhkan tanda tangan Pihak Kedua karena Pihak Pertama menggunakan tanda tangan digital yang telah disiapkan.
- PDF tetap menampilkan tanda tangan digital Pihak Pertama dan tanda tangan Pihak Kedua dari canvas.
