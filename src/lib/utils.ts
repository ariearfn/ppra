import type { AppState, Program } from '../types'
import { PERSIAPAN, totalChecklistPersiapan } from '../data/persiapan'
import { BULAN_PANJANG } from '../data/timeline'

export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID')

export function parseVolume(v: string): number | null {
  const n = Number(v.replace(',', '.'))
  return v.trim() !== '' && Number.isFinite(n) ? n : null
}

export function totalProgram(p: Program): { total: number; lengkap: boolean } {
  let total = 0
  let lengkap = p.anggaran.length > 0
  for (const b of p.anggaran) {
    const vol = parseVolume(b.volume)
    if (vol === null || b.hargaSatuan === null) {
      lengkap = false
      continue
    }
    total += vol * b.hargaSatuan
  }
  return { total, lengkap }
}

export function totalAnggaran(state: AppState) {
  let total = 0
  let lengkap = true
  for (const p of state.program) {
    const t = totalProgram(p)
    total += t.total
    if (!t.lengkap) lengkap = false
  }
  return { total, lengkap }
}

export function formatTanggal(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${BULAN_PANJANG[m - 1]} ${y}`
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const todayIso = () => new Date().toISOString().slice(0, 10)

export function persiapanStats(state: AppState) {
  const done = PERSIAPAN.reduce(
    (n, h) => n + [...h.tugas, ...h.deliverable].filter((t) => state.persiapan.checked[t.id]).length,
    0,
  )
  const perHari = PERSIAPAN.map((h) => {
    const items = [...h.tugas, ...h.deliverable]
    const d = items.filter((t) => state.persiapan.checked[t.id]).length
    return { hari: h.hari, judul: h.judul, done: d, total: items.length }
  })
  return { done, total: totalChecklistPersiapan, pct: Math.round((done / totalChecklistPersiapan) * 100), perHari }
}

export function evaluasiStats(state: AppState) {
  const c: Record<string, number> = {
    'Belum diverifikasi': 0,
    'Belum terlaksana': 0,
    'Sebagian terlaksana': 0,
    Terlaksana: 0,
  }
  for (const r of state.evaluasi) c[r.status] = (c[r.status] ?? 0) + 1
  return c
}

export function timelineStats(state: AppState) {
  const c = { 'Belum mulai': 0, Berjalan: 0, Selesai: 0, Tertunda: 0 }
  for (const t of state.timeline) c[t.status]++
  return c
}

export interface Tenggat {
  tanggal: string
  label: string
  sumber: string
  href: string
}

export function daftarTenggat(state: AppState): Tenggat[] {
  const out: Tenggat[] = []
  const mulai = state.profil.tanggalMulaiPersiapan
  if (mulai) {
    PERSIAPAN.forEach((h) => {
      const items = [...h.tugas, ...h.deliverable]
      if (items.every((t) => state.persiapan.checked[t.id])) return
      out.push({ tanggal: addDays(mulai, h.hari - 1), label: `Hari ${h.hari}: ${h.judul}`, sumber: 'Persiapan 7 Hari', href: '#/persiapan' })
    })
  }
  if (state.profil.tanggalPresentasi)
    out.push({ tanggal: state.profil.tanggalPresentasi, label: 'Presentasi progress kepada Direktur', sumber: 'Profil', href: '#/pengaturan' })
  for (const t of state.timeline) {
    if (t.status === 'Selesai') continue
    const tanggal = t.tenggat || (t.bulan.length ? `2027-${String(Math.max(...t.bulan)).padStart(2, '0')}-${lastDay(Math.max(...t.bulan))}` : '')
    if (tanggal) out.push({ tanggal, label: t.kegiatan, sumber: t.tenggat ? 'Timeline 2027' : 'Timeline 2027 (akhir bulan)', href: '#/timeline' })
  }
  for (const p of state.pengingat) if (!p.selesai && p.tanggal) out.push({ tanggal: p.tanggal, label: p.teks, sumber: 'Pengingat', href: '#/' })
  return out.sort((a, b) => a.tanggal.localeCompare(b.tanggal))
}

function lastDay(month: number) {
  return String(new Date(2027, month, 0).getDate()).padStart(2, '0')
}

export function nilaiAtauKonfirmasi(v: string | undefined | null, fallback = 'Perlu konfirmasi') {
  return v && v.trim() ? v : fallback
}
