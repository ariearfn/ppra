import type { AppState } from '../types'
import type { LampiranOtomatis } from '../data/pelaporan'
import { BULAN } from '../data/timeline'
import { TARGET_FALLBACK } from '../data/kpi'
import { rupiah, totalProgram, parseVolume } from '../lib/utils'
import { Td, Th } from './ui'

export const LAMPIRAN_JUDUL: Record<LampiranOtomatis, string> = {
  evaluasi: 'Evaluasi program 2026',
  gap: 'Gap analysis',
  program: 'Ringkasan program kerja 2027',
  kpi: 'Matriks indikator (KPI)',
  timeline: 'Timeline 2027',
  anggaran: 'Draft anggaran 2027',
  konfirmasi: 'Informasi yang masih perlu dikonfirmasi',
}

const dash = (v: string) => (v && v.trim() ? v : '—')

function T({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead><tr>{head.map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <Td key={j} className="whitespace-pre-wrap">{c}</Td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export function Lampiran({ jenis, state }: { jenis: LampiranOtomatis; state: AppState }) {
  switch (jenis) {
    case 'evaluasi':
      return <T head={['Kegiatan', 'Rencana', 'Status', 'Bukti', 'Kendala', 'Tindak lanjut']} rows={state.evaluasi.map((r) => [r.kegiatan, r.rencana, r.status, dash(r.bukti), dash(r.kendala), dash(r.tindakLanjut)])} />
    case 'gap':
      return <T head={['Area', 'Kondisi', 'Permasalahan', 'Prioritas', 'Rekomendasi', 'PIC']} rows={state.gap.map((g) => [g.area, g.kondisi || 'Belum dinilai', dash(g.permasalahan), g.prioritas || '—', dash(g.rekomendasi), dash(g.pic)])} />
    case 'program':
      return <T head={['Program', 'Tujuan', 'Unit penanggung jawab', 'Indikator', 'Timeline']} rows={state.program.map((p) => [`${p.kode}. ${p.nama}`, dash(p.tujuan), dash(p.unitPJ), dash(p.indikator), dash(p.timeline)])} />
    case 'kpi':
      return <T head={['Indikator', 'Kategori', 'Baseline', 'Target', 'Capaian', 'PIC', 'Frekuensi']} rows={state.kpi.map((k) => [k.nama, k.kategori === 'wajib' ? 'Wajib (regulasi)' : 'Usulan', k.baseline || 'Perlu konfirmasi', k.target || TARGET_FALLBACK, dash(k.capaian), dash(k.pic), dash(k.frekuensi)])} />
    case 'timeline':
      return <T head={['Kegiatan', 'PIC', 'Bulan', 'Status']} rows={state.timeline.map((t) => [t.kegiatan, t.pic || 'Perlu konfirmasi', t.bulan.map((b) => BULAN[b - 1]).join(', ') || '—', t.status])} />
    case 'anggaran': {
      const rows: string[][] = []
      let total = 0
      for (const p of state.program) {
        for (const b of p.anggaran) {
          const v = parseVolume(b.volume)
          const ok = v !== null && b.hargaSatuan !== null
          rows.push([`${p.kode}`, b.uraian, b.volume ? `${b.volume} ${b.satuan}` : '—', b.hargaSatuan !== null ? rupiah(b.hargaSatuan) : 'Perlu konfirmasi', ok ? rupiah(v! * b.hargaSatuan!) : 'Perlu konfirmasi'])
        }
        total += totalProgram(p).total
      }
      rows.push(['', 'Total (baris lengkap)', '', '', rupiah(total)])
      return <T head={['Program', 'Uraian', 'Volume', 'Harga satuan', 'Jumlah']} rows={rows} />
    }
    case 'konfirmasi':
      return <T head={['Hal yang perlu dikonfirmasi', 'Ditanyakan ke', 'Status', 'Jawaban']} rows={state.konfirmasi.map((k) => [k.pertanyaan, k.ditanyakanKe, k.status, dash(k.jawaban)])} />
  }
}
