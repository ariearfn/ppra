import { Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Badge, Button, Card, Note, PageHeader, SelectField, TextField, Th, Td } from '../components/ui'
import { STATUS_2026, type EvaluasiRow, type Status2026 } from '../types'
import { evaluasiStats, uid } from '../lib/utils'
import { DOKUMEN_2026 } from '../data/fakta2026'

const STATUS_CLS: Record<Status2026, string> = {
  'Belum diverifikasi': 'bg-amber-50 text-amber-800 border-amber-300',
  'Belum terlaksana': 'bg-red-50 text-red-700 border-red-200',
  'Sebagian terlaksana': 'bg-sky-50 text-sky-800 border-sky-200',
  Terlaksana: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

export default function Evaluasi() {
  const { state, update } = useStore()
  const stats = evaluasiStats(state)
  const set = (id: string, patch: Partial<EvaluasiRow>) =>
    update((s) => { Object.assign(s.evaluasi.find((r) => r.id === id)!, patch) })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluasi Program 2026"
        desc={<>Cocokkan setiap kegiatan pada <em>{DOKUMEN_2026.judul}</em> (disahkan {DOKUMEN_2026.tanggalPengesahan}) dengan bukti pelaksanaan. Jangan menganggap kegiatan sudah terlaksana bila bukti belum dilihat.</>}
        badges={<><Badge sumber="fakta">Kegiatan & jadwal: Fakta – Dok. RSCC 2026</Badge><Badge sumber="konfirmasi">Status: perlu verifikasi bukti</Badge></>}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note>
        <strong>Terlaksana</strong> = ada bukti kegiatan dan hasil · <strong>Sebagian terlaksana</strong> = berjalan tetapi belum lengkap ·{' '}
        <strong>Belum terlaksana</strong> = belum ada pelaksanaan · <strong>Belum diverifikasi</strong> = bukti belum ditemukan/dikonfirmasi.
      </Note>
      <div className="flex flex-wrap gap-2">
        {STATUS_2026.map((s) => (
          <span key={s} className={`rounded-sm border px-2 py-1 text-xs font-medium ${STATUS_CLS[s]}`}>{s} <span className="font-mono">{stats[s]}</span></span>
        ))}
      </div>

      <div className="scrollbar-thin hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr>
              <Th className="w-8">No</Th><Th className="w-44">Kegiatan</Th><Th className="w-32">Rencana</Th><Th className="w-40">Status</Th>
              <Th>Bukti</Th><Th>Kendala</Th><Th>Catatan</Th><Th>Tindak lanjut</Th><Th className="no-print w-8" />
            </tr>
          </thead>
          <tbody>
            {state.evaluasi.map((r, i) => (
              <tr key={r.id}>
                <Td>{i + 1}</Td>
                <Td>
                  {r.custom ? <TextField value={r.kegiatan} onChange={(v) => set(r.id, { kegiatan: v })} ariaLabel="Nama kegiatan" placeholder="Nama kegiatan" /> : <span className="font-medium text-ink-900">{r.kegiatan}</span>}
                  {r.buktiDicari && <span className="mt-1 block text-xs text-stone-500">Bukti dicari: {r.buktiDicari}</span>}
                </Td>
                <Td>{r.custom ? <TextField value={r.rencana} onChange={(v) => set(r.id, { rencana: v })} ariaLabel="Rencana" /> : r.rencana}</Td>
                <Td>
                  <SelectField className="min-w-40" value={r.status} options={STATUS_2026} onChange={(v) => set(r.id, { status: v })} ariaLabel={`Status ${r.kegiatan}`} />
                </Td>
                <Td><AreaField className="min-w-36" value={r.bukti} onChange={(v) => set(r.id, { bukti: v })} ariaLabel="Bukti" placeholder="Dokumen yang sudah dilihat" /></Td>
                <Td><AreaField className="min-w-36" value={r.kendala} onChange={(v) => set(r.id, { kendala: v })} ariaLabel="Kendala" /></Td>
                <Td><AreaField className="min-w-36" value={r.catatan} onChange={(v) => set(r.id, { catatan: v })} ariaLabel="Catatan" /></Td>
                <Td><AreaField className="min-w-36" value={r.tindakLanjut} onChange={(v) => set(r.id, { tindakLanjut: v })} ariaLabel="Tindak lanjut" /></Td>
                <Td className="no-print">
                  {r.custom && <Button variant="ghost" title="Hapus baris" onClick={() => update((s) => { s.evaluasi = s.evaluasi.filter((x) => x.id !== r.id) })}><Trash2 size={14} /></Button>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-10 xl:hidden">
        {state.evaluasi.map((r, i) => (
          <Card key={r.id} title={`${i + 1}. ${r.kegiatan || 'Kegiatan baru'}`} right={<span className={`rounded-sm border px-2 py-0.5 text-xs ${STATUS_CLS[r.status]}`}>{r.status}</span>}>
            <div className="grid gap-3 sm:grid-cols-2">
              {r.custom && <div className="sm:col-span-2"><TextField label="Nama kegiatan" value={r.kegiatan} onChange={(v) => set(r.id, { kegiatan: v })} /></div>}
              <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 text-sm sm:col-span-2">
                <dt className="text-ink-500">Rencana</dt><dd className="text-ink-900">{r.rencana || '—'}</dd>
                <dt className="text-ink-500">Bukti dicari</dt><dd className="text-ink-900">{r.buktiDicari || '—'}</dd>
              </dl>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-medium text-ink-500">Status</span>
                <SelectField value={r.status} options={STATUS_2026} onChange={(v) => set(r.id, { status: v })} ariaLabel={`Status ${r.kegiatan}`} />
              </label>
              <AreaField label="Bukti" value={r.bukti} onChange={(v) => set(r.id, { bukti: v })} placeholder="Dokumen yang sudah dilihat" />
              <AreaField label="Kendala" value={r.kendala} onChange={(v) => set(r.id, { kendala: v })} />
              <AreaField label="Catatan" value={r.catatan} onChange={(v) => set(r.id, { catatan: v })} />
              <AreaField label="Tindak lanjut" value={r.tindakLanjut} onChange={(v) => set(r.id, { tindakLanjut: v })} />
              {r.custom && <div className="sm:col-span-2"><Button variant="danger" onClick={() => update((s) => { s.evaluasi = s.evaluasi.filter((x) => x.id !== r.id) })}><Trash2 size={14} /> Hapus</Button></div>}
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => update((s) => {
          s.evaluasi.push({ id: uid('ev'), kegiatan: '', rencana: '', buktiDicari: '', status: 'Belum diverifikasi', bukti: '', kendala: '', catatan: '', tindakLanjut: '', custom: true })
        })}
      >
        <Plus size={14} /> Tambah kegiatan (mis. temuan saat serah terima)
      </Button>
    </div>
  )
}
