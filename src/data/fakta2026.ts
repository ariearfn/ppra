// Ringkasan dokumen internal "Program Kerja Komite PPRA Tahun 2026 – RS Condong Catur"
// (8 halaman, disahkan 30 Januari 2026). Hanya isi dokumen; status pelaksanaan tidak diketahui.

export const DOKUMEN_2026 = {
  judul: 'Program Kerja Komite PPRA Tahun 2026 – RS Condong Catur',
  halaman: 8,
  tanggalPengesahan: '30 Januari 2026',
  ketuaTercantum: 'dr. Prisilia Almiranti',
}

export const TUJUAN_2026 = [
  'Mengendalikan berkembangnya mikroba resisten akibat tekanan seleksi antibiotik melalui penggunaan antibiotik secara bijak.',
  'Mencegah penyebaran mikroba resisten dengan meningkatkan kepatuhan terhadap prinsip PPI.',
]

export const KEGIATAN_POKOK_2026 = {
  a: {
    judul: 'Penggunaan antibiotik secara bijak',
    butir: [
      'Meningkatkan pemahaman dan kepatuhan staf medis serta tenaga kesehatan.',
      'Meningkatkan peran pihak terkait dalam penanganan infeksi dan penggunaan antibiotik.',
      'Mengembangkan fungsi laboratorium mikrobiologi klinik dan laboratorium penunjang.',
      'Meningkatkan peran farmakologi klinik dalam memandu penggunaan antibiotik.',
      'Meningkatkan penanganan kasus infeksi secara multidisiplin.',
      'Melaksanakan surveilans pola penggunaan antibiotik dan melaporkannya berkala.',
      'Melaksanakan surveilans pola mikroba penyebab infeksi dan kepekaannya terhadap antibiotik.',
    ],
  },
  b: {
    judul: 'Pencegahan penyebaran mikroba resisten melalui PPI',
    butir: [
      'Peningkatan kewaspadaan standar.',
      'Pelaksanaan kewaspadaan transmisi.',
      'Dekolonisasi pengidap mikroba resisten sesuai indikasi dan kebijakan klinis.',
      'Penanganan kejadian luar biasa mikroba resisten.',
    ],
  },
}

export const SASARAN_2026 = [
  'Perbaikan kuantitas penggunaan antibiotik.',
  'Perbaikan kualitas penggunaan antibiotik.',
  'Perbaikan pola kepekaan antibiotik dan penurunan pola resistensi antimikroba.',
  'Penurunan infeksi rumah sakit yang disebabkan mikroba multiresisten.',
  'Peningkatan mutu penanganan kasus infeksi secara multidisiplin melalui forum kajian kasus infeksi terintegrasi.',
]

export const JADWAL_2026: { kegiatan: string; jadwal: string }[] = [
  { kegiatan: 'Workshop PPRA', jadwal: 'Januari' },
  { kegiatan: 'Pembentukan Komite PPRA', jadwal: 'Maret' },
  { kegiatan: 'Revisi kebijakan/pedoman/panduan', jadwal: 'Mei' },
  { kegiatan: 'Sosialisasi PPRA', jadwal: 'Juli' },
  { kegiatan: 'Implementasi PPRA', jadwal: 'Maret, Juli, September, Desember' },
  { kegiatan: 'Monitoring dan evaluasi', jadwal: 'Maret, Juli, September, Desember' },
  { kegiatan: 'Penyusunan laporan', jadwal: 'Desember' },
  { kegiatan: 'Rencana tindak lanjut', jadwal: 'Desember' },
  { kegiatan: 'Perencanaan kegiatan PPRA 2027', jadwal: 'Desember' },
]

export const PELAPORAN_2026 = [
  'Pencatatan kegiatan setiap tiga bulan oleh Komite PPRA.',
  'Laporan pelaksanaan tahunan disusun Komite PPRA dan disampaikan kepada Direktur.',
  'Dokumen menyebut Direktur melaporkan bukti laporan PPRA rumah sakit kepada Kementerian Kesehatan satu kali setahun.',
  'Hasil evaluasi disampaikan secara lisan dan tertulis saat koordinasi dengan kepala unit/instalasi setiap tiga bulan.',
  'Evaluasi akhir tahun menjadi dasar penyusunan rencana tindak lanjut.',
]

export const ANGGARAN_2026 = {
  total: 6_600_000,
  rincian: [
    { pos: 'Pelatihan/workshop/seminar SDM', nilai: 6_000_000 },
    { pos: 'Sosialisasi PPRA', nilai: 100_000 },
    { pos: 'Rapat monitoring dan evaluasi', nilai: 400_000 },
    { pos: 'Monitoring dan evaluasi tahunan', nilai: 100_000 },
  ],
  catatan:
    'Anggaran 2026 hanya referensi historis. Jangan menyalin angka tersebut sebagai anggaran 2027 tanpa menghitung ulang kebutuhan, harga, kegiatan, dan persetujuan manajemen.',
}

