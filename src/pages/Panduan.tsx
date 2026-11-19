import { Printer } from 'lucide-react'
import { Badge, BulletList, Button, Card, Note, PageHeader, Td, Th } from '../components/ui'
import { GLOSARIUM, PANDUAN } from '../data/panduan'
import { LANGKAH_TATA_KELOLA, PELAPORAN_2026, PERAN } from '../data/fakta2026'
import { KOORDINASI } from '../data/koordinasi'

export default function Panduan() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panduan Ketua PPRA"
        desc="Bacaan singkat untuk ketua yang baru ditunjuk: apa itu PPRA, apa tanggung jawab ketua, dan bagaimana menggerakkan program bersama unit lain."
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note tone="warn">Panduan ini bersifat administratif dan manajerial. Keputusan klinis dan kebijakan antibiotik ditetapkan oleh tenaga klinis/farmasi yang berwenang.</Note>

      <nav className="no-print flex flex-wrap gap-2 text-sm" aria-label="Daftar isi panduan">
        {PANDUAN.map((s, i) => (
          <a key={s.id} href={`#/panduan`} onClick={(e) => { e.preventDefault(); document.getElementById(`s-${s.id}`)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-md border border-ink-200 px-2.5 py-1 text-ink-900 transition-colors hover:border-ink-900">
            {i + 1}. {s.judul}
          </a>
        ))}
        <a href="#/panduan" onClick={(e) => { e.preventDefault(); document.getElementById('s-glosarium')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-md border border-ink-200 px-2.5 py-1 text-ink-900 transition-colors hover:border-ink-900">Glosarium</a>
      </nav>

      {PANDUAN.map((s, i) => (
        <Card key={s.id} id={`s-${s.id}`} title={`${i + 1}. ${s.judul}`} right={<Badge sumber={s.sumber} />}>
          <div className="space-y-3">
            {s.paragraf.map((p, j) => <p key={j} className="text-sm leading-relaxed text-stone-700">{p}</p>)}
            {s.id === 'pihak' && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse">
                  <thead><tr><Th>Pihak</Th><Th>Peran yang disarankan</Th></tr></thead>
                  <tbody>{PERAN.map((r) => <tr key={r.pihak}><Td className="font-medium">{r.pihak}</Td><Td>{r.peran}</Td></tr>)}</tbody>
                </table>
              </div>
            )}
            {s.id === 'tatakelola' && <ol className="list-decimal space-y-1 pl-5 text-sm text-stone-700">{LANGKAH_TATA_KELOLA.map((t) => <li key={t}>{t}</li>)}</ol>}
            {s.id === 'koordinasi' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {KOORDINASI.slice(0, 6).map((u) => (
                  <div key={u.id} className="rounded-md border border-stone-200 p-3">
                    <div className="text-sm font-semibold text-ink-900">{u.unit}</div>
                    <p className="mt-1 text-sm text-stone-600">{u.mengapa}</p>
                    <a href="#/koordinasi" className="no-print mt-1 inline-block text-xs text-ink-700 underline">Lihat daftar permintaan informasi</a>
                  </div>
                ))}
              </div>
            )}
            {s.id === 'monev' && <BulletList items={PELAPORAN_2026} />}
            {s.tabel && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead><tr>{s.tabel.kolom.map((k) => <Th key={k}>{k}</Th>)}</tr></thead>
                  <tbody>{s.tabel.baris.map((r, j) => <tr key={j}>{r.map((c, k) => <Td key={k} className={k === 0 ? 'font-medium' : ''}>{c}</Td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            {s.butir && (
              <div>
                {s.butirJudul && <p className="mb-1 text-sm font-medium text-stone-800">{s.butirJudul}</p>}
                <BulletList items={s.butir} />
              </div>
            )}
          </div>
        </Card>
      ))}

      <Card id="s-glosarium" title="Glosarium istilah">
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {GLOSARIUM.map((g) => (
            <div key={g.istilah}>
              <dt className="text-sm font-semibold text-ink-900">{g.istilah}</dt>
              <dd className="text-sm text-stone-600">{g.arti}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  )
}
