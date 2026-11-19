export type Sumber = 'fakta' | 'rekomendasi' | 'konfirmasi' | 'ilustrasi' | 'regulasi'

export type Status2026 =
  | 'Belum diverifikasi'
  | 'Belum terlaksana'
  | 'Sebagian terlaksana'
  | 'Terlaksana'

export const STATUS_2026: Status2026[] = [
  'Belum diverifikasi',
  'Belum terlaksana',
  'Sebagian terlaksana',
  'Terlaksana',
]

export type Prioritas = '' | 'Tinggi' | 'Sedang' | 'Rendah'
export const PRIORITAS: Prioritas[] = ['', 'Tinggi', 'Sedang', 'Rendah']

export type StatusKegiatan = 'Belum mulai' | 'Berjalan' | 'Selesai' | 'Tertunda'
export const STATUS_KEGIATAN: StatusKegiatan[] = ['Belum mulai', 'Berjalan', 'Selesai', 'Tertunda']

export type StatusKonfirmasi = 'Perlu konfirmasi' | 'Sedang ditanyakan' | 'Sudah dikonfirmasi'
export const STATUS_KONFIRMASI: StatusKonfirmasi[] = [
  'Perlu konfirmasi',
  'Sedang ditanyakan',
  'Sudah dikonfirmasi',
]

export interface ProfilRS {
  namaRS: string
  namaKetua: string
  ketuaSebelumnya: string
  namaDirektur: string
  nomorSK: string
  tanggalMulaiPersiapan: string
  tanggalPresentasi: string
}

export interface EvaluasiRow {
  id: string
  kegiatan: string
  rencana: string
  buktiDicari: string
  status: Status2026
  bukti: string
  kendala: string
  catatan: string
  tindakLanjut: string
  custom?: boolean
}

export interface GapRow {
  id: string
  area: string
  pertanyaanKunci: string[]
  kondisi: string
  permasalahan: string
  bukti: string
  prioritas: Prioritas
  rekomendasi: string
  pic: string
}

export interface BudgetItem {
  id: string
  uraian: string
  volume: string
  satuan: string
  hargaSatuan: number | null
  catatan: string
}

export interface Program {
  id: string
  kode: string
  nama: string
  latarBelakang: string
  tujuan: string
  kegiatan: string
  sasaran: string
  unitPJ: string
  indikator: string
  timeline: string
  sumberDaya: string
  dokumentasi: string
  anggaran: BudgetItem[]
}

export type JenisTimeline = 'kegiatan' | 'milestone' | 'evaluasi' | 'laporan'

export interface TimelineItem {
  id: string
  programId: string
  kegiatan: string
  pic: string
  bulan: number[]
  jenis: JenisTimeline
  status: StatusKegiatan
  tenggat: string
}

export type KategoriKpi = 'wajib' | 'usulan'

export interface Kpi {
  id: string
  kategori: KategoriKpi
  nama: string
  definisi: string
  baseline: string
  target: string
  capaian: string
  sumberData: string
  pic: string
  frekuensi: string
  catatan: string
  rujukan: string
}

export interface KonfirmasiItem {
  id: string
  pertanyaan: string
  ditanyakanKe: string
  status: StatusKonfirmasi
  jawaban: string
}

export interface Pengingat {
  id: string
  teks: string
  tanggal: string
  selesai: boolean
}

export interface LaporanDraft {
  id: string
  templateId: string
  judul: string
  dibuat: string
  nilai: Record<string, string>
}

export interface PersiapanState {
  checked: Record<string, boolean>
  catatan: Record<string, string>
}

export type StatusRegulasi = 'berlaku' | 'dicabut' | 'pedoman_teknis' | 'dokumen_strategi' | 'perlu_konfirmasi'
export type SifatRegulasi = 'wajib' | 'wajib_bersyarat' | 'acuan' | 'usulan'

export interface RegulasiItem {
  id: string
  jenis: string
  nomor: string | null
  tahun: number
  judul: string
  status: StatusRegulasi
  sifat: SifatRegulasi
  url: string[]
  catatan?: string
  pasal_kunci?: string[]
  syarat?: string
  disebut_di_brief: boolean
  dicabut_oleh?: string | null
}

export interface KewajibanRegulasi {
  id: string
  kewajiban: string
  dasar: string[]
  bukti: string
  frekuensi: string
  tenggat?: string
  syarat?: string
}

export interface KontakUnit {
  pic: string
  tanggal: string
  catatan: string
}

export interface AppState {
  versi: number
  profil: ProfilRS
  persiapan: PersiapanState
  evaluasi: EvaluasiRow[]
  gap: GapRow[]
  program: Program[]
  timeline: TimelineItem[]
  kpi: Kpi[]
  konfirmasi: KonfirmasiItem[]
  pengingat: Pengingat[]
  kontakUnit: Record<string, KontakUnit>
  laporan: LaporanDraft[]
}