export const TARGET_MINGGU_PERSIAPAN = [
  'Daftar dokumen dan hasil serah terima dari ketua sebelumnya.',
  'Evaluasi program PPRA 2026 berdasarkan bukti.',
  'Pemetaan kondisi dan kebutuhan unit terkait.',
  'Daftar masalah/gap yang perlu ditangani.',
  'Draft Program Kerja PPRA 2027.',
  'Matriks indikator, target awal, PIC, jadwal, dan kebutuhan anggaran.',
  'Bahan presentasi progress untuk Direktur.',
]

export const PERAN: { pihak: string; peran: string }[] = [
  { pihak: 'Ketua PPRA', peran: 'Menetapkan prioritas, memimpin koordinasi, memantau pelaksanaan, mengevaluasi, dan melaporkan kepada Direktur.' },
  { pihak: 'Dokter/klinisi', peran: 'Penilaian klinis dan evaluasi penggunaan antibiotik.' },
  { pihak: 'Farmasi', peran: 'Data penggunaan antibiotik dan dukungan evaluasi terapi.' },
  { pihak: 'Laboratorium', peran: 'Kultur, identifikasi mikroba, uji kepekaan, dan kualitas data.' },
  { pihak: 'PPI', peran: 'Pencegahan dan pengendalian penyebaran infeksi.' },
  { pihak: 'Keperawatan', peran: 'Pelaksanaan pemberian obat dan praktik PPI.' },
  { pihak: 'Rekam Medis', peran: 'Dukungan data klinis dan dokumentasi.' },
  { pihak: 'IT', peran: 'Dukungan pengolahan/integrasi data dengan pengamanan akses.' },
  { pihak: 'Sekretariat', peran: 'Notulen, dokumentasi, jadwal, dan arsip.' },
  { pihak: 'Direktur/manajemen', peran: 'Pengesahan kebijakan, SK, dukungan SDM, fasilitas, dan anggaran.' },
]

export const LANGKAH_TATA_KELOLA = [
  'Periksa SK Direktur tentang pembentukan Komite PPRA.',
  'Periksa struktur, masa berlaku, dan uraian tugas pengurus.',
  'Diskusikan kebutuhan perubahan struktur dengan Direktur.',
  'Siapkan draft perubahan/pembaruan SK sesuai arahan manajemen.',
  'Pastikan ketua dan anggota memiliki penugasan serta kewenangan yang jelas.',
  'Tetapkan mekanisme rapat, permintaan data, pelaporan, dan tindak lanjut.',
]

export const KERANGKA_PROGRESS: { kode: string; judul: string; isi: string }[] = [
  { kode: 'A', judul: 'Ringkasan eksekutif', isi: 'Status persiapan kepemimpinan dan penyusunan program PPRA 2027.' },
  { kode: 'B', judul: 'Evaluasi program 2026', isi: 'Daftar kegiatan, status, bukti, pencapaian, dan kendala.' },
  { kode: 'C', judul: 'Assessment kondisi rumah sakit', isi: 'Kondisi tata kelola, penggunaan antibiotik, Farmasi, Laboratorium, PPI, dan data pendukung.' },
  { kode: 'D', judul: 'Gap analysis', isi: 'Masalah prioritas, risiko, penyebab yang sudah teridentifikasi, dan kebutuhan perbaikan.' },
  { kode: 'E', judul: 'Rencana program 2027', isi: 'Program, kegiatan, indikator, target, PIC, dan jadwal.' },
  { kode: 'F', judul: 'Rencana anggaran', isi: 'Kebutuhan biaya berdasarkan kegiatan dan justifikasi.' },
  { kode: 'G', judul: 'Dukungan yang dibutuhkan', isi: 'Keputusan Direktur, penetapan SK, penugasan anggota, akses data, dukungan unit, dan anggaran.' },
]

export const AGENDA_PRESENTASI = [
  'Perubahan kepemimpinan dan kebutuhan penguatan Komite PPRA.',
  'Ringkasan evaluasi PPRA 2026.',
  'Kondisi existing berdasarkan assessment.',
  'Gap dan masalah prioritas.',
  'Rancangan program kerja 2027.',
  'KPI dan mekanisme monitoring.',
  'Kebutuhan SDM, fasilitas, dan anggaran.',
  'Keputusan/dukungan yang diminta dari Direktur.',
]
