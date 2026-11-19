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
          <p className="no-print mt-3 text-sm text-stone-600">
            Tip: isi <a href="#/pengaturan" className="text-ink-700 underline">tanggal mulai persiapan</a> agar setiap hari memiliki tanggal target.
          </p>
        )}
      </Card>

      {PERSIAPAN.map((h) => {
        const ph = stats.perHari[h.hari - 1]
        const isOpen = !!open[h.hari]
        return (
          <section key={h.hari} className={`border-b border-ink-200 ${h.hari === 1 ? 'border-t border-t-ink-900' : ''}`}>
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [h.hari]: !o[h.hari] }))}
              aria-expanded={isOpen}
              className="group flex w-full items-baseline gap-4 py-4 text-left"
            >
              <span className="w-6 shrink-0 font-mono text-xs text-ink-400">{String(h.hari).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink-900">{h.judul}</span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {ph.done}/{ph.total} selesai{mulai && ` · target ${formatTanggal(addDays(mulai, h.hari - 1))}`}
                </span>
              </span>
              {ph.done === ph.total && <span className="font-mono text-xs text-ink-500">selesai</span>}
              <ChevronDown size={16} className={`no-print shrink-0 self-center text-ink-400 transition-transform group-hover:text-ink-900 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="grid gap-6 pb-6 sm:pl-10 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Tujuan</h3>
                    <p className="text-sm text-stone-800">{h.tujuan}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">Tugas</h3>
                    {h.tugas.map((t) => (
                      <Checkbox key={t.id} id={t.id} checked={!!state.persiapan.checked[t.id]} onChange={(v) => toggle(t.id, v)}>{t.teks}</Checkbox>
                    ))}
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">Deliverable</h3>
                    {h.deliverable.map((t) => (
                      <Checkbox key={t.id} id={t.id} checked={!!state.persiapan.checked[t.id]} onChange={(v) => toggle(t.id, v)}>{t.teks}</Checkbox>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">Pihak yang dihubungi</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {h.pihak.map((p) => <span key={p} className="rounded-sm border border-ink-200 px-2 py-0.5 text-xs text-ink-600">{p}</span>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">Dokumen / data yang dibutuhkan</h3>
                    <BulletList items={h.dokumen} />
                  </div>
                  {h.pertanyaan && (
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">Pertanyaan untuk ketua sebelumnya</h3>
                      <ol className="list-decimal space-y-0.5 pl-5 text-sm text-stone-700">{h.pertanyaan.map((q) => <li key={q}>{q}</li>)}</ol>
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
