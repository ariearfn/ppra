import { Printer } from 'lucide-react'
import { AreaField, Badge, BulletList, Button, Card, Note, PageHeader, TextField } from '../components/ui'
import { useStore } from '../state/store'
import { KOORDINASI } from '../data/koordinasi'

export default function Koordinasi() {
  const { state, update } = useStore()
  const setK = (id: string, p: Partial<{ pic: string; tanggal: string; catatan: string }>) =>
    update((s) => { s.kontakUnit[id] = { ...{ pic: '', tanggal: '', catatan: '' }, ...s.kontakUnit[id], ...p } })
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panduan Koordinasi Unit"
        desc="Untuk setiap unit: mengapa unit ini penting, informasi yang perlu diminta, kegiatan bersama, dan output yang diharapkan. Gunakan sebagai daftar pertanyaan saat pertemuan."
        badges={<Badge sumber="rekomendasi" />}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note tone="warn">Jangan meminta atau membagikan data pasien secara bebas. Penggunaan data harus sesuai kewenangan, kebutuhan program, dan ketentuan kerahasiaan pasien.</Note>
      <nav className="no-print flex flex-wrap gap-2 text-sm" aria-label="Daftar unit">
        {KOORDINASI.map((u) => (
          <a key={u.id} href="#/koordinasi" onClick={(e) => { e.preventDefault(); document.getElementById(`u-${u.id}`)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-full border border-slate-200 px-3 py-1 text-navy-800 hover:bg-navy-50">
            {u.unit}
          </a>
        ))}
      </nav>
      <div className="grid gap-4 xl:grid-cols-2">
        {KOORDINASI.map((u) => (
          <Card key={u.id} id={`u-${u.id}`} title={u.unit}>
            <p className="mb-3 text-sm text-slate-700"><span className="font-medium text-navy-900">Mengapa penting: </span>{u.mengapa}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Informasi yang diminta</h3>
                <BulletList items={u.informasi} />
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Kegiatan bersama</h3>
                <BulletList items={u.kegiatan} />
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Output yang diharapkan</h3>
                <BulletList items={u.output} />
              </div>
            </div>
            {u.catatan && <div className="mt-3"><Note>{u.catatan}</Note></div>}
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
              <TextField label="PIC di unit ini" value={state.kontakUnit[u.id]?.pic ?? ''} onChange={(v) => setK(u.id, { pic: v })} placeholder="Nama/jabatan – perlu konfirmasi" />
              <TextField label="Tanggal pertemuan" type="date" value={state.kontakUnit[u.id]?.tanggal ?? ''} onChange={(v) => setK(u.id, { tanggal: v })} />
              <div className="sm:col-span-2">
                <AreaField label="Hasil koordinasi / data tersedia & belum tersedia" value={state.kontakUnit[u.id]?.catatan ?? ''} onChange={(v) => setK(u.id, { catatan: v })} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
