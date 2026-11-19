export interface PanduanUnit {
  id: string
  unit: string
  mengapa: string
  informasi: string[]
  kegiatan: string[]
  output: string[]
  catatan?: string
}

// Isi informasi yang diminta bersumber dari brief Hari 3 dan pembagian peran; selebihnya rekomendasi.
export const KOORDINASI: PanduanUnit[] = [
  {
    id: 'direktur',
    unit: 'Direktur / Manajemen',
    mengapa:
      'Direktur mengesahkan SK, kebijakan, dan anggaran. Tanpa mandat formal, permintaan lintas unit dari Ketua PPRA tidak memiliki dasar kewenangan.',
    informasi: [
      'Status SK Komite PPRA dan mekanisme penetapan ketua baru.',
      'Arahan prioritas rumah sakit untuk 2027.',
      'Besaran dan mekanisme persetujuan anggaran 2027.',
      'Jadwal presentasi progress (target awal Desember 2026).',
    ],
    kegiatan: [
      'Audiensi awal mengenai pergantian kepemimpinan.',
      'Presentasi progress persiapan dan draft program kerja 2027.',
      'Penyampaian laporan triwulan dan laporan tahunan.',
    ],
    output: ['SK Komite PPRA terbaru', 'Persetujuan program kerja dan anggaran 2027', 'Arahan dan keputusan tertulis'],
    catatan: 'Siapkan daftar keputusan yang diminta secara spesifik agar pertemuan efisien.',
  },
  {
    id: 'farmasi',
    unit: 'Instalasi Farmasi',
    mengapa: 'Farmasi memegang data penggunaan antibiotik dan berperan dalam dukungan evaluasi terapi.',
    informasi: [
      'Rekap antibiotik: jenis dan jumlah pemakaian.',
      'Pola penggunaan per unit/periode yang dapat ditarik.',
      'Kemampuan pelaporan (format, periode, sistem yang digunakan).',
      'Formularium yang berlaku dan status panduan antibiotik.',
    ],
    kegiatan: ['Pemantauan kuantitas penggunaan antibiotik', 'Audit kualitas penggunaan bersama klinisi', 'Review panduan antibiotik'],
    output: ['Rekap penggunaan antibiotik berkala', 'Hasil audit dan umpan balik', 'Masukan revisi panduan'],
  },
  {
    id: 'lab',
    unit: 'Laboratorium',
    mengapa: 'Data kultur, identifikasi mikroba, dan uji kepekaan adalah dasar surveilans resistansi dan antibiogram.',
    informasi: [
      'Jenis pemeriksaan kultur yang tersedia.',
      'Kemampuan identifikasi mikroba dan uji kepekaan (sendiri atau laboratorium rujukan).',
      'Alur pelaporan hasil ke klinisi.',
      'Ketersediaan rekap data dan apakah antibiogram pernah dibuat.',
    ],
    kegiatan: ['Rekap dan validasi data kultur dan uji kepekaan', 'Penilaian kelayakan penyusunan antibiogram', 'Pelaporan surveilans'],
    output: ['Rekap data tervalidasi', 'Laporan surveilans resistansi', 'Antibiogram (bila data memenuhi syarat)'],
  },
  {
    id: 'ppi',
    unit: 'Komite/Tim PPI',
    mengapa: 'Pencegahan penyebaran mikroba resisten dilakukan melalui penerapan PPI; ini tujuan kedua program PPRA.',
    informasi: [
      'Program dan hasil monitoring PPI.',
      'Data hand hygiene dan kewaspadaan isolasi.',
      'Data kejadian infeksi, termasuk oleh mikroba multiresisten.',
    ],
    kegiatan: ['Rapat koordinasi PPRA–PPI berkala', 'Monitoring kewaspadaan standar dan transmisi', 'Tindak lanjut temuan mikroba multiresisten'],
    output: ['Notulen rapat bersama', 'Rencana tindak lanjut temuan', 'Data pendukung indikator'],
  },
  {
    id: 'klinisi',
    unit: 'Dokter / Klinisi (KSM)',
    mengapa: 'Keputusan penggunaan antibiotik ada pada klinisi. Penilaian klinis dan evaluasi penggunaan antibiotik memerlukan keterlibatan mereka.',
    informasi: [
      'Panduan terapi yang digunakan saat ini.',
      'Proses evaluasi antibiotik yang sudah berjalan.',
      'Kendala klinis dalam penerapan panduan.',
    ],
    kegiatan: ['Review panduan antibiotik', 'Audit penggunaan antibiotik', 'Forum kajian kasus infeksi multidisiplin'],
    output: ['Masukan klinis untuk panduan', 'Reviewer audit', 'Rekomendasi forum kajian kasus'],
    catatan: 'Keputusan klinis dan kebijakan antibiotik ditetapkan oleh tenaga klinis/farmasi yang berwenang, bukan oleh aplikasi ini.',
  },
  {
    id: 'keperawatan',
    unit: 'Keperawatan',
    mengapa: 'Perawat melaksanakan pemberian obat dan praktik PPI sehari-hari.',
    informasi: ['Proses pemberian antibiotik.', 'Dokumentasi pemberian obat.', 'Kepatuhan PPI di ruang perawatan.'],
    kegiatan: ['Edukasi PPRA bagi perawat', 'Dukungan dokumentasi untuk audit'],
    output: ['Dokumentasi pemberian antibiotik yang lengkap', 'Peserta edukasi dari unit perawatan'],
  },
  {
    id: 'rm',
    unit: 'Rekam Medis',
    mengapa: 'Audit penggunaan antibiotik memerlukan data diagnosis, perawatan, dan terapi yang tercatat.',
    informasi: ['Ketersediaan data diagnosis, perawatan, dan terapi untuk audit.', 'Data pasien-hari (bila diperlukan metode yang dipilih).', 'Prosedur akses data sesuai kerahasiaan pasien.'],
    kegiatan: ['Penyediaan sampel rekam medis untuk audit sesuai prosedur'],
    output: ['Data pendukung audit', 'Prosedur akses data yang disepakati'],
    catatan: 'Penggunaan data harus sesuai kewenangan, kebutuhan program, dan ketentuan kerahasiaan pasien.',
  },
  {
    id: 'it',
    unit: 'Instalasi IT / SIMRS',
    mengapa: 'Pengumpulan data yang konsisten memerlukan dukungan ekstraksi dan pengolahan data dari sistem informasi RS.',
    informasi: ['Kemampuan ekstraksi data penggunaan obat dan hasil laboratorium.', 'Kemungkinan integrasi data.', 'Ketentuan keamanan dan hak akses data.'],
    kegiatan: ['Penyusunan format laporan dari SIMRS', 'Pengaturan hak akses data Komite PPRA'],
    output: ['Laporan data berkala dari sistem', 'Hak akses yang aman dan terdokumentasi'],
  },
  {
    id: 'mutu',
    unit: 'Unit / Komite Mutu',
    mengapa: 'Indikator PPRA terkait dengan indikator mutu RS dan mekanisme pelaporan internal maupun eksternal.',
    informasi: ['Indikator mutu RS yang terkait PPRA.', 'Mekanisme dan jadwal pelaporan.', 'Dukungan kebijakan dan anggaran.'],
    kegiatan: ['Penyelarasan indikator PPRA dengan indikator mutu RS', 'Pelaporan berkala'],
    output: ['Daftar indikator yang disepakati', 'Jadwal pelaporan yang terintegrasi'],
  },
]
