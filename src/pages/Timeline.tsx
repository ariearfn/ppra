import { useState } from 'react'
import { Pencil, Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { Badge, Button, Note, PageHeader, SelectField, TextField } from '../components/ui'
import { BULAN, JENIS_LABEL } from '../data/timeline'
import { STATUS_KEGIATAN, type JenisTimeline, type TimelineItem } from '../types'
import { uid } from '../lib/utils'

const JENIS_CLS: Record<JenisTimeline, string> = {
  kegiatan: 'bg-ink-700',
  milestone: 'bg-ink-900',
  evaluasi: 'bg-amber-500',
  laporan: 'bg-emerald-600',
}
const JENIS: JenisTimeline[] = ['kegiatan', 'milestone', 'evaluasi', 'laporan']

export default function Timeline() {
  const { state, update } = useStore()
  const [edit, setEdit] = useState(false)
  const set = (id: string, patch: Partial<TimelineItem>) => update((s) => { Object.assign(s.timeline.find((t) => t.id === id)!, patch) })
  const toggleBulan = (t: TimelineItem, m: number) => {
    if (!edit) return
    set(t.id, { bulan: t.bulan.includes(m) ? t.bulan.filter((x) => x !== m) : [...t.bulan, m].sort((a, b) => a - b) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timeline Januari–Desember 2027"
        desc="Jadwal usulan per program, termasuk milestone, evaluasi triwulan, dan laporan tahunan. Aktifkan mode edit untuk mengubah bulan (klik sel), PIC, dan status."
        badges={<><Badge sumber="rekomendasi">Jadwal usulan</Badge><Badge sumber="konfirmasi">Bulan perlu disepakati</Badge></>}
        actions={
          <>
            <Button variant={edit ? 'primary' : 'secondary'} onClick={() => setEdit(!edit)}><Pencil size={14} /> {edit ? 'Selesai edit' : 'Mode edit'}</Button>
            <Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>
          </>
        }
      />
      <div className="flex flex-wrap gap-3 text-xs text-stone-600">
        {JENIS.map((j) => <span key={j} className="inline-flex items-center gap-1.5"><span className={`inline-block h-3 w-5 rounded-sm ${JENIS_CLS[j]}`} />{JENIS_LABEL[j]}</span>)}
      </div>
      {edit && <Note>Mode edit aktif: klik sel bulan untuk menandai/menghapus jadwal. Perubahan tersimpan otomatis.</Note>}

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm sm:min-w-[980px]">
          <thead>
            <tr className="bg-ink-50 text-xs font-medium text-ink-600">
              <th className="sticky left-0 z-10 w-44 border-b sm:w-72 border-stone-200 bg-ink-50 px-2 py-2 text-left">Kegiatan</th>
              <th className="w-40 border-b border-stone-200 px-2 py-2 text-left">PIC</th>
              <th className="w-32 border-b border-stone-200 px-2 py-2 text-left">Status</th>
              {BULAN.map((b, i) => (
                <th key={b} className={`border-b border-stone-200 px-0 py-2 text-center ${i % 3 === 2 ? 'border-r border-r-stone-300' : ''}`}>{b}</th>
              ))}
              {edit && <th className="no-print w-8 border-b border-stone-200" />}
            </tr>
          </thead>
          <tbody>
            {state.program.map((p) => {
              const rows = state.timeline.filter((t) => t.programId === p.id)
              return [
                <tr key={p.id}>
                  <td colSpan={15 + (edit ? 1 : 0)} className="border-b border-stone-200 bg-stone-50 px-2 py-1.5 text-xs font-semibold text-ink-900">
                    {p.kode}. {p.nama}
                    {edit && (
                      <button
                        type="button"
                        className="no-print ml-3 text-ink-700 underline"
                        onClick={() => update((s) => { s.timeline.push({ id: uid('tl'), programId: p.id, kegiatan: 'Kegiatan baru', pic: '', bulan: [], jenis: 'kegiatan', status: 'Belum mulai', tenggat: '' }) })}
                      >
                        <Plus size={12} className="inline" /> tambah kegiatan
                      </button>
                    )}
                  </td>
                </tr>,
                ...rows.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-50/30">
                    <td className="sticky left-0 z-10 max-w-44 border-b border-stone-100 bg-paper px-2 py-1.5 shadow-[1px_0_0_var(--color-ink-200)] sm:max-w-none">
                      {edit ? (
                        <div className="space-y-1">
                          <TextField value={t.kegiatan} onChange={(v) => set(t.id, { kegiatan: v })} ariaLabel="Nama kegiatan" />
                          <div className="flex gap-1">
                            <SelectField value={t.jenis} options={JENIS} labels={JENIS_LABEL} onChange={(v) => set(t.id, { jenis: v })} ariaLabel="Jenis" />
                            <TextField type="date" value={t.tenggat} onChange={(v) => set(t.id, { tenggat: v })} ariaLabel="Tenggat" />
                          </div>
                        </div>
                      ) : (
                        <span className={t.jenis === 'milestone' ? 'font-semibold text-ink-900' : 'text-stone-800'}>
                          {t.jenis === 'milestone' && '◆ '}{t.kegiatan}
                        </span>
                      )}
                    </td>
                    <td className="border-b border-stone-100 px-2 py-1.5 text-stone-600">
                      {edit ? <TextField value={t.pic} onChange={(v) => set(t.id, { pic: v })} ariaLabel="PIC" placeholder="Perlu konfirmasi" /> : t.pic || <span className="text-amber-700">Perlu konfirmasi</span>}
                    </td>
                    <td className="border-b border-stone-100 px-2 py-1.5">
                      <SelectField value={t.status} options={STATUS_KEGIATAN} onChange={(v) => set(t.id, { status: v })} ariaLabel={`Status ${t.kegiatan}`} className="text-xs" />
                    </td>
                    {BULAN.map((b, i) => {
                      const m = i + 1
                      const on = t.bulan.includes(m)
                      return (
                        <td
                          key={b}
                          onClick={() => toggleBulan(t, m)}
                          title={edit ? `${on ? 'Hapus' : 'Tandai'} ${b}` : undefined}
                          className={`border-b border-stone-100 px-0.5 py-1.5 ${i % 3 === 2 ? 'border-r border-r-stone-200' : ''} ${edit ? 'cursor-pointer hover:bg-ink-100' : ''}`}
                        >
                          {on && <div className={`mx-auto h-4 ${t.jenis === 'milestone' ? 'w-4 rotate-45 rounded-sm' : 'w-full rounded-sm'} ${JENIS_CLS[t.jenis]} ${t.status === 'Selesai' ? 'opacity-40' : ''}`} />}
                        </td>
                      )
                    })}
                    {edit && (
                      <td className="no-print border-b border-stone-100">
                        <Button variant="ghost" title="Hapus kegiatan" onClick={() => update((s) => { s.timeline = s.timeline.filter((x) => x.id !== t.id) })}><Trash2 size={14} /></Button>
                      </td>
                    )}
                  </tr>
                )),
              ]
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500">Garis vertikal tebal menandai batas triwulan. Evaluasi triwulan dijadwalkan pada akhir setiap triwulan, laporan tahunan pada Desember 2027.</p>
    </div>
  )
}
