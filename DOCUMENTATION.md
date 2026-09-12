# Documentation Index — Srilex Buditra Portfolio

Dokumen ini adalah indeks dokumentasi aktif repository `srilexbuditra.github.io`. Gunakan indeks ini untuk membedakan dokumentasi operasional, panduan teknis, audit, dan referensi historis.

**Current documentation baseline:** V11.9  
**Last documentation sync:** 13 September 2026

## 1. Dokumentasi Utama

| Dokumen | Status | Fungsi |
|---|---|---|
| [README.md](README.md) | Active | Gambaran umum website, fitur, struktur repository, dan titik masuk dokumentasi. |
| [CHANGELOG.md](CHANGELOG.md) | Active | Riwayat perubahan website dan modul. |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Active | Indeks dokumentasi repository. |
| [DOCUMENTATION_AUDIT_V11.8.md](DOCUMENTATION_AUDIT_V11.8.md) | Current Audit | Audit dan sinkronisasi dokumentasi terbaru. |
| [DOCUMENTATION_AUDIT_V11.6.md](DOCUMENTATION_AUDIT_V11.6.md) | Historical Audit | Audit dokumentasi baseline V11.6. |
| [ROADMAP-SRILEXBUDITRA-2026-2027.md](ROADMAP-SRILEXBUDITRA-2026-2027.md) | Active | Urutan prioritas pengembangan jangka menengah. |
| [TRUST-AUTHORITY-V8.md](TRUST-AUTHORITY-V8.md) | Active | Catatan implementasi tahap Trust & Authority. |
| [KNOWLEDGE-CENTER-V11.9.md](KNOWLEDGE-CENTER-V11.9.md) | Active | Dokumentasi implementasi Knowledge Center / Insights dan prinsip editorial. |
| [ANALYTICS-V4.md](ANALYTICS-V4.md) | Active | Dokumentasi Analytics V4 berbasis Cloudflare Workers + D1. |

## 2. Program Ketahanan Pangan

| Dokumen | Status | Fungsi |
|---|---|---|
| [program/README.md](program/README.md) | Active | Gambaran umum area `/program/` dan prinsip shared assets/keamanan. |
| [program/ketahanan-pangan/README.md](program/ketahanan-pangan/README.md) | Active | Peta modul dan route Program Ketahanan Pangan. |
| [program/ketahanan-pangan/registrasi/README.md](program/ketahanan-pangan/registrasi/README.md) | Module Reference | Dokumentasi lokal modul registrasi. |
| [program/ketahanan-pangan/registrasi/README-V7-UPLOAD.md](program/ketahanan-pangan/registrasi/README-V7-UPLOAD.md) | Historical/Module Reference | Catatan implementasi upload dokumen pada tahap V7 registrasi. |
| [program/ketahanan-pangan/dokumentasi/README-INSTALL.md](program/ketahanan-pangan/dokumentasi/README-INSTALL.md) | Module Reference | Panduan instalasi halaman dokumentasi program. |

Area publik utama Program Ketahanan Pangan:

- `/program/ketahanan-pangan/` — portal program.
- `/program/ketahanan-pangan/registrasi/` — pendaftaran peserta.
- `/program/ketahanan-pangan/verifikasi/` — pemeriksaan status pendaftaran.
- `/program/ketahanan-pangan/peserta/` — login/aktivasi dan dashboard peserta.
- `/program/ketahanan-pangan/verifikasi/sertifikat/` — verifikasi sertifikat publik.
- `/program/ketahanan-pangan/dokumentasi/` — dokumentasi publik program.
- `/portfolio/ketahanan-pangan/` — flagship case study pada website utama.

Area administrasi tidak diperlakukan sebagai halaman publik untuk indexing dan tidak boleh menjadi tempat penyimpanan secret pada source client-side.

## 3. Trust, Security, Privacy, Legal & Accessibility

| Dokumen | Status | Fungsi |
|---|---|---|
| [TRUST-AUTHORITY-V8.md](TRUST-AUTHORITY-V8.md) | Active | Catatan tahap profil publik, proof of work, dan trust principles. |
| [SECURITY.md](SECURITY.md) | Active | Kebijakan keamanan dan pelaporan kerentanan. |
| [PRIVACY.md](PRIVACY.md) | Active | Kebijakan privasi website. |
| [PRIVACY_CONSENT_FORM.md](PRIVACY_CONSENT_FORM.md) | Reference | Catatan implementasi persetujuan privasi pada form/estimator. |
| [TERMS.md](TERMS.md) | Active | Ketentuan penggunaan. |
| [LICENSE.md](LICENSE.md) | Active | Ketentuan lisensi project. |
| [NOTICE.md](NOTICE.md) | Active | Pemberitahuan hak, aset, dan komponen terkait. |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | Active | Komitmen dan catatan aksesibilitas. |
| [LEGAL_MOBILE_FIX.md](LEGAL_MOBILE_FIX.md) | Historical/Reference | Catatan perbaikan tampilan halaman legal pada mobile. |

## 4. Verification & Secure Document

| Dokumen | Status | Fungsi |
|---|---|---|
| [verify/README.md](verify/README.md) | Active | Ringkasan modul Document Verification. |
| [verify/V30_VERIFICATION_SETUP.md](verify/V30_VERIFICATION_SETUP.md) | Technical Reference | Panduan setup sistem verifikasi/publisher V30. |
| [verify/V31_PUBLISHER_SECURITY.md](verify/V31_PUBLISHER_SECURITY.md) | Security Reference | Catatan hardening publisher/verifikasi. |
| [VERIFY_DATABASE_README.md](VERIFY_DATABASE_README.md) | Active/Reference | Catatan registry/database verifikasi dokumen. |

