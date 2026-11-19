import type { JenisTimeline, TimelineItem } from '../types'

export const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
export const BULAN_PANJANG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const i = (
  id: string,
  programId: string,
  kegiatan: string,
  pic: string,
  bulan: number[],
  jenis: JenisTimeline = 'kegiatan',
): TimelineItem => ({ id, programId, kegiatan, pic, bulan, jenis, status: 'Belum mulai', tenggat: '' })

// Usulan jadwal (rekomendasi). Seluruh bulan dapat diubah setelah dikonfirmasi.
export const DEFAULT_TIMELINE: TimelineItem[] = [
  i('tl-sk', 'p1', 'Penetapan SK dan struktur Komite PPRA 2027', 'Ketua PPRA / Direktur', [1], 'milestone'),
  i('tl-tugas', 'p1', 'Pembagian tugas anggota', 'Ketua PPRA', [1, 2]),
  i('tl-rapat', 'p1', 'Rapat koordinasi Komite PPRA', 'Ketua PPRA / Sekretariat', [1, 4, 7, 10]),
  i('tl-review', 'p2', 'Review kebijakan/panduan penggunaan antibiotik', 'Komite PPRA, Komite Medik, Farmasi', [2, 3, 4]),
  i('tl-sah', 'p2', 'Pengesahan kebijakan/panduan', 'Direktur', [5], 'milestone'),
  i('tl-sos', 'p2', 'Sosialisasi panduan kepada klinisi', 'Komite PPRA', [5, 6]),
  i('tl-petadata', 'p3', 'Pemetaan data penggunaan antibiotik', 'Farmasi / Rekam Medis / IT', [1, 2]),
  i('tl-kuantitas', 'p3', 'Rekap kuantitas penggunaan antibiotik', 'Farmasi', [3, 6, 9, 12]),
  i('tl-audit', 'p3', 'Audit kualitas penggunaan antibiotik dan umpan balik', 'Klinisi + Farmasi', [4, 5, 10, 11]),
  i('tl-datalab', 'p4', 'Koordinasi dan review data kultur dan uji kepekaan', 'Laboratorium', [1, 2, 3]),
  i('tl-rekaplab', 'p4', 'Rekap data surveilans resistansi', 'Laboratorium', [6, 12]),
  i('tl-antibiogram', 'p4', 'Penyusunan/pembaruan antibiogram tahunan (bila data memenuhi syarat)', 'Laboratorium / Komite PPRA', [11, 12]),
  i('tl-ppi', 'p5', 'Rapat koordinasi PPRA–PPI', 'Komite PPRA / PPI', [2, 5, 8, 11]),
  i('tl-mdro', 'p5', 'Tindak lanjut temuan mikroba multiresisten', 'PPI', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  i('tl-edukasi', 'p6', 'Edukasi tenaga kesehatan', 'Komite PPRA', [3, 6, 9]),
  i('tl-forum', 'p6', 'Forum kajian kasus infeksi multidisiplin', 'Komite PPRA', [2, 5, 8, 11]),
  i('tl-tw1', 'p6', 'Evaluasi Triwulan I', 'Ketua PPRA', [3], 'evaluasi'),
  i('tl-tw2', 'p6', 'Evaluasi Triwulan II', 'Ketua PPRA', [6], 'evaluasi'),
  i('tl-tw3', 'p6', 'Evaluasi Triwulan III', 'Ketua PPRA', [9], 'evaluasi'),
  i('tl-tw4', 'p6', 'Evaluasi Triwulan IV', 'Ketua PPRA', [12], 'evaluasi'),
  i('tl-kemenkes', 'p6', 'Laporan tahunan PPRA RS ke Kemenkes via aplikasi nasional (tenggat Perlu konfirmasi)', 'Direktur / Ketua PPRA', [8], 'laporan'),
  i('tl-tahunan', 'p6', 'Laporan tahunan PPRA 2027 kepada Direktur', 'Ketua PPRA', [12], 'laporan'),
  i('tl-2028', 'p6', 'Rencana tindak lanjut dan perencanaan program 2028', 'Komite PPRA', [12], 'milestone'),
]

export const JENIS_LABEL: Record<JenisTimeline, string> = {
  kegiatan: 'Kegiatan',
  milestone: 'Milestone',
  evaluasi: 'Evaluasi triwulan',
  laporan: 'Laporan',
}
