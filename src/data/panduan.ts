import type { Sumber } from '../types'

export interface SeksiPanduan {
  id: string
  judul: string
  sumber: Sumber
  paragraf: string[]
  butir?: string[]
  butirJudul?: string
  tabel?: { kolom: string[]; baris: string[][] }
}

export const PANDUAN: SeksiPanduan[] = [
  {
    id: 'apa',
    judul: 'Apa itu PPRA?',
    sumber: 'fakta',
    paragraf: [
      'PPRA adalah Program Pengendalian Resistensi Antimikroba. Di rumah sakit, program ini dijalankan oleh Komite PPRA yang ditetapkan Direktur.',
      'PPRA bukan program untuk melarang antibiotik. Tujuannya memastikan antibiotik digunakan bila ada indikasi, dengan pilihan obat, dosis, rute, dan durasi yang tepat, serta dievaluasi sesuai kondisi pasien dan hasil pemeriksaan.',
    ],
    butirJudul: 'Dua tujuan utama PPRA:',
    butir: [
      'Mengendalikan berkembangnya mikroba resisten melalui penggunaan antibiotik/antimikroba secara bijak.',
      'Mencegah penyebaran mikroba resisten melalui penerapan Pencegahan dan Pengendalian Infeksi (PPI).',
    ],
  },
  {
    id: 'penting',
    judul: 'Mengapa PPRA penting?',
    sumber: 'rekomendasi',
    paragraf: [
      'Mikroba yang resisten membuat infeksi lebih sulit ditangani karena pilihan antibiotik yang efektif menjadi terbatas. Penggunaan antibiotik yang tidak tepat ikut mendorong munculnya resistansi, dan mikroba resisten dapat menyebar antarpasien bila praktik PPI tidak dijalankan.',
      'Bagi rumah sakit, PPRA adalah kewajiban dan bagian dari tata kelola mutu serta keselamatan pasien. Dokumen Program Kerja RSCC 2026 juga menyebut Direktur melaporkan bukti laporan PPRA rumah sakit kepada Kementerian Kesehatan satu kali setahun.',
    ],
    butirJudul: 'Dasar regulasi (terverifikasi per 19 November 2026; cek ulang di JDIH sebelum program disahkan):',
    butir: [
      'Permenkes No. 8 Tahun 2015 Pasal 6: rumah sakit harus melaksanakan PPRA.',
      'PP No. 28 Tahun 2024 Pasal 885(4): tata kelola fasilitas pelayanan kesehatan antara lain mencakup program pengendalian resistensi antimikroba.',
      'Permenkes No. 6 Tahun 2026 Pasal 50(2)c: tugas komite RS mencakup pencegahan, pengendalian infeksi, dan resistensi antimikroba.',
      'KMK HK.01.07/MENKES/1596/2024 (STARKES): PROGNAS 6 (PPRA) dan PROGNAS 6.1 (Penatagunaan Antimikroba/PGA) termasuk standar akreditasi; Bab Program Nasional harus terpenuhi 100% (Kepdirjen Yankes HK.02.02/D/43961/2024).',
      'Permenkes 8/2015 Pasal 12: Direktur menyampaikan laporan tahunan kepada Menteri c.q. KPRA dengan tembusan Dinas Kesehatan Provinsi dan Kabupaten/Kota. Tenggat dan kanal pelaporan: Perlu konfirmasi.',
    ],
  },
  {
    id: 'tanggungjawab',
    judul: 'Tanggung jawab Ketua PPRA',
    sumber: 'rekomendasi',
    paragraf: [
      'Ketua PPRA berperan sebagai koordinator dan penggerak program. Ketua tidak harus mengerjakan semua aspek teknis sendiri; pekerjaan teknis dijalankan oleh unit dan profesi yang berwenang.',
    ],
    butirJudul: 'Tugas utama ketua:',
    butir: [
      'Menetapkan prioritas program bersama anggota komite.',
      'Memimpin rapat dan koordinasi lintas unit.',
      'Memantau pelaksanaan kegiatan dan indikator.',
      'Mengevaluasi program setiap triwulan dan akhir tahun.',
      'Melaporkan hasil kepada Direktur dan meminta keputusan bila diperlukan.',
      'Memastikan mandat formal (SK) dan pembagian tugas anggota jelas.',
    ],
  },
  {
    id: 'pihak',
    judul: 'Siapa saja yang perlu dilibatkan?',
    sumber: 'rekomendasi',
    paragraf: [
      'Pelaksanaan PPRA melibatkan berbagai profesi dan unit. Tabel berikut adalah pembagian peran yang disarankan; susunan dan kewenangan formal harus mengikuti SK Direktur dan ketentuan rumah sakit.',
    ],
  },
  {
    id: 'tatakelola',
    judul: 'Tata kelola dan SK kepengurusan',
    sumber: 'rekomendasi',
    paragraf: [
      'Dokumen Program Kerja 2026 mencantumkan dr. Prisilia Almiranti sebagai Ketua Komite PPRA. Pergantian ketua perlu diformalkan melalui mekanisme dan SK Direktur. Penunjukan lisan tidak otomatis menggantikan SK formal; kejelasan mandat diperlukan sebelum meminta unit lain menjalankan tugas lintas unit.',
      'Menurut Permenkes 8/2015 Pasal 7–8 dan STARKES PROGNAS 6 EP2, SK komite/tim PPRA memuat uraian tugas, tanggung jawab, wewenang, dan program kerja; anggotanya minimal terdiri atas unsur klinisi KSM, keperawatan, farmasi, laboratorium mikrobiologi klinik, PPI, dan Komite/Tim Farmasi dan Terapi (KFT); ketua adalah klinisi yang berminat di bidang infeksi; komite/tim bertanggung jawab langsung kepada Direktur. Permenkes 8/2015 memakai istilah "tim pelaksana", sedangkan dokumen RSCC memakai "Komite".',
    ],
    butirJudul: 'Langkah yang disarankan:',
  },
  {
    id: 'koordinasi',
    judul: 'Cara berkoordinasi dengan unit terkait',
    sumber: 'rekomendasi',
    paragraf: [
      'Koordinasi yang efektif dimulai dengan permintaan yang jelas: apa yang dibutuhkan, untuk apa, dalam format apa, dan kapan. Gunakan menu Koordinasi untuk melihat daftar informasi yang perlu diminta dari setiap unit.',
    ],
    butirJudul: 'Prinsip praktis:',
    butir: [
      'Datang dengan daftar pertanyaan tertulis, bukan permintaan umum.',
      'Sepakati satu PIC di setiap unit dan catat namanya.',
      'Tanyakan kemampuan data yang ada, bukan menuntut data yang belum bisa disediakan.',
      'Tuliskan kesepakatan dalam notulen singkat dan kirimkan kembali kepada unit.',
      'Sampaikan hasil analisis kembali ke unit (umpan balik), bukan hanya mengambil data.',
    ],
  },
  {
    id: 'tidakjalan',
    judul: 'Jika program tidak berjalan',
    sumber: 'rekomendasi',
    paragraf: [
      'Program yang tidak berjalan biasanya disebabkan oleh mandat yang belum jelas, PIC yang tidak ditetapkan, data yang tidak tersedia, atau target yang tidak realistis. Identifikasi penyebabnya sebelum menambah kegiatan baru.',
    ],
    tabel: {
      kolom: ['Tanda', 'Kemungkinan penyebab', 'Langkah yang dapat diambil'],
      baris: [
        ['Unit tidak merespons permintaan data', 'Mandat belum jelas; permintaan tidak spesifik', 'Pastikan SK; kirim permintaan tertulis melalui jalur resmi; libatkan Direktur bila perlu'],
        ['Rapat sering batal', 'Jadwal tidak disepakati; agenda tidak jelas', 'Tetapkan jadwal tahunan di awal tahun; kirim agenda sebelum rapat'],
        ['Kegiatan terlaksana tetapi tanpa bukti', 'Tidak ada sistem dokumentasi', 'Tetapkan format bukti (daftar hadir, notulen, laporan) dan arsip bersama'],
        ['Data tidak dapat dianalisis', 'Format data tidak seragam; kapasitas sistem terbatas', 'Mulai dari data yang tersedia; sepakati format bersama Farmasi/Lab/IT'],
        ['Target tidak tercapai', 'Target ditetapkan tanpa baseline', 'Tinjau ulang target setelah baseline tersedia; laporkan alasan kepada Direktur'],
        ['Anggaran tidak cair', 'Kegiatan tidak masuk rencana anggaran RS', 'Ajukan anggaran berbasis kegiatan sesuai siklus perencanaan RS'],
      ],
    },
    butirJudul: 'Langkah eskalasi yang disarankan:',
    butir: [
      'Bahas di rapat komite dan catat kendala dalam notulen.',
      'Diskusikan langsung dengan kepala unit terkait.',
      'Bila belum terselesaikan, laporkan kepada Direktur beserta usulan keputusan yang dibutuhkan.',
      'Catat kendala dan tindak lanjut pada laporan triwulan.',
    ],
  },
  {
    id: 'monev',
    judul: 'Monitoring dan evaluasi',
    sumber: 'fakta',
    paragraf: [
      'Dokumen Program Kerja 2026 menetapkan mekanisme evaluasi dan pelaporan berikut. Mekanisme ini dapat dipertahankan atau disesuaikan untuk 2027 setelah dikonfirmasi dengan Direktur.',
    ],
  },
  {
    id: 'data',
    judul: 'Prinsip penggunaan data',
    sumber: 'rekomendasi',
    paragraf: [
      'Jangan meminta atau membagikan data pasien secara bebas. Penggunaan data harus sesuai kewenangan, kebutuhan program, dan ketentuan kerahasiaan pasien.',
      'Bedakan dengan jelas antara fakta dari dokumen RS, hasil assessment baru, rekomendasi, dan informasi regulasi. Bila informasi belum tersedia, tandai "Perlu konfirmasi" dan buat daftar pertanyaan, bukan mengisi dengan asumsi.',
    ],
  },
]

