import type { AppState } from '../types'
import { formatTanggal, todayIso } from '../lib/utils'

export const NAVY = '#1e3a8a'
export const NAVY_LIGHT = '#e1e9f5'
export const AMBER = '#92400e'
export const GREY = '#64748b'

export const PK = 'Perlu konfirmasi'

export const FILES = {
  panduan: 'Panduan_Ketua_PPRA_2027.pdf',
  program: 'Program_Kerja_PPRA_2027.docx',
  tracker: 'Tracker_PPRA_2027.xlsx',
  progress: 'Progress_Report_PPRA_2027.pdf',
} as const

export const orPK = (v: string | undefined | null, fb = PK) => (v && v.trim() ? v.trim() : fb)

export function tanggalDokumen(): string {
  return formatTanggal(todayIso())
}

export function identitas(state: AppState) {
  return {
    rs: state.profil.namaRS || 'RS Condong Catur',
    ketua: state.profil.namaKetua || PK,
    direktur: orPK(state.profil.namaDirektur),
    sk: orPK(state.profil.nomorSK),
  }
}

export function lines(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean)
}

export const KETERANGAN_LABEL = [
  ['Fakta – Dok. RSCC 2026', 'Isi dokumen Program Kerja Komite PPRA 2026 RS Condong Catur (disahkan 30 Januari 2026).'],
  ['Regulasi terverifikasi', 'Diverifikasi melalui sumber resmi per 19 November 2026; cek ulang di JDIH sebelum disahkan.'],
  ['Rekomendasi', 'Usulan berdasarkan brief persiapan; dapat disesuaikan dengan kondisi RS.'],
  ['Perlu konfirmasi', 'Belum tersedia atau belum diverifikasi; jangan digunakan sebelum dikonfirmasi.'],
  ['Ilustrasi', 'Contoh cara pengisian, bukan data RS.'],
]

export function latestDraft(state: AppState, templateId: string) {
  return state.laporan.find((d) => d.templateId === templateId)
}
