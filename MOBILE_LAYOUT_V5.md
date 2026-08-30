# Mobile Layout V5

Perbaikan utama untuk homepage:
- Full-width mobile container yang tidak bergeser/terpotong.
- Overflow horizontal dipotong dengan aman (`overflow-x: clip`).
- Header mobile lebih ringkas dengan menu yang benar-benar memenuhi viewport.
- Search bar fleksibel dan tidak mendorong layout melebar.
- Hero typography, CTA, portrait, statistik, cards, portfolio, pricing, estimator, process, CTA dan footer dioptimalkan untuk layar kecil.
- Semua grid memakai `minmax(0, 1fr)` pada breakpoint mobile agar konten tidak memaksa lebar kolom.
- Safe-area viewport ditambahkan ke `index.html`.