export const GLOSARIUM: { istilah: string; arti: string }[] = [
  { istilah: 'PPRA', arti: 'Program Pengendalian Resistensi Antimikroba.' },
  { istilah: 'Resistansi antimikroba (AMR)', arti: 'Kondisi ketika mikroba tidak lagi dapat dihambat atau dibunuh oleh antimikroba yang sebelumnya efektif.' },
  { istilah: 'Antimikroba', arti: 'Obat untuk mengatasi infeksi mikroba, termasuk antibiotik, antijamur, antivirus, dan antiparasit.' },
  { istilah: 'PPI', arti: 'Pencegahan dan Pengendalian Infeksi; program untuk mencegah penularan infeksi di fasilitas kesehatan.' },
  { istilah: 'Kewaspadaan standar', arti: 'Praktik PPI dasar yang diterapkan pada semua pasien, misalnya kebersihan tangan.' },
  { istilah: 'Kewaspadaan transmisi', arti: 'Praktik PPI tambahan berdasarkan cara penularan (kontak, droplet, udara).' },
  { istilah: 'Mikroba multiresisten (MDRO)', arti: 'Mikroba yang resisten terhadap beberapa golongan antimikroba.' },
  { istilah: 'Kultur dan uji kepekaan', arti: 'Pemeriksaan laboratorium untuk mengidentifikasi mikroba dan menilai kepekaannya terhadap antibiotik.' },
  { istilah: 'Antibiogram', arti: 'Rekap pola kepekaan mikroba terhadap antibiotik di suatu fasilitas dalam periode tertentu. Disusun bila jumlah dan kualitas data memenuhi syarat.' },
  { istilah: 'Surveilans', arti: 'Pengumpulan, analisis, dan pelaporan data secara sistematis dan berkelanjutan.' },
  { istilah: 'Audit penggunaan antibiotik', arti: 'Penilaian kualitas penggunaan antibiotik (indikasi, pilihan, dosis, rute, durasi) oleh tenaga yang berwenang.' },
  { istilah: 'Kuantitas penggunaan antibiotik', arti: 'Jumlah antibiotik yang digunakan dalam periode tertentu, diukur dengan metode yang ditetapkan pedoman.' },
  { istilah: 'Antimicrobial stewardship (AMS)', arti: 'Istilah internasional untuk upaya terkoordinasi meningkatkan penggunaan antimikroba yang bijak.' },
  { istilah: 'Point Prevalence Survey (PPS)', arti: 'Survei potong-lintang pada satu titik waktu untuk menggambarkan penggunaan antimikroba di RS.' },
  { istilah: 'FORKKIT', arti: 'Forum Kajian Kasus Infeksi Terintegrasi; pertemuan multidisiplin untuk membahas penanganan kasus infeksi.' },
  { istilah: 'PGA', arti: 'Penatagunaan Antimikroba; istilah STARKES (PROGNAS 6.1) untuk antimicrobial stewardship di unit pelayanan.' },
  { istilah: 'KFT', arti: 'Komite/Tim Farmasi dan Terapi.' },
  { istilah: 'ATC/DDD per 100 patient-days', arti: 'Metode pengukuran kuantitas penggunaan antibiotik yang disebut dalam Lampiran Permenkes 8/2015.' },
  { istilah: 'Metode Gyssens', arti: 'Metode penilaian kualitas penggunaan antibiotik yang disebut dalam Lampiran Permenkes 8/2015.' },
  { istilah: 'AWaRe', arti: 'Pengelompokan antibiotik Access, Watch, Reserve. Untuk kepatuhan nasional gunakan versi Permenkes 28/2021.' },
  { istilah: 'STARKES / PROGNAS', arti: 'Standar Akreditasi Rumah Sakit (KMK 1596/2024); PROGNAS = bab Program Nasional, termasuk PROGNAS 6 (PPRA).' },
  { istilah: 'EP', arti: 'Elemen Penilaian dalam standar akreditasi.' },
  { istilah: 'Lokus surveilans', arti: 'RS yang ditetapkan sebagai lokasi surveilans resistansi antimikroba nasional (Kepdirjen Keslan 1476/2026).' },
  { istilah: 'PME', arti: 'Pemantapan Mutu Eksternal laboratorium.' },
  { istilah: 'CLSI', arti: 'Clinical and Laboratory Standards Institute; standar interpretasi uji kepekaan.' },
  { istilah: 'Baseline', arti: 'Nilai awal suatu indikator sebelum program berjalan; dasar untuk menetapkan target.' },
  { istilah: 'KPI / Indikator', arti: 'Ukuran keberhasilan program yang disepakati.' },
  { istilah: 'PIC', arti: 'Person in charge; orang/unit penanggung jawab kegiatan.' },
  { istilah: 'Monev', arti: 'Monitoring dan evaluasi.' },
  { istilah: 'SK', arti: 'Surat Keputusan, dalam konteks ini SK Direktur tentang Komite PPRA.' },
  { istilah: 'Gap analysis', arti: 'Perbandingan antara kondisi saat ini dan kondisi yang dibutuhkan untuk menemukan kesenjangan.' },
]
