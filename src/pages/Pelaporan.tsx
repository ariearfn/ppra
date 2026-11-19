import { useState } from 'react'
import { ArrowLeft, Copy, FilePlus2, Plus, Printer, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Button, Card, EmptyState, PageHeader, TextField, Td, Th } from '../components/ui'
import { Lampiran, LAMPIRAN_JUDUL } from '../components/Lampiran'
import { TEMPLATES, parseTabel, type TemplateField } from '../data/pelaporan'
import type { LaporanDraft } from '../types'
import { formatTanggal, todayIso, uid } from '../lib/utils'

function TabelField({ f, value, onChange }: { f: TemplateField; value: string; onChange: (v: string) => void }) {
  const kolom = f.kolom ?? []
  const rows = parseTabel(value, kolom.length)
  const save = (r: string[][]) => onChange(JSON.stringify(r))
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-slate-600">{f.label}</span>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead><tr><Th className="w-8">No</Th>{kolom.map((k) => <Th key={k}>{k}</Th>)}<Th className="no-print w-8" /></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><Td className="text-slate-400">—</Td>{kolom.map((k) => <Td key={k} />)}<Td className="no-print" /></tr>}
            {rows.map((r, i) => (
              <tr key={i}>
                <Td>{i + 1}</Td>
                {r.map((c, j) => (
                  <Td key={j}>
                    <AreaField className="min-w-28" value={c} rows={1} ariaLabel={kolom[j]} onChange={(v) => save(rows.map((row, ri) => (ri === i ? row.map((cc, cj) => (cj === j ? v : cc)) : row)))} />
                  </Td>
                ))}
                <Td className="no-print"><Button variant="ghost" title="Hapus baris" onClick={() => save(rows.filter((_, ri) => ri !== i))}><Trash2 size={14} /></Button></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button className="mt-2" onClick={() => save([...rows, kolom.map(() => '')])}><Plus size={14} /> Tambah baris</Button>
    </div>
  )
}

export default function Pelaporan() {
  const { state, update } = useStore()
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [draftId, setDraftId] = useState<string | null>(null)
  const tpl = TEMPLATES.find((t) => t.id === templateId)
  const draft = state.laporan.find((d) => d.id === draftId)

  const buat = (tid: string, nilai: Record<string, string> = {}) => {
    const t = TEMPLATES.find((x) => x.id === tid)!
    const id = uid('lap')
    update((s) => {
      s.laporan.unshift({ id, templateId: tid, judul: `${t.judul} – ${formatTanggal(todayIso())}`, dibuat: todayIso(), nilai })
    })
    setTemplateId(tid)
    setDraftId(id)
  }
  const setNilai = (k: string, v: string) => update((s) => { s.laporan.find((d) => d.id === draftId)!.nilai[k] = v })
  const setDraft = (p: Partial<LaporanDraft>) => update((s) => { Object.assign(s.laporan.find((d) => d.id === draftId)!, p) })

  if (tpl && draft) {
    return (
      <div className="space-y-6">
        <div className="no-print"><Button variant="ghost" onClick={() => setDraftId(null)}><ArrowLeft size={14} /> Kembali ke daftar</Button></div>
        <div className="print-only mb-2 text-xs text-slate-500">Komite PPRA {state.profil.namaRS}</div>
        <PageHeader
          title={draft.judul}
          desc={tpl.deskripsi}
          actions={
            <>
              <Button onClick={() => buat(tpl.id, { ...draft.nilai })}><Copy size={14} /> Duplikat</Button>
              <Button variant="primary" onClick={() => window.print()}><Printer size={14} /> Cetak / simpan PDF</Button>
            </>
          }
        />
        <Card className="no-print">
          <TextField label="Judul dokumen" value={draft.judul} onChange={(v) => setDraft({ judul: v })} />
        </Card>
        <Card>
          <div className="space-y-4">
            {tpl.fields.map((f) =>
              f.tipe === 'tabel' ? (
                <TabelField key={f.id} f={f} value={draft.nilai[f.id] ?? ''} onChange={(v) => setNilai(f.id, v)} />
              ) : f.tipe === 'textarea' ? (
                <AreaField key={f.id} label={f.label} hint={f.hint} rows={3} value={draft.nilai[f.id] ?? ''} onChange={(v) => setNilai(f.id, v)} />
              ) : (
                <div key={f.id} className="max-w-md">
                  <TextField label={f.label} type={f.tipe === 'date' ? 'date' : 'text'} placeholder={f.hint} value={draft.nilai[f.id] ?? ''} onChange={(v) => setNilai(f.id, v)} />
                </div>
              ),
            )}
          </div>
        </Card>
        {tpl.lampiran.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">Lampiran (otomatis dari data aplikasi)</h2>
            {tpl.lampiran.map((l, i) => (
              <Card key={l} title={`Lampiran ${i + 1}. ${LAMPIRAN_JUDUL[l]}`}>
                <Lampiran jenis={l} state={state} />
              </Card>
            ))}
          </div>
        )}
        <div className="print-only mt-10 grid grid-cols-2 gap-8 text-sm">
          <div />
          <div className="text-center">
            <p>Ketua Komite PPRA</p>
            <div className="h-16" />
            <p className="font-medium">{state.profil.namaKetua}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Template Pelaporan" desc="Pilih template, buat draft, isi, lalu cetak atau simpan sebagai PDF melalui dialog cetak browser. Draft tersimpan otomatis di perangkat ini." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((t) => {
          const drafts = state.laporan.filter((d) => d.templateId === t.id)
          return (
            <Card key={t.id} title={t.judul}>
              <p className="text-sm text-slate-600">{t.deskripsi}</p>
              {t.lampiran.length > 0 && <p className="mt-2 text-xs text-slate-500">Lampiran otomatis: {t.lampiran.map((l) => LAMPIRAN_JUDUL[l].toLowerCase()).join(', ')}.</p>}
              <div className="mt-3 space-y-1">
                {drafts.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Belum ada draft.</p>
                ) : (
                  drafts.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-2 py-1.5">
                      <button type="button" className="min-w-0 flex-1 truncate text-left text-sm text-navy-800 hover:underline" onClick={() => { setTemplateId(t.id); setDraftId(d.id) }}>{d.judul}</button>
                      <Button variant="ghost" title="Hapus draft" onClick={() => { if (confirm('Hapus draft ini?')) update((s) => { s.laporan = s.laporan.filter((x) => x.id !== d.id) }) }}><Trash2 size={14} /></Button>
                    </div>
                  ))
                )}
              </div>
              <Button variant="primary" className="mt-3" onClick={() => buat(t.id)}><FilePlus2 size={14} /> Buat draft baru</Button>
            </Card>
          )
        })}
      </div>
      {state.laporan.length === 0 && (
        <EmptyState title="Mulai dari Progress Report ke Direktur">
          Template ini mengikuti kerangka A–G pada brief dan otomatis melampirkan evaluasi 2026, gap analysis, program, KPI, anggaran, dan daftar info perlu konfirmasi.
        </EmptyState>
      )}
    </div>
  )
}
