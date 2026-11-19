import type { GapRow } from '../types'

const g = (id: string, area: string, pertanyaanKunci: string[]): GapRow => ({
  id,
  area,
  pertanyaanKunci,
  kondisi: '',
  permasalahan: '',
  bukti: '',
  prioritas: '',
  rekomendasi: '',
  pic: '',
})

// Pertanyaan kunci adalah alat bantu assessment (rekomendasi), bukan temuan.
export const DEFAULT_GAP: GapRow[] = [
  g('gap-tatakelola', 'Tata kelola dan struktur Komite PPRA', [
    'Apakah SK Komite PPRA masih berlaku dan sudah mencantumkan ketua baru?',
    'Apakah keanggotaan memenuhi unsur minimal (klinisi KSM, keperawatan, farmasi, laboratorium mikrobiologi klinik, PPI, KFT) sesuai Permenkes 8/2015?',
    'Apakah uraian tugas, tanggung jawab, dan wewenang anggota tersedia?',
    'Apakah ada jadwal rapat dan notulen rutin?',
  ]),
  g('gap-kebijakan', 'Kebijakan dan panduan penggunaan antibiotik', [
    'Apakah kebijakan/panduan penggunaan antibiotik tersedia dan disahkan?',
    'Kapan terakhir direvisi?',
    'Apakah sudah diselaraskan dengan pedoman nasional yang berlaku?',
  ]),
  g('gap-audit', 'Audit kualitas penggunaan antibiotik', [
    'Apakah audit kualitas penggunaan antibiotik pernah dilakukan (Permenkes 8/2015 menyebut metode Gyssens)?',
    'Siapa pelaksananya dan unit mana yang diaudit?',
    'Apakah sudah ada penatagunaan antimikroba (praotorisasi, reviu prospektif) sesuai STARKES PROGNAS 6.1?',
    'Apakah hasil audit diumpanbalikkan ke unit/dokter?',
  ]),
  g('gap-kuantitas', 'Pemantauan kuantitas penggunaan antibiotik', [
    'Apakah Farmasi dapat merekap jenis dan jumlah pemakaian antibiotik (Permenkes 8/2015 menyebut ATC/DDD per 100 patient-days)?',
    'Dalam format dan periode apa data tersedia?',
    'Apakah data pasien-hari tersedia dari Rekam Medis?',
  ]),
  g('gap-resistansi', 'Surveilans resistansi antimikroba', [
    'Apakah data kultur dan uji kepekaan sudah direkap?',
    'Apakah pernah dibuat antibiogram rumah sakit?',
    'Apakah jumlah dan kualitas data cukup untuk analisis?',
    'Apakah RSCC ditetapkan sebagai lokus surveilans AMR (Kepdirjen Keslan 1476/2026)?',
  ]),
  g('gap-lab', 'Kesiapan laboratorium', [
    'Apakah laboratorium RS dapat melakukan kultur dan uji kepekaan sendiri, atau bekerja sama dengan laboratorium rujukan?',
    'Bagaimana alur pelaporan hasil ke klinisi dan Komite PPRA?',
  ]),
  g('gap-ppi', 'Kolaborasi PPRA dan PPI', [
    'Apakah ada forum/rapat bersama PPRA dan PPI?',
    'Apakah hasil monitoring PPI (hand hygiene, kewaspadaan isolasi, kejadian infeksi) dapat diakses komite?',
    'Bagaimana tindak lanjut temuan mikroba multiresisten?',
  ]),
  g('gap-edukasi', 'Edukasi tenaga kesehatan', [
    'Kapan terakhir sosialisasi/pelatihan PPRA dilaksanakan dan siapa sasarannya?',
    'Apakah ada dokter/farmasis yang pernah mengikuti pelatihan PPRA/antimicrobial stewardship?',
  ]),
  g('gap-kajian', 'Forum kajian kasus infeksi', [
    'Apakah forum kajian kasus infeksi multidisiplin pernah berjalan?',
    'Apakah rekomendasi forum terdokumentasi?',
  ]),
  g('gap-monev', 'Monitoring, evaluasi, dan pelaporan', [
    'Apakah pencatatan triwulan dan laporan tahunan 2026 tersedia?',
    'Bagaimana mekanisme pelaporan ke Direktur dan pihak eksternal?',
    'Apakah format/tenggat pelaporan eksternal sudah dikonfirmasi?',
  ]),
]
