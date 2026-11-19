import type { Kpi, KategoriKpi } from '../types'

export const TARGET_FALLBACK = 'Perlu konfirmasi (baseline RS)'

const k = (
  id: string,
  kategori: KategoriKpi,
  nama: string,
  definisi: string,
  sumberData: string,
  pic: string,
  frekuensi: string,
  rujukan: string,
  catatan = '',
): Kpi => ({
  id,
  kategori,
  nama,
  definisi,
  baseline: '',
  target: '',
  capaian: '',
  sumberData,
  pic,
  frekuensi,
  catatan,
  rujukan,
})

// Kategori "wajib" hanya untuk kewajiban yang dasar regulasinya terverifikasi (regulasi-ppra.json).
// Tidak ada regulasi yang menetapkan angka target; semua target ditetapkan RS dari baseline.
export const DEFAULT_KPI: Kpi[] = [
  k('kpi-w1', 'wajib', 'Kuantitas penggunaan antibiotik', 'Audit kuantitas penggunaan antibiotik dengan metode ATC/DDD per 100 patient-days sesuai Lampiran Permenkes 8/2015.', 'Farmasi; Rekam Medis (data pasien-hari)', 'Farmasi', 'Berkala (frekuensi ditetapkan RS)', 'Permenkes 8/2015 Ps.10(2), Ps.11 & Lampiran'),
  k('kpi-w2', 'wajib', 'Kualitas penggunaan antibiotik', 'Audit kualitas penggunaan antibiotik dengan metode Gyssens sesuai Lampiran Permenkes 8/2015, dilakukan oleh tenaga klinis/farmasi berwenang.', 'Hasil audit Farmasi dan klinisi', 'Klinisi + Farmasi', 'Berkala (frekuensi ditetapkan RS)', 'Permenkes 8/2015 Ps.10(2), Ps.11 & Lampiran'),
  k('kpi-w3', 'wajib', 'Pola kepekaan antibiotik dan pola resistansi', 'Perbaikan pola kepekaan dan penurunan pola resistansi berdasarkan data surveilans; antibiogram RS diperbarui setiap tahun.', 'Laboratorium', 'Laboratorium', 'Tahunan (antibiogram)', 'Permenkes 8/2015 Ps.11 & Lampiran', 'Penyusunan antibiogram bergantung pada jumlah dan kualitas data.'),
  k('kpi-w4', 'wajib', 'Infeksi rumah sakit akibat mikroba multiresisten (MDRO)', 'Surveilans MDRO (ESBL/MRSA; atau MDR bila laboratorium belum mampu) dan angka infeksi RS akibat MDRO.', 'PPI; Laboratorium', 'PPI + Laboratorium', 'Berkala', 'Permenkes 8/2015 Ps.10(3), Ps.11; KMK 1596/2024 PROGNAS 6'),
  k('kpi-w5', 'wajib', 'Forum kajian kasus infeksi terintegrasi (FORKKIT)', 'Peningkatan mutu penanganan kasus infeksi secara multidisiplin melalui FORKKIT; notulen dan rekomendasi terdokumentasi.', 'Notulen forum', 'Komite PPRA', 'Berkala', 'Permenkes 8/2015 Ps.9e, Ps.11; KMK 1596/2024 PROGNAS 6'),
  k('kpi-w6', 'wajib', 'SK Komite/Tim PPRA', 'SK Direktur memuat uraian tugas, tanggung jawab, wewenang, dan program kerja; minimal unsur klinisi KSM, keperawatan, farmasi, laboratorium mikrobiologi klinik, PPI, dan KFT; ketua klinisi yang berminat di bidang infeksi.', 'Sekretariat', 'Ketua PPRA / Direktur', 'Sesuai masa berlaku SK', 'Permenkes 8/2015 Ps.7–8; KMK 1596/2024 PROGNAS 6 EP2'),
  k('kpi-w7', 'wajib', 'Edukasi/pelatihan PPRA', 'Edukasi/pelatihan PPRA bagi tenaga kesehatan, staf, serta pasien dan keluarga.', 'Materi, daftar hadir', 'Komite PPRA', 'Berkala', 'Permenkes 8/2015 Ps.9h; KMK 1596/2024 PROGNAS 6'),
  k('kpi-w8', 'wajib', 'Monev dan laporan berkala kepada Direktur', 'Monitoring dan evaluasi kegiatan PPRA dan indikator PGA, dilaporkan secara berkala kepada Direktur.', 'Arsip laporan', 'Ketua PPRA', 'Berkala; minimal tahunan', 'Permenkes 8/2015 Ps.9j; KMK 1596/2024 PROGNAS 6 EP4–5, PROGNAS 6.1 EP4'),
  k('kpi-w9', 'wajib', 'Laporan tahunan RS kepada Kemenkes', 'Laporan tahunan Direktur kepada Menteri c.q. KPRA (tembusan Dinkes Provinsi dan Kab/Kota) melalui aplikasi nasional.', 'Bukti unggah di aplikasi nasional', 'Direktur (disiapkan Komite PPRA)', 'Tahunan', 'Permenkes 8/2015 Ps.12; KMK 1596/2024 PROGNAS 6 EP5', 'Tenggat dan kanal pelaporan Perlu konfirmasi (31 Agustus menurut SE 44930/2024 – naskah resmi belum ditemukan).'),
  k('kpi-u1', 'usulan', 'Rapat Komite PPRA terlaksana sesuai jadwal', 'Jumlah rapat terlaksana dan bernotulen dibanding jadwal yang ditetapkan komite.', 'Notulen rapat', 'Sekretariat', 'Triwulan', 'Usulan komite'),
  k('kpi-u2', 'usulan', 'Unit sasaran yang menerima sosialisasi PPRA', 'Jumlah unit sasaran yang telah menerima sosialisasi dibanding unit sasaran yang ditetapkan.', 'Daftar hadir sosialisasi', 'Komite PPRA', 'Tahunan/berkala', 'Brief Hari 6', 'Target ditentukan setelah pemetaan unit.'),
  k('kpi-u3', 'usulan', 'Rekap penggunaan antibiotik tersedia tepat waktu', 'Rekap penggunaan antibiotik tersedia untuk setiap periode yang ditetapkan.', 'Farmasi', 'Farmasi', 'Berkala', 'Brief Hari 6'),
  k('kpi-u4', 'usulan', 'Proporsi penggunaan antibiotik kelompok Access (AWaRe)', 'Proporsi penggunaan antibiotik kelompok Access berdasarkan pengelompokan AWaRe nasional (Permenkes 28/2021). Angka target global belum diverifikasi dan bukan target regulasi.', 'Farmasi', 'Farmasi', 'Berkala', 'Usulan; pengelompokan menurut Permenkes 28/2021'),
  k('kpi-u5', 'usulan', 'Survei prevalensi penggunaan antimikroba (AMU-PPS)', 'Pelaksanaan survei prevalensi waktu tertentu sesuai pedoman Kemenkes 2025, bila relevan dengan layanan RS.', 'Hasil survei', 'Komite PPRA + Farmasi', 'Sesuai periode pedoman', 'Pedoman AMU-PPS 2025 (pedoman teknis, tidak ditemukan keputusan yang mewajibkan)'),
  k('kpi-u6', 'usulan', 'Kualitas manajemen data surveilans', 'Ketepatan pelaporan, kelengkapan data, dan pemanfaatan data di rapat PPI/PPRA.', 'Laboratorium; Komite PPRA', 'Laboratorium', 'Berkala', 'Usulan mengacu metode Kepdirjen Keslan 1476/2026'),
  k('kpi-u7', 'usulan', 'Hasil monitoring PPI dibahas dan ditindaklanjuti', 'Hasil monitoring PPI yang dibahas bersama dan tindak lanjutnya terdokumentasi.', 'PPI', 'PPI', 'Berkala', 'Brief Hari 6', 'Mengikuti indikator PPI RS.'),
  k('kpi-u8', 'usulan', 'Proyek percontohan PPRA di satu ruang rawat', 'Penerapan PPRA pada satu ruang rawat sebagai langkah awal sebelum perluasan.', 'Laporan percontohan', 'Komite PPRA', 'Sekali/berkala', 'Usulan; instrumen survei akreditasi memperbolehkan pilot satu ruang rawat'),
]
