# Visual Sitemap — Website V11.7

> Status: **Current development — Analytics V4**  
> Tujuan: dokumentasi arsitektur halaman tanpa mengubah visual/layout website produksi.

## Prinsip

Visual Sitemap ini merupakan dokumentasi repository. File ini **tidak mengganti `sitemap.xml`** dan tidak menambahkan elemen baru ke halaman produksi. Tampilan website V11.7 tetap dipertahankan.

## Struktur

```mermaid
flowchart TD
    ROOT["srilexbuditra.work"]

    ROOT --> PUBLIC["Public / Root"]
    ROOT --> PORT["Portfolio"]
    ROOT --> VERIFY["Document Verification"]
    ROOT --> ADMIN["Admin / Analytics V4"]

    PUBLIC --> HOME["/"]
    PUBLIC --> SEARCH["/search.html"]
    PUBLIC --> PRIVACY["/privacy.html"]
    PUBLIC --> TERMS["/terms.html"]
    PUBLIC --> SECURITY["/security.html"]
    PUBLIC --> ERR404["/404.html"]
    PUBLIC --> LEGACY["/term.html → /terms.html"]

    PORT --> POS["/portfolio/aplikasi-pos/"]
    POS --> POSDETAIL["detail.html"]
    PORT --> ADMINSYS["/portfolio/sistem-administrasi/"]
    ADMINSYS --> ADMINDETAIL["detail.html"]
    PORT --> SCHOOL["/portfolio/website-sekolah/"]
    SCHOOL --> SCHOOLDETAIL["detail.html"]
    SCHOOL --> PROJECTDETAIL["project-detail.html"]
    SCHOOL --> SCHOOLV2["v2/"]
    SCHOOLV2 --> SCHOOLV2DETAIL["detail.html"]
    SCHOOL --> TJKT["tjkt-smkn1kotabengkulu/"]

    VERIFY --> VINDEX["/verify/"]
    VERIFY --> VDOC["verify.html"]
    VERIFY --> VPUBLISH["publisher.html"]
    VERIFY --> VINVALID["invalid.html"]
    VERIFY --> VWORKER["Cloudflare Worker + KV"]

    ADMIN --> STATS["/admin/stats.html"]
    ADMIN --> API["/visitor + /stats"]
    ADMIN --> D1["Cloudflare D1"]
```

## Kelompok halaman

**Public / Root** mencakup beranda, pencarian, Privacy, Terms, Security, 404, serta `term.html` sebagai halaman legacy yang mengarah ke `terms.html`.

**Portfolio** berisi demo Aplikasi POS, Sistem Administrasi, Website Sekolah, versi V2, project detail, dan TJKT SMKN 1 Kota Bengkulu. Halaman 404 pada subfolder tetap dipertahankan sebagai fallback.

**Document Verification** mencakup halaman masuk verifikasi, pemeriksaan Document ID/QR, Publisher, invalid state, serta backend Cloudflare Worker + KV.

**Admin / Analytics V4** mencakup dashboard `admin/stats.html`, endpoint analytics `/visitor` dan `/stats`, serta penyimpanan Cloudflare D1.

## Visual

File diagram pendamping:

`visual-sitemap-v11.7.svg`

Palet visual mengikuti website saat ini:
- Background: `#020f1c`
- Panel: `#06243a`
- Gold: `#ffb51b`
- Cyan: `#22c5ee`
- Green: `#00d86a`
- Text: `#f7fbff`

## Versioning

- **V11.6** — baseline stabil/historical audit.
- **V11.7** — current development, dimulai dengan Analytics V4 dan dokumentasi Visual Sitemap.
