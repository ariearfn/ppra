import { Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Badge, Button, Card, Note, PageHeader, TextField } from '../components/ui'
import type { KategoriKpi, Kpi } from '../types'
import { TARGET_FALLBACK } from '../data/kpi'
import { REGULASI_META } from '../data/regulasi'
import { formatTanggal, uid } from '../lib/utils'
import { Lampiran } from '../components/Lampiran'

function KpiCard({ k, onChange, onDelete }: { k: Kpi; onChange: (p: Partial<Kpi>) => void; onDelete?: () => void }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {k.kategori === 'usulan' && k.id.startsWith('kpi-x') ? (
            <TextField value={k.nama} onChange={(v) => onChange({ nama: v })} ariaLabel="Nama indikator" placeholder="Nama indikator" />
          ) : (
            <h3 className="font-semibold text-ink-900">{k.nama}</h3>
          )}
          <p className="mt-0.5 text-xs text-stone-500">Dasar: {k.rujukan || '—'}</p>
        </div>
        <div className="flex items-center gap-1">
          {k.kategori === 'wajib' ? <Badge sumber="regulasi">Wajib (regulasi)</Badge> : <Badge sumber="rekomendasi">Usulan – tidak wajib</Badge>}
          {onDelete && <Button variant="ghost" title="Hapus indikator" onClick={onDelete}><Trash2 size={14} /></Button>}
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <AreaField label="Definisi operasional" value={k.definisi} onChange={(v) => onChange({ definisi: v })} />
        </div>
        <TextField label="Baseline" value={k.baseline} onChange={(v) => onChange({ baseline: v })} placeholder="Perlu konfirmasi" />
        <TextField label="Target 2027" value={k.target} onChange={(v) => onChange({ target: v })} placeholder={TARGET_FALLBACK} />
        <TextField label="Capaian" value={k.capaian} onChange={(v) => onChange({ capaian: v })} placeholder="Belum ada data" />
        <TextField label="Sumber data" value={k.sumberData} onChange={(v) => onChange({ sumberData: v })} />
        <TextField label="PIC" value={k.pic} onChange={(v) => onChange({ pic: v })} placeholder="Perlu konfirmasi" />
        <TextField label="Frekuensi" value={k.frekuensi} onChange={(v) => onChange({ frekuensi: v })} />
        <div className="sm:col-span-2 lg:col-span-3">
          <AreaField label="Catatan" value={k.catatan} onChange={(v) => onChange({ catatan: v })} />
        </div>
      </div>
    </div>
  )
}

export default function KpiPage() {
  const { state, update } = useStore()
  const set = (id: string, p: Partial<Kpi>) => update((s) => { Object.assign(s.kpi.find((k) => k.id === id)!, p) })
  const list = (kat: KategoriKpi) => state.kpi.filter((k) => k.kategori === kat)
  const tanpaTarget = state.kpi.filter((k) => !k.target.trim()).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring KPI"
        desc="Matriks indikator 2027: definisi, baseline, target, capaian, sumber data, PIC, dan frekuensi."
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note tone="warn">
        Tidak ada regulasi yang menetapkan angka target indikator PPRA. Setiap target ditetapkan RS setelah baseline diketahui dan disepakati dengan Direktur serta unit terkait.
        Saat ini {tanpaTarget} dari {state.kpi.length} indikator belum memiliki target ("{TARGET_FALLBACK}").
      </Note>

      <Card title="Ringkasan matriks indikator">
        <Lampiran jenis="kpi" state={state} />
      </Card>

      <Card title="Indikator wajib (regulasi)" right={<Badge sumber="regulasi" />}>
        <p className="mb-3 text-sm text-stone-600">
          Kewajiban yang dasar regulasinya terverifikasi per {formatTanggal(REGULASI_META.tanggalVerifikasi)} (Permenkes 8/2015 dan KMK HK.01.07/MENKES/1596/2024 – STARKES PROGNAS 6).
          Yang wajib adalah pelaksanaan dan pengukurannya, bukan angka targetnya. Cek ulang status regulasi di JDIH sebelum program disahkan.
        </p>
        <div className="space-y-3">{list('wajib').map((k) => <KpiCard key={k.id} k={k} onChange={(p) => set(k.id, p)} />)}</div>
      </Card>

      <Card title="Indikator usulan" right={<Badge sumber="rekomendasi">Tidak wajib</Badge>}>
        <p className="mb-3 text-sm text-stone-600">Indikator proses/manajemen yang disarankan untuk memantau pelaksanaan program. Dapat dipakai, diubah, atau dihapus sesuai kesepakatan komite.</p>
        <div className="space-y-3">
          {list('usulan').map((k) => (
            <KpiCard key={k.id} k={k} onChange={(p) => set(k.id, p)} onDelete={() => update((s) => { s.kpi = s.kpi.filter((x) => x.id !== k.id) })} />
          ))}
        </div>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => update((s) => {
            s.kpi.push({ id: uid('kpi-x'), kategori: 'usulan', nama: '', definisi: '', baseline: '', target: '', capaian: '', sumberData: '', pic: '', frekuensi: '', catatan: '', rujukan: 'Usulan komite' })
          })}
        >
          <Plus size={14} /> Tambah indikator usulan
        </Button>
      </Card>
    </div>
  )
}
