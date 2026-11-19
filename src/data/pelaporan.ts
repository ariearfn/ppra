export type TipeField = 'text' | 'textarea' | 'date' | 'tabel'

export interface TemplateField {
  id: string
  label: string
  hint?: string
  tipe: TipeField
  kolom?: string[]
}

export type LampiranOtomatis = 'evaluasi' | 'gap' | 'program' | 'kpi' | 'timeline' | 'anggaran' | 'konfirmasi'

export interface TemplateLaporan {
  id: string
  judul: string
  deskripsi: string
  fields: TemplateField[]
  lampiran: LampiranOtomatis[]
}

const KOLOM_RTL = ['Masalah/temuan', 'Tindakan', 'PIC', 'Tenggat', 'Status']

export const TEMPLATES: TemplateLaporan[] = [
  {
    id: 'bulanan',
    judul: 'Laporan Bulanan',
    deskripsi: 'Catatan singkat kegiatan Komite PPRA dalam satu bulan.',
    fields: [
      { id: 'periode', label: 'Periode (bulan/tahun)', tipe: 'text', hint: 'Contoh: Januari 2027' },
      { id: 'penyusun', label: 'Disusun oleh', tipe: 'text' },
      { id: 'kegiatan', label: 'Kegiatan yang dilaksanakan', tipe: 'textarea', hint: 'Sebutkan kegiatan, tanggal, dan bukti (notulen, daftar hadir).' },
      { id: 'capaian', label: 'Capaian indikator (bila ada data)', tipe: 'textarea', hint: 'Isi hanya dengan data yang sudah diverifikasi.' },
      { id: 'kendala', label: 'Kendala', tipe: 'textarea' },
      { id: 'rencana', label: 'Rencana bulan berikutnya', tipe: 'textarea' },
      { id: 'dukungan', label: 'Dukungan yang dibutuhkan', tipe: 'textarea' },
    ],
    lampiran: ['timeline'],
  },
  {
    id: 'triwulan',
    judul: 'Evaluasi Triwulan',
    deskripsi: 'Evaluasi setiap tiga bulan, disampaikan saat koordinasi dengan kepala unit/instalasi.',
    fields: [
      { id: 'triwulan', label: 'Triwulan', tipe: 'text', hint: 'Contoh: Triwulan I (Januari–Maret 2027)' },
      { id: 'tanggal', label: 'Tanggal penyusunan', tipe: 'date' },
      { id: 'ringkasan', label: 'Ringkasan pelaksanaan', tipe: 'textarea' },
      { id: 'capaian', label: 'Analisis capaian indikator', tipe: 'textarea', hint: 'Bandingkan dengan baseline dan target yang telah disepakati.' },
      { id: 'kendala', label: 'Kendala dan penyebab', tipe: 'textarea' },
      { id: 'rtl', label: 'Rencana tindak lanjut', tipe: 'tabel', kolom: KOLOM_RTL },
      { id: 'rekomendasi', label: 'Rekomendasi untuk Direktur/unit', tipe: 'textarea' },
    ],
    lampiran: ['kpi', 'timeline'],
  },
  {
    id: 'tahunan',
    judul: 'Laporan Tahunan',
    deskripsi: 'Laporan pelaksanaan tahunan Komite PPRA kepada Direktur.',
    fields: [
      { id: 'tahun', label: 'Tahun', tipe: 'text', hint: 'Contoh: 2027' },
      { id: 'pendahuluan', label: 'Pendahuluan', tipe: 'textarea' },
      { id: 'tujuan', label: 'Tujuan program', tipe: 'textarea' },
      { id: 'pelaksanaan', label: 'Pelaksanaan kegiatan dan bukti', tipe: 'textarea' },
      { id: 'capaian', label: 'Capaian indikator', tipe: 'textarea' },
      { id: 'kendala', label: 'Kendala', tipe: 'textarea' },
      { id: 'anggaran', label: 'Realisasi anggaran', tipe: 'textarea' },
      { id: 'rtl', label: 'Rencana tindak lanjut tahun berikutnya', tipe: 'tabel', kolom: KOLOM_RTL },
      { id: 'penutup', label: 'Penutup', tipe: 'textarea' },
    ],
    lampiran: ['program', 'kpi', 'timeline', 'anggaran'],
  },
  {
    id: 'progress',
    judul: 'Progress Report ke Direktur',
    deskripsi: 'Kerangka laporan progress persiapan (bagian A–G sesuai brief). Tabel lampiran diambil otomatis dari data aplikasi.',
    fields: [
      { id: 'tanggal', label: 'Tanggal laporan', tipe: 'date' },
      { id: 'a', label: 'A. Ringkasan eksekutif', tipe: 'textarea', hint: 'Status persiapan kepemimpinan dan penyusunan program PPRA 2027.' },
      { id: 'b', label: 'B. Evaluasi program 2026 – catatan', tipe: 'textarea', hint: 'Pencapaian dan kendala utama. Tabel evaluasi dilampirkan otomatis.' },
      { id: 'c', label: 'C. Assessment kondisi rumah sakit', tipe: 'textarea', hint: 'Tata kelola, penggunaan antibiotik, Farmasi, Laboratorium, PPI, data pendukung.' },
      { id: 'd', label: 'D. Gap analysis – masalah prioritas dan risiko', tipe: 'textarea' },
      { id: 'e', label: 'E. Rencana program 2027 – catatan', tipe: 'textarea' },
      { id: 'f', label: 'F. Rencana anggaran – justifikasi', tipe: 'textarea' },
      { id: 'g', label: 'G. Dukungan/keputusan yang dibutuhkan dari Direktur', tipe: 'textarea', hint: 'Penetapan SK, penugasan anggota, akses data, dukungan unit, anggaran.' },
    ],
    lampiran: ['evaluasi', 'gap', 'program', 'kpi', 'anggaran', 'konfirmasi'],
  },
  {
    id: 'notulen',
    judul: 'Notulen Rapat',
    deskripsi: 'Catatan rapat Komite PPRA atau rapat koordinasi lintas unit.',
    fields: [
      { id: 'tanggal', label: 'Tanggal', tipe: 'date' },
      { id: 'waktu', label: 'Waktu', tipe: 'text' },
      { id: 'tempat', label: 'Tempat', tipe: 'text' },
      { id: 'pimpinan', label: 'Pimpinan rapat', tipe: 'text' },
      { id: 'notulis', label: 'Notulis', tipe: 'text' },
      { id: 'peserta', label: 'Peserta', tipe: 'textarea' },
      { id: 'agenda', label: 'Agenda', tipe: 'textarea' },
      { id: 'pembahasan', label: 'Pembahasan', tipe: 'textarea' },
      { id: 'keputusan', label: 'Keputusan/kesepakatan', tipe: 'textarea' },
      { id: 'tindaklanjut', label: 'Tindak lanjut', tipe: 'tabel', kolom: ['Tindakan', 'PIC', 'Tenggat'] },
      { id: 'berikutnya', label: 'Rapat berikutnya', tipe: 'text' },
    ],
    lampiran: [],
  },
  {
    id: 'rtl',
    judul: 'Rencana Tindak Lanjut',
    deskripsi: 'Daftar tindakan perbaikan dari hasil evaluasi, audit, atau rapat.',
    fields: [
      { id: 'sumber', label: 'Sumber temuan', tipe: 'text', hint: 'Contoh: Evaluasi Triwulan I, gap analysis, notulen rapat' },
      { id: 'tanggal', label: 'Tanggal', tipe: 'date' },
      { id: 'tabel', label: 'Daftar tindak lanjut', tipe: 'tabel', kolom: KOLOM_RTL },
      { id: 'catatan', label: 'Catatan', tipe: 'textarea' },
    ],
    lampiran: [],
  },
]

export function parseTabel(v: string | undefined, kolom: number): string[][] {
  if (!v) return []
  try {
    const rows = JSON.parse(v) as string[][]
    return rows.map((r) => Array.from({ length: kolom }, (_, i) => r[i] ?? ''))
  } catch {
    return []
  }
}
