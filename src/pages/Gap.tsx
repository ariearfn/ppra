import { Printer } from 'lucide-react'
import { useStore } from '../state/store'
import { AreaField, Badge, Button, Card, EmptyState, Note, PageHeader, SelectField, TextField, Td, Th } from '../components/ui'
import { PRIORITAS, type GapRow, type Prioritas } from '../types'

const PRIO_CLS: Record<Prioritas, string> = {
  '': 'bg-stone-50 text-stone-500 border-stone-200',
  Tinggi: 'bg-red-50 text-red-700 border-red-200',
  Sedang: 'bg-amber-50 text-amber-800 border-amber-300',
  Rendah: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}
const ORDER: Record<Prioritas, number> = { Tinggi: 0, Sedang: 1, Rendah: 2, '': 3 }

export default function Gap() {
  const { state, update } = useStore()
  const set = (id: string, patch: Partial<GapRow>) => update((s) => { Object.assign(s.gap.find((g) => g.id === id)!, patch) })
  const terisi = state.gap.filter((g) => g.kondisi.trim() || g.permasalahan.trim())
  const prioritas = [...state.gap].filter((g) => g.prioritas).sort((a, b) => ORDER[a.prioritas] - ORDER[b.prioritas])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gap Analysis"
        desc="Bandingkan kondisi aktual RSCC dengan kebutuhan program PPRA dan pedoman yang berlaku pada 10 area. Isi setelah serah terima, evaluasi 2026, dan pemetaan data unit."
        badges={<><Badge sumber="rekomendasi">Area & pertanyaan kunci: Rekomendasi</Badge><Badge sumber="konfirmasi">Kondisi: isi setelah assessment</Badge></>}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note>Tuliskan kondisi berdasarkan bukti. Bila suatu area belum dapat dinilai karena data belum tersedia, tulis "Belum dapat dinilai – data belum tersedia" dan catat di menu Info Perlu Konfirmasi.</Note>

      <Card title={`Ringkasan prioritas (${terisi.length}/10 area sudah dinilai)`}>
        {prioritas.length === 0 ? (
          <EmptyState title="Belum ada prioritas yang ditetapkan">Tetapkan prioritas Tinggi/Sedang/Rendah pada setiap area di bawah. Daftar ini akan terurut otomatis.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead><tr><Th>Area</Th><Th>Prioritas</Th><Th>Rekomendasi</Th><Th>PIC</Th></tr></thead>
              <tbody>
                {prioritas.map((g) => (
                  <tr key={g.id}>
                    <Td className="font-medium">{g.area}</Td>
                    <Td><span className={`rounded-sm border px-2 py-0.5 text-xs ${PRIO_CLS[g.prioritas]}`}>{g.prioritas}</span></Td>
                    <Td className="whitespace-pre-wrap">{g.rekomendasi || <span className="text-stone-400">—</span>}</Td>
                    <Td>{g.pic || <span className="text-stone-400">—</span>}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {state.gap.map((g, i) => (
          <Card key={g.id} title={`${i + 1}. ${g.area}`} right={<span className={`rounded-sm border px-2 py-0.5 text-xs ${PRIO_CLS[g.prioritas]}`}>{g.prioritas || 'Prioritas belum ditetapkan'}</span>}>
            <details className="no-print mb-3 rounded-md bg-stone-50 px-3 py-2 text-sm">
              <summary className="cursor-pointer text-stone-700">Pertanyaan kunci untuk assessment</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-600">{g.pertanyaanKunci.map((q) => <li key={q}>{q}</li>)}</ul>
            </details>
            <div className="grid gap-3 sm:grid-cols-2">
              <AreaField label="Kondisi saat ini" value={g.kondisi} onChange={(v) => set(g.id, { kondisi: v })} placeholder="Isi setelah assessment" />
              <AreaField label="Permasalahan / gap" value={g.permasalahan} onChange={(v) => set(g.id, { permasalahan: v })} placeholder="Isi setelah verifikasi" />
              <AreaField label="Bukti" value={g.bukti} onChange={(v) => set(g.id, { bukti: v })} placeholder="Dokumen/data pendukung" />
              <AreaField label="Rekomendasi perbaikan" value={g.rekomendasi} onChange={(v) => set(g.id, { rekomendasi: v })} placeholder="Tindakan yang diusulkan" />
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-stone-600">Prioritas</span>
                <SelectField value={g.prioritas} options={PRIORITAS} onChange={(v) => set(g.id, { prioritas: v })} ariaLabel={`Prioritas ${g.area}`} />
              </label>
              <TextField label="PIC" value={g.pic} onChange={(v) => set(g.id, { pic: v })} placeholder="Unit/nama penanggung jawab" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
