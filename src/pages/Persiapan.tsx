import { useState } from 'react'
import { ChevronDown, Printer } from 'lucide-react'
import { useStore } from '../state/store'
import { PERSIAPAN } from '../data/persiapan'
import { AreaField, Badge, BulletList, Button, Card, Checkbox, Note, PageHeader, ProgressBar } from '../components/ui'
import { addDays, formatTanggal, persiapanStats } from '../lib/utils'

export default function Persiapan() {
  const { state, update } = useStore()
  const stats = persiapanStats(state)
  const firstOpen = stats.perHari.find((h) => h.done < h.total)?.hari ?? 1
  const [open, setOpen] = useState<Record<number, boolean>>({ [firstOpen]: true })
  const mulai = state.profil.tanggalMulaiPersiapan

  const toggle = (id: string, v: boolean) => update((s) => { s.persiapan.checked[id] = v })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Persiapan 7 Hari"
        desc="Checklist interaktif untuk satu minggu persiapan sebelum menyampaikan progress kepada Direktur. Urutan dapat disesuaikan dengan ketersediaan orang dan data."
        badges={<Badge sumber="rekomendasi" />}
        actions={
          <>
            <Button onClick={() => setOpen(Object.fromEntries(PERSIAPAN.map((h) => [h.hari, true])))}>Buka semua</Button>
            <Button onClick={() => { setOpen(Object.fromEntries(PERSIAPAN.map((h) => [h.hari, true]))); setTimeout(() => window.print(), 50) }}><Printer size={14} /> Cetak</Button>
          </>
        }
      />
      <Card>
        <ProgressBar value={stats.pct} label={`Progres keseluruhan: ${stats.done} dari ${stats.total} butir selesai`} />
        {!mulai && (
          <p className="no-print mt-3 text-sm text-slate-600">
            Tip: isi <a href="#/pengaturan" className="text-navy-700 underline">tanggal mulai persiapan</a> agar setiap hari memiliki tanggal target.
          </p>
        )}
      </Card>

      {PERSIAPAN.map((h) => {
        const ph = stats.perHari[h.hari - 1]
        const isOpen = !!open[h.hari]
        return (
          <section key={h.hari} className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [h.hari]: !o[h.hari] }))}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${ph.done === ph.total ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-800'}`}>
                H{h.hari}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{h.judul}</span>
                <span className="block text-xs text-slate-500">
                  {ph.done}/{ph.total} selesai{mulai && ` · target ${formatTanggal(addDays(mulai, h.hari - 1))}`}
                </span>
              </span>
              <ChevronDown size={18} className={`no-print shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="grid gap-5 border-t border-slate-100 px-4 py-4 sm:px-5 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tujuan</h3>
                    <p className="text-sm text-slate-800">{h.tujuan}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Tugas</h3>
                    {h.tugas.map((t) => (
                      <Checkbox key={t.id} id={t.id} checked={!!state.persiapan.checked[t.id]} onChange={(v) => toggle(t.id, v)}>{t.teks}</Checkbox>
                    ))}
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Deliverable</h3>
                    {h.deliverable.map((t) => (
                      <Checkbox key={t.id} id={t.id} checked={!!state.persiapan.checked[t.id]} onChange={(v) => toggle(t.id, v)}>{t.teks}</Checkbox>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pihak yang dihubungi</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {h.pihak.map((p) => <span key={p} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">{p}</span>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Dokumen / data yang dibutuhkan</h3>
                    <BulletList items={h.dokumen} />
                  </div>
                  {h.pertanyaan && (
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pertanyaan untuk ketua sebelumnya</h3>
                      <ol className="list-decimal space-y-0.5 pl-5 text-sm text-slate-700">{h.pertanyaan.map((q) => <li key={q}>{q}</li>)}</ol>
                    </div>
                  )}
                  {h.catatanPenting && <Note tone="warn">{h.catatanPenting}</Note>}
                  <AreaField
                    label="Catatan hari ini"
                    rows={3}
                    value={state.persiapan.catatan[`d${h.hari}`] ?? ''}
                    onChange={(v) => update((s) => { s.persiapan.catatan[`d${h.hari}`] = v })}
                    placeholder="Hasil pertemuan, jawaban, dokumen yang belum ditemukan…"
                  />
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
