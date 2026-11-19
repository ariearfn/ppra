export interface HariPersiapan {
  hari: number
  judul: string
  tujuan: string
  tugas: { id: string; teks: string }[]
  pihak: string[]
  dokumen: string[]
  deliverable: { id: string; teks: string }[]
  pertanyaan?: string[]
  catatanPenting?: string
}

const t = (hari: number, items: string[], prefix = 't') =>
  items.map((teks, i) => ({ id: `d${hari}-${prefix}${i + 1}`, teks }))

export const PERSIAPAN: HariPersiapan[] = [
  {
    hari: 1,
    judul: 'Serah terima dan pengumpulan dokumen',
    tujuan: 'Memahami kondisi program sebelum mengambil alih kepemimpinan Komite PPRA.',
    tugas: t(1, [
      'Menjadwalkan pertemuan serah terima dengan ketua sebelumnya (dr. Prisilia Almiranti).',
      'Menghubungi sekretariat rumah sakit untuk arsip SK dan dokumen Komite PPRA.',
      'Mengumpulkan dokumen sesuai daftar di bawah dan mencatat yang belum ditemukan.',
      'Mengajukan 8 pertanyaan serah terima dan mencatat jawabannya.',
      'Menanyakan kepada Direktur/manajemen mekanisme penetapan SK ketua baru.',
      'Menyusun catatan serah terima dan daftar informasi yang belum tersedia.',
    ]),
    pihak: ['Ketua PPRA sebelumnya', 'Sekretariat rumah sakit', 'Direktur/manajemen (untuk status SK)'],
    dokumen: [
      'SK Direktur tentang pembentukan Komite PPRA',
      'SK dan struktur kepengurusan yang berlaku',
      'Uraian tugas anggota',
      'Program Kerja PPRA 2026',
      'Kebijakan, pedoman, panduan, dan SOP penggunaan antibiotik',
      'Laporan monitoring dan evaluasi',
      'Notulen rapat PPRA',
      'Bukti workshop, pelatihan, dan sosialisasi',
      'Data penggunaan antibiotik dari Farmasi',
      'Data kultur dan uji kepekaan dari Laboratorium',
      'Data/laporan terkait PPI',
      'Laporan yang pernah disampaikan kepada Direktur atau pihak eksternal',
    ],
    pertanyaan: [
      'Kegiatan apa yang benar-benar sudah dilaksanakan?',
      'Apa bukti dokumentasi masing-masing kegiatan?',
      'Kegiatan apa yang belum berjalan dan mengapa?',
      'Apakah audit penggunaan antibiotik pernah dilakukan?',
      'Apakah data kultur dan sensitivitas sudah direkap?',
      'Apakah pernah dibuat antibiogram rumah sakit?',
      'Apa kendala koordinasi antarunit?',
      'Adakah tindak lanjut atau komitmen yang masih berjalan?',
    ],
    deliverable: t(1, ['Daftar dokumen (ada/tidak ada)', 'Catatan serah terima', 'Daftar informasi yang belum tersedia'], 'o'),
    catatanPenting:
      'Penunjukan lisan tidak otomatis menggantikan SK formal. Pastikan kejelasan mandat sebelum meminta unit lain menjalankan tugas lintas unit.',
  },
  {
    hari: 2,
    judul: 'Evaluasi program 2026',
    tujuan: 'Mencocokkan jadwal program 2026 dengan bukti pelaksanaan, bukan perkiraan.',
    tugas: t(2, [
      'Membuka menu Evaluasi 2026 dan meninjau setiap kegiatan yang tercantum di dokumen 2026.',
      'Mencocokkan setiap kegiatan dengan bukti (undangan, daftar hadir, notulen, laporan, SK).',
      'Mengisi status hanya bila bukti sudah dilihat; selain itu biarkan "Belum diverifikasi".',
      'Mencatat kendala yang disampaikan pelaksana kegiatan.',
      'Menentukan tindak lanjut untuk kegiatan yang belum/sebagian terlaksana.',
    ]),
    pihak: ['Ketua PPRA sebelumnya', 'Anggota Komite PPRA', 'Sekretariat', 'Penanggung jawab kegiatan 2026'],
    dokumen: ['Program Kerja PPRA 2026', 'Undangan, daftar hadir, sertifikat', 'Notulen dan laporan monev', 'SK pembentukan Komite'],
    deliverable: t(2, ['Tabel evaluasi program 2026 berbasis bukti', 'Daftar kegiatan yang perlu dilanjutkan ke 2027'], 'o'),
    catatanPenting:
      'Status: Terlaksana = ada bukti kegiatan dan hasil; Sebagian terlaksana = berjalan tetapi belum lengkap; Belum terlaksana = belum ada pelaksanaan; Belum diverifikasi = bukti belum ditemukan atau belum dikonfirmasi.',
  },
  {
    hari: 3,
    judul: 'Koordinasi lintas unit dan pemetaan data',
    tujuan: 'Mengetahui data apa yang tersedia di setiap unit, siapa PIC-nya, dan kendala pengumpulannya.',
    tugas: t(3, [
      'Menghubungi Farmasi: rekap antibiotik, jenis, jumlah pemakaian, pola penggunaan, kemampuan pelaporan.',
      'Menghubungi Laboratorium: jenis pemeriksaan kultur, identifikasi mikroba, uji kepekaan, alur pelaporan.',
      'Menghubungi PPI: program dan hasil monitoring, hand hygiene, kewaspadaan isolasi, kejadian infeksi.',
      'Berdiskusi dengan dokter/klinisi: panduan terapi yang digunakan, proses evaluasi antibiotik, kendala klinis.',
      'Menghubungi Keperawatan: proses pemberian antibiotik, dokumentasi, kepatuhan PPI.',
      'Menghubungi Rekam Medis: ketersediaan data diagnosis, perawatan, dan terapi untuk audit.',
      'Menghubungi IT: dukungan ekstraksi, integrasi, keamanan, dan pengolahan data.',
      'Menghubungi Manajemen/Mutu: indikator mutu, mekanisme pelaporan, dukungan kebijakan dan anggaran.',
      'Mencatat PIC setiap unit dan data yang tersedia/belum tersedia.',
    ]),
    pihak: ['Farmasi', 'Laboratorium', 'PPI', 'Dokter/klinisi', 'Keperawatan', 'Rekam Medis', 'IT', 'Manajemen/Unit Mutu'],
    dokumen: ['Daftar permintaan data per unit (lihat menu Koordinasi)', 'Format rekap data yang tersedia/belum tersedia'],
    deliverable: t(3, ['Daftar data tersedia/belum tersedia', 'PIC per unit', 'Daftar kendala pengumpulan data'], 'o'),
    catatanPenting:
      'Jangan meminta atau membagikan data pasien secara bebas. Penggunaan data harus sesuai kewenangan, kebutuhan program, dan ketentuan kerahasiaan pasien.',
  },
  {
    hari: 4,
    judul: 'Assessment dan gap analysis',
    tujuan: 'Membandingkan kondisi aktual dengan kebutuhan program PPRA dan pedoman yang berlaku.',
    tugas: t(4, [
      'Mengisi kondisi saat ini untuk 10 area di menu Gap Analysis berdasarkan hasil Hari 1–3.',
      'Menuliskan permasalahan dan bukti untuk setiap area.',
      'Menetapkan prioritas (Tinggi/Sedang/Rendah) bersama anggota komite.',
      'Menyusun rekomendasi perbaikan dan calon PIC.',
      'Menandai area yang belum dapat dinilai karena data belum tersedia.',
    ]),
    pihak: ['Anggota Komite PPRA', 'PIC unit terkait'],
    dokumen: ['Hasil serah terima (Hari 1)', 'Evaluasi 2026 (Hari 2)', 'Pemetaan data unit (Hari 3)', 'Regulasi/pedoman yang sudah diverifikasi'],
    deliverable: t(4, ['Matriks gap analysis 10 area', 'Daftar prioritas perbaikan 2027'], 'o'),
  },
  {
    hari: 5,
    judul: 'Menyusun rancangan program kerja 2027',
    tujuan: 'Menyusun draft program kerja berdasarkan hasil evaluasi dan gap analysis.',
    tugas: t(5, [
      'Meninjau 6 kelompok program di menu Program Kerja 2027.',
      'Menyesuaikan kegiatan dengan hasil gap analysis, jenis layanan, SDM, dan fasilitas RS.',
      'Mengisi latar belakang dan tujuan setiap program.',
      'Menentukan unit penanggung jawab untuk setiap program.',
      'Mencatat sumber daya dan dokumentasi yang dibutuhkan.',
    ]),
    pihak: ['Anggota Komite PPRA', 'Farmasi', 'Laboratorium', 'PPI', 'Perwakilan klinisi'],
    dokumen: ['Matriks gap analysis', 'Program Kerja 2026 sebagai referensi format'],
    deliverable: t(5, ['Draft Program Kerja PPRA 2027'], 'o'),
    catatanPenting:
      'Program final harus disesuaikan dengan hasil assessment, jenis layanan RSCC, kemampuan SDM, fasilitas, dan regulasi yang berlaku.',
  },
  {
    hari: 6,
    judul: 'KPI, PIC, timeline, dan anggaran',
    tujuan: 'Memastikan setiap program memiliki indikator, target realistis, PIC, jadwal, dan kebutuhan anggaran.',
    tugas: t(6, [
      'Mengisi matriks KPI: definisi, sumber data, PIC, dan frekuensi.',
      'Mengisi baseline bila sudah ada; bila belum, biarkan "Perlu konfirmasi".',
      'Menyusun timeline Januari–Desember 2027 di menu Timeline.',
      'Menyusun rincian anggaran per kegiatan (pelatihan, sosialisasi, rapat, audit, dukungan lab, pengolahan data, operasional).',
      'Mengecek bahwa tidak ada angka anggaran 2026 yang disalin tanpa evaluasi.',
    ]),
    pihak: ['Anggota Komite PPRA', 'Bagian Keuangan/Perencanaan (untuk mekanisme anggaran)', 'Unit Mutu'],
    dokumen: ['Daftar harga/standar biaya RS (perlu konfirmasi ke bagian keuangan)', 'Indikator mutu RS yang berlaku'],
    deliverable: t(6, ['Matriks KPI', 'Timeline Januari–Desember 2027', 'Daftar PIC', 'Draft anggaran'], 'o'),
    catatanPenting:
      'Target angka harus disusun setelah baseline diketahui dan dikonfirmasi dengan Direktur serta unit terkait. Angka usulan bukan standar regulasi.',
  },
  {
    hari: 7,
    judul: 'Finalisasi dan presentasi kepada Direktur',
    tujuan: 'Menyiapkan paparan 10–20 menit dan daftar keputusan yang perlu disetujui manajemen.',
    tugas: t(7, [
      'Melengkapi template Progress Report ke Direktur di menu Pelaporan.',
      'Mengunduh dokumen Progress Report (PDF) dan Program Kerja (DOCX) dari menu Unduh Dokumen.',
      'Menyusun daftar keputusan/dukungan yang diminta dari Direktur.',
      'Meminta jadwal presentasi kepada Direktur.',
      'Melakukan latihan paparan 10–20 menit.',
    ]),
    pihak: ['Direktur', 'Anggota Komite PPRA'],
    dokumen: ['Progress Report', 'Draft Program Kerja 2027', 'Matriks KPI dan timeline', 'Draft anggaran'],
    deliverable: t(7, ['Progress persiapan', 'Draft program kerja 2027 final untuk ditinjau', 'Daftar keputusan yang perlu disetujui manajemen'], 'o'),
  },
]

export const totalChecklistPersiapan = PERSIAPAN.reduce(
  (n, h) => n + h.tugas.length + h.deliverable.length,
  0,
)
