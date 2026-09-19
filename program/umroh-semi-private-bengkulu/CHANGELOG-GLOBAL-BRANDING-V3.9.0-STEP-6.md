# Global Branding — V3.9.0 Step 6

Status platform tetap **V3.8.0** selama rollout V3.9.0 belum dikunci penuh.

## Ditambahkan
- Tab **Branding** pada Admin → Pengaturan → SEO & Media Publik.
- Penyimpanan konfigurasi global pada `umroh_brand_settings`.
- URL branding permanen di jalur `/program/umroh-semi-private-bengkulu/branding/`.
- Upload logo AVIF ke R2 `PUBLIC_MEDIA` dengan object key permanen.
- Pembuatan favicon 16/32, Apple Touch Icon 180, Android 192/512 dan ICO di browser Admin dari satu logo AVIF.
- `site.webmanifest` dinamis dari D1 melalui Worker ketika route branding diaktifkan.
- Fallback aset branding statis agar logo/favicons tetap tersedia sebelum R2 berisi object permanen.
- Favicon dan webmanifest dipasang pada seluruh 30 halaman Platform Umroh.
- Placeholder brand mark lama diganti secara visual dengan logo global melalui `assets/css/branding.css`.

## Keamanan
- Hanya `super_admin` yang dapat mengubah konfigurasi dan media Branding Global.
- Upload dibatasi maksimal 5 MB.
- Logo utama hanya AVIF; ikon hanya PNG; favicon ICO divalidasi dengan signature ICO.
- Object key branding tidak berasal dari nama file pengguna dan tidak dapat diarahkan keluar prefix `branding/`.

## URL permanen
- `/program/umroh-semi-private-bengkulu/branding/logo-umroh-semi-private-bengkulu.avif`
- `/program/umroh-semi-private-bengkulu/branding/favicon.ico`
- `/program/umroh-semi-private-bengkulu/branding/favicon-32x32.png`
- `/program/umroh-semi-private-bengkulu/branding/favicon-16x16.png`
- `/program/umroh-semi-private-bengkulu/branding/apple-touch-icon.png`
- `/program/umroh-semi-private-bengkulu/branding/android-chrome-192x192.png`
- `/program/umroh-semi-private-bengkulu/branding/android-chrome-512x512.png`
- `/program/umroh-semi-private-bengkulu/branding/site.webmanifest`