Implementasi berada pada `verify/`, termasuk registry statis dan source Worker publisher bila digunakan. Secret tidak boleh disimpan di repository publik.

## 5. Analytics

| Dokumen | Status | Fungsi |
|---|---|---|
| [ANALYTICS-V4.md](ANALYTICS-V4.md) | Active | Arsitektur Analytics V4, visitor tracking anonim, dan dashboard statistik. |
| [README-ANALYTICS-V5.md](README-ANALYTICS-V5.md) | Reference | Referensi pengembangan analytics tahap berikut/varian modul. |

## 6. Performance & Asset Architecture

| Dokumen | Status | Fungsi |
|---|---|---|
| [ASSET_ARCHITECTURE_V11.4.md](ASSET_ARCHITECTURE_V11.4.md) | Historical/Reference | Arsitektur aset pada V11.4. |
| [ASSET_OPTIMIZATION_AUDIT.md](ASSET_OPTIMIZATION_AUDIT.md) | Reference | Audit optimasi aset. |
| [PERFORMANCE_V11.5.1.md](PERFORMANCE_V11.5.1.md) | Historical | Catatan optimasi performa V11.5.1. |
| [PERFORMANCE_V11.5.2.md](PERFORMANCE_V11.5.2.md) | Historical | Sinkronisasi implementasi performa V11.5.2. |

## 7. Audit Repository

| Dokumen | Status | Fungsi |
|---|---|---|
| [PUBLIC_REPOSITORY_AUDIT.md](PUBLIC_REPOSITORY_AUDIT.md) | Reference | Audit repository yang dipublikasikan. |
| [AUDIT_MENENGAH_V11.6.md](AUDIT_MENENGAH_V11.6.md) | Historical Audit | Audit teknis tahap menengah baseline V11.6. |
| [DOCUMENTATION_AUDIT_V11.6.md](DOCUMENTATION_AUDIT_V11.6.md) | Historical Audit | Snapshot dokumentasi pada V11.6. |
| [DOCUMENTATION_AUDIT_V11.8.md](DOCUMENTATION_AUDIT_V11.8.md) | Current Audit | Snapshot dokumentasi terbaru dan hasil sinkronisasi. |

## 8. Historical Engineering Notes

`DOCUMENTATION_AUDIT_V11.6.md` mencatat enam engineering notes pernah dipindahkan ke `docs/archive/`. Namun pada snapshot repository yang diaudit untuk V11.8, folder `docs/archive/` dan keenam file tersebut **tidak tersedia**.

Karena file sumbernya tidak ada pada snapshot terbaru, V11.8 tidak membuat ulang isi historis tersebut dan tidak mempertahankan tautan aktif yang rusak. Audit V11.6 tetap disimpan sebagai catatan historis mengenai kondisi repository pada saat audit itu dibuat.

## 9. Portfolio Subprojects

README lokal untuk selected portfolio subprojects:

- [portfolio/aplikasi-pos/README.md](portfolio/aplikasi-pos/README.md)
- [portfolio/sistem-administrasi/README.md](portfolio/sistem-administrasi/README.md)
- [portfolio/website-sekolah/README.md](portfolio/website-sekolah/README.md)
- [portfolio/website-sekolah/README-V2-MAIN.md](portfolio/website-sekolah/README-V2-MAIN.md)
- [portfolio/website-sekolah/v2/README.md](portfolio/website-sekolah/v2/README.md)
- [portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md](portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md)

Flagship `portfolio/ketahanan-pangan/` menggunakan halaman case study publik dan tidak memiliki README terpisah pada snapshot V11.8; konteksnya dirangkum oleh README root dan README Program Ketahanan Pangan.

## 10. GitHub Contribution Templates

File berikut adalah template operasional GitHub, bukan dokumentasi produk:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

## 11. Aturan Pemeliharaan Dokumentasi

1. Update `CHANGELOG.md` jika perubahan memengaruhi versi, fitur, keamanan, performa, UI/UX, arsitektur, atau route publik penting.
2. Update `README.md` jika perubahan memengaruhi gambaran umum fitur, teknologi, struktur project, atau titik masuk sistem.
3. Update README lokal saat modul program berubah secara material.
4. Tambahkan dokumen baru ke `DOCUMENTATION.md` agar indeks tetap sinkron.
5. Jangan mengubah audit versi lama untuk membuatnya seolah-olah menggambarkan kondisi sekarang; buat audit baru.
6. Jangan membuat tautan ke file historis yang tidak terdapat di repository.
7. Jangan menyimpan token, secret, password, private key, data KTP/KK/NIK, atau kredensial layanan pada Markdown/source publik.
8. Dokumentasi tidak boleh mengklaim fitur sebagai live jika fitur tersebut masih roadmap.

## 12. Status Saat Ini

- Flagship Program Ketahanan Pangan: **implemented / public case study tersedia**.
- Profil & Rekam Jejak `/profil/`: **implemented**.
- Trust & Authority V8: **implemented sebagai fondasi**.
- Knowledge Center / Insights: **implemented sebagai foundation pada V11.9**.
- Dashboard V2, Kartu Anggota QR, Level/Poin, Misi, Referral, dan Benefit: **roadmap**, kecuali bagian yang sudah ada dan dinyatakan live pada source terkait.

---

**Documentation baseline:** V11.9 — Knowledge Center Foundation  
**Previous audit baseline:** V11.6  
**Last documentation update:** 13 September 2026
