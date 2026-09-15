# V13.6.14.5 — Visual Viewport Consent Lock

- Mobile consent menggunakan `window.visualViewport` untuk menghitung posisi aktual.
- Mengatasi card yang masih bergeser akibat perbedaan layout viewport dan visual viewport.
- Posisi disinkronkan ulang pada resize, perubahan orientasi, dan perubahan visual viewport.
- CSS `100dvw` tetap digunakan sebagai fallback.
- Desktop, TTS, context-aware text, dan Consent Mode tidak diubah.
