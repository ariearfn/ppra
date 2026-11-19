import { Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Badge, Button, Card, PageHeader, SelectField, TextField } from '../components/ui'
import { STATUS_KONFIRMASI, type KonfirmasiItem } from '../types'
import { uid } from '../lib/utils'

const CLS = {
  'Perlu konfirmasi': 'border-l-amber-400',
  'Sedang ditanyakan': 'border-l-sky-400',
  'Sudah dikonfirmasi': 'border-l-emerald-500',
}

export default function Konfirmasi() {
  const { state, update } = useStore()
  const set = (id: string, p: Partial<KonfirmasiItem>) => update((s) => { Object.assign(s.konfirmasi.find((k) => k.id === id)!, p) })
  const sudah = state.konfirmasi.filter((k) => k.status === 'Sudah dikonfirmasi').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Info Perlu Konfirmasi"
        desc="Informasi penting yang belum tersedia di brief maupun dokumen 2026. Jangan mengisi dengan asumsi: catat kepada siapa ditanyakan dan jawabannya."
        badges={<><Badge sumber="konfirmasi" /><span className="text-xs text-slate-500">{sudah} dari {state.konfirmasi.length} sudah dikonfirmasi</span></>}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak daftar</Button>}
      />
      <div className="space-y-3">
        {state.konfirmasi.map((k, i) => (
          <div key={k.id} className={`rounded-lg border border-l-4 border-slate-200 bg-white p-4 shadow-sm ${CLS[k.status]}`}>
            <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
              <div>
                {k.id.startsWith('kf-x') ? (
                  <AreaField value={k.pertanyaan} onChange={(v) => set(k.id, { pertanyaan: v })} ariaLabel="Pertanyaan" placeholder="Hal yang perlu dikonfirmasi" />
                ) : (
                  <p className="text-sm font-medium text-navy-900">{i + 1}. {k.pertanyaan}</p>
                )}
                <div className="mt-2"><AreaField value={k.jawaban} onChange={(v) => set(k.id, { jawaban: v })} ariaLabel="Jawaban" placeholder="Jawaban / hasil konfirmasi, sumber, tanggal" /></div>
              </div>
              <div className="space-y-2">
                <TextField label="Ditanyakan ke" value={k.ditanyakanKe} onChange={(v) => set(k.id, { ditanyakanKe: v })} />
                <SelectField value={k.status} options={STATUS_KONFIRMASI} onChange={(v) => set(k.id, { status: v })} ariaLabel={`Status konfirmasi ${i + 1}`} />
                {k.id.startsWith('kf-x') && <Button variant="danger" onClick={() => update((s) => { s.konfirmasi = s.konfirmasi.filter((x) => x.id !== k.id) })}><Trash2 size={14} /> Hapus</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Card>
        <Button variant="primary" onClick={() => update((s) => { s.konfirmasi.push({ id: uid('kf-x'), pertanyaan: '', ditanyakanKe: '', status: 'Perlu konfirmasi', jawaban: '' }) })}>
          <Plus size={14} /> Tambah hal yang perlu dikonfirmasi
        </Button>
      </Card>
    </div>
  )
}
