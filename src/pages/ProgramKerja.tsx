import { useState } from 'react'
import { Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Badge, Button, Card, Konfirmasi, Note, PageHeader, TextField, Td, Th } from '../components/ui'
import { ANGGARAN_2026 } from '../data/fakta2026'
import type { BudgetItem, Program } from '../types'
import { parseVolume, rupiah, totalAnggaran, totalProgram, uid } from '../lib/utils'

const FIELDS: { key: keyof Program; label: string; rows?: number }[] = [
  { key: 'latarBelakang', label: 'Latar belakang', rows: 3 },
  { key: 'tujuan', label: 'Tujuan', rows: 2 },
  { key: 'kegiatan', label: 'Kegiatan (satu per baris)', rows: 4 },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'unitPJ', label: 'Unit penanggung jawab' },
  { key: 'indikator', label: 'Indikator keberhasilan' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'sumberDaya', label: 'Sumber daya yang dibutuhkan' },
  { key: 'dokumentasi', label: 'Dokumentasi / bukti pelaksanaan' },
]

export default function ProgramKerja() {
  const { state, update } = useStore()
  const [aktif, setAktif] = useState(state.program[0]?.id ?? '')
  const p = state.program.find((x) => x.id === aktif) ?? state.program[0]
  const all = totalAnggaran(state)

  const setP = (patch: Partial<Program>) => update((s) => { Object.assign(s.program.find((x) => x.id === p.id)!, patch) })
  const setB = (bid: string, patch: Partial<BudgetItem>) =>
    update((s) => { Object.assign(s.program.find((x) => x.id === p.id)!.anggaran.find((b) => b.id === bid)!, patch) })

  const tp = totalProgram(p)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Program Kerja 2027"
        desc="Rancangan awal enam kelompok program. Sesuaikan dengan hasil assessment, jenis layanan RSCC, kemampuan SDM, fasilitas, dan regulasi yang berlaku."
        badges={<><Badge sumber="rekomendasi">Kerangka program: Rekomendasi brief</Badge><Badge sumber="konfirmasi">Target & anggaran: perlu konfirmasi</Badge></>}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak program aktif</Button>}
      />

      <div className="no-print flex gap-2 overflow-x-auto pb-1" role="tablist">
        {state.program.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === p.id}
            onClick={() => setAktif(x.id)}
            className={`shrink-0 rounded-md border px-3 py-2 text-left text-sm ${x.id === p.id ? 'border-navy-700 bg-navy-700 text-white' : 'border-slate-200 bg-white text-navy-800 hover:bg-navy-50'}`}
          >
            <span className="block text-xs opacity-80">{x.kode}</span>
            <span className="block max-w-[14rem] truncate font-medium">{x.nama}</span>
          </button>
        ))}
      </div>

      <Card title={<>{p.kode}. <span className="font-semibold">{p.nama}</span></>}>
        <div className="mb-4">
          <TextField label="Nama program" value={p.nama} onChange={(v) => setP({ nama: v })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <AreaField key={f.key} label={f.label} rows={f.rows ?? 2} value={p[f.key] as string} onChange={(v) => setP({ [f.key]: v } as Partial<Program>)} placeholder="Perlu konfirmasi" />
          ))}
        </div>
      </Card>

      <Card
        title="Estimasi anggaran program"
        right={<span className="text-sm">Subtotal: <strong className="text-navy-900">{rupiah(tp.total)}</strong> {!tp.lengkap && <Konfirmasi teks="Belum lengkap" />}</span>}
      >
        <p className="mb-3 text-sm text-slate-600">Isi volume dan harga satuan berdasarkan kebutuhan nyata dan standar biaya RS. Baris tanpa harga ditandai "Perlu konfirmasi" dan tidak dihitung.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr><Th>Uraian</Th><Th className="w-20">Volume</Th><Th className="w-28">Satuan</Th><Th className="w-40">Harga satuan (Rp)</Th><Th className="w-36">Jumlah</Th><Th>Catatan</Th><Th className="no-print w-8" /></tr>
            </thead>
            <tbody>
              {p.anggaran.map((b) => {
                const vol = parseVolume(b.volume)
                const ok = vol !== null && b.hargaSatuan !== null
                return (
                  <tr key={b.id}>
                    <Td><TextField value={b.uraian} onChange={(v) => setB(b.id, { uraian: v })} ariaLabel="Uraian" /></Td>
                    <Td><TextField value={b.volume} onChange={(v) => setB(b.id, { volume: v })} ariaLabel="Volume" placeholder="—" /></Td>
                    <Td><TextField value={b.satuan} onChange={(v) => setB(b.id, { satuan: v })} ariaLabel="Satuan" /></Td>
                    <Td>
                      <TextField
                        type="number"
                        value={b.hargaSatuan === null ? '' : String(b.hargaSatuan)}
                        onChange={(v) => setB(b.id, { hargaSatuan: v.trim() === '' ? null : Math.max(0, Number(v)) })}
                        ariaLabel="Harga satuan"
                        placeholder="Perlu konfirmasi"
                      />
                    </Td>
                    <Td className="whitespace-nowrap font-medium">{ok ? rupiah(vol! * b.hargaSatuan!) : <Konfirmasi />}</Td>
                    <Td><TextField value={b.catatan} onChange={(v) => setB(b.id, { catatan: v })} ariaLabel="Catatan anggaran" /></Td>
                    <Td className="no-print">
                      <Button variant="ghost" title="Hapus baris" onClick={() => update((s) => { const pr = s.program.find((x) => x.id === p.id)!; pr.anggaran = pr.anggaran.filter((x) => x.id !== b.id) })}><Trash2 size={14} /></Button>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Button className="mt-3" onClick={() => update((s) => { s.program.find((x) => x.id === p.id)!.anggaran.push({ id: uid('b'), uraian: '', volume: '', satuan: '', hargaSatuan: null, catatan: '' }) })}>
          <Plus size={14} /> Tambah baris anggaran
        </Button>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Rekap anggaran 2027 (draft)">
          <table className="w-full border-collapse">
            <thead><tr><Th>Program</Th><Th className="text-right">Subtotal</Th></tr></thead>
            <tbody>
              {state.program.map((x) => {
                const t = totalProgram(x)
                return (
                  <tr key={x.id}>
                    <Td>{x.kode}. {x.nama}</Td>
                    <Td className="whitespace-nowrap text-right">{rupiah(t.total)} {!t.lengkap && <Konfirmasi teks="belum lengkap" />}</Td>
                  </tr>
                )
              })}
              <tr><Td className="font-semibold">Total</Td><Td className="text-right font-semibold">{rupiah(all.total)}</Td></tr>
            </tbody>
          </table>
        </Card>
        <Card title="Referensi historis: anggaran 2026" right={<Badge sumber="fakta" />}>
          <table className="w-full border-collapse">
            <tbody>
              {ANGGARAN_2026.rincian.map((r) => <tr key={r.pos}><Td>{r.pos}</Td><Td className="text-right">{rupiah(r.nilai)}</Td></tr>)}
              <tr><Td className="font-semibold">Total 2026</Td><Td className="text-right font-semibold">{rupiah(ANGGARAN_2026.total)}</Td></tr>
            </tbody>
          </table>
          <div className="mt-3"><Note tone="warn">{ANGGARAN_2026.catatan}</Note></div>
        </Card>
      </div>
    </div>
  )
}
