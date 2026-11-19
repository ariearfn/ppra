import type { KewajibanRegulasi, RegulasiItem, StatusRegulasi } from '../types'
import data from './regulasi-ppra.json'

// Sumber: hasil verifikasi regulasi (internal/regulasi-ppra.json di Project store).
export const REGULASI_META = {
  tanggalVerifikasi: data._meta.tanggal_verifikasi,
  catatan: data._meta.catatan,
}

export const REGULASI = data.referensi as RegulasiItem[]
export const KEWAJIBAN = data.indikator_wajib as KewajibanRegulasi[]
export const USULAN_REGULASI = data.indikator_usulan as { id: string; usulan: string; dasar: string[] }[]
export const KONFIRMASI_REGULASI = data.perlu_konfirmasi as { id: string; item: string; pihak: string }[]

export const STATUS_REGULASI_LABEL: Record<StatusRegulasi, string> = {
  berlaku: 'Berlaku',
  dicabut: 'Dicabut – jangan dikutip',
  pedoman_teknis: 'Pedoman teknis',
  dokumen_strategi: 'Dokumen strategi',
  perlu_konfirmasi: 'Perlu konfirmasi',
}

export const SIFAT_LABEL: Record<string, string> = {
  wajib: 'Wajib',
  wajib_bersyarat: 'Wajib bersyarat',
  acuan: 'Acuan',
  usulan: 'Usulan',
}

export function namaRegulasi(r: RegulasiItem): string {
  if (!r.nomor || r.nomor.startsWith('ISBN')) return `${r.jenis} (${r.tahun})`
  if (/^\d+$/.test(r.nomor)) return `${r.jenis} No. ${r.nomor} Tahun ${r.tahun}`
  return `${r.jenis} No. ${r.nomor}`
}

export const regById = (id: string) => REGULASI.find((r) => r.id === id)

const SINGKAT: Record<string, string> = {
  'pmk-8-2015': 'Permenkes 8/2015',
  'pmk-28-2021': 'Permenkes 28/2021',
  'pmk-27-2017': 'Permenkes 27/2017',
  'pmk-6-2026': 'Permenkes 6/2026',
  'pmk-30-2022': 'Permenkes 30/2022',
  'pmk-72-2016': 'Permenkes 72/2016',
  'pp-28-2024': 'PP 28/2024',
  'kmk-1596-2024': 'KMK 1596/2024 (STARKES)',
  'kepdirjen-keslan-1476-2026': 'Kepdirjen Keslan 1476/2026',
  'kepdirjen-yankes-47104-2024': 'Kepdirjen Yankes 47104/2024',
  'kepdirjen-yankes-43961-2024': 'Kepdirjen Yankes 43961/2024',
  'pedoman-amu-pps-2025': 'Pedoman AMU-PPS 2025',
  'panduan-pga-2021': 'Panduan PGA 2021',
  'who-aware-2025': 'WHO AWaRe 2025',
  'stranas-amr-2025-2029': 'Stranas PRA 2025–2029',
}

/** "pmk-8-2015 Ps.11 & Lampiran VIII" -> "Permenkes 8/2015 Ps.11 & Lampiran VIII" */
export function dasarSingkat(d: string): string {
  const [id, ...rest] = d.split(' ')
  return [SINGKAT[id] ?? id, ...rest].join(' ')
}
