# PPRA 2027 Management Kit – RS Condong Catur

Aplikasi web (Bahasa Indonesia) untuk membantu Ketua Komite PPRA menyiapkan serah terima, evaluasi program 2026, gap analysis, dan Program Kerja PPRA 2027. Alat bantu administratif, **bukan** pedoman klinis.

- Data disimpan di browser (localStorage); tanpa login dan tanpa server. Cadangan/pemulihan JSON tersedia di menu *Profil & Data*.
- Label sumber: **Fakta – Dok. RSCC 2026**, **Regulasi terverifikasi**, **Rekomendasi**, **Perlu konfirmasi**, **Ilustrasi**.
- Dokumen (PDF/DOCX/XLSX) dibuat langsung di browser dari data terkini (menu *Unduh Dokumen*) atau lewat skrip.

## Menjalankan

Butuh Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # hasil statis di dist/ (dapat dibuka dari server statis apa pun)
npm run docs         # buat 4 dokumen dari isi awal ke output/
npm run docs -- cadangan.json --out folder   # buat dokumen dari file cadangan aplikasi
```

## Struktur

```
src/
  data/        isi: fakta dok. 2026, persiapan 7 hari, gap, program, timeline, KPI,
               koordinasi, panduan, pelaporan, regulasi (regulasi-ppra.json hasil verifikasi)
  state/       state aplikasi + penyimpanan localStorage
  components/  komponen UI (field editable, badge sumber, layout, lampiran tabel)
  pages/       satu file per menu
  export/      generator dokumen (dipakai browser dan skrip Node)
scripts/generate-docs.ts
```

## Dokumen yang dihasilkan

| File | Isi |
|---|---|
| `Panduan_Ketua_PPRA_2027.pdf` | Panduan 25 halaman: PPRA, peran ketua, ringkasan 2026, checklist 7 hari, evaluasi, koordinasi, gap, program, KPI, timeline, pelaporan, regulasi, glosarium |
| `Program_Kerja_PPRA_2027.docx` | Format formal RS, dapat diedit; isian kosong ditandai `[Perlu konfirmasi]` (sorotan kuning) |
| `Tracker_PPRA_2027.xlsx` | Kegiatan & timeline, checklist, evaluasi 2026, gap, KPI per triwulan, anggaran (rumus), konfirmasi, regulasi |
| `Progress_Report_PPRA_2027.pdf` | Laporan eksekutif A–G untuk Direktur |

Status regulasi mengikuti verifikasi per 19 November 2026; cek ulang di JDIH Kemenkes sebelum program disahkan.
