import { ExternalLink, Printer } from 'lucide-react'
import { Badge, Button, Card, Note, PageHeader, Td, Th } from '../components/ui'
import { KEWAJIBAN, KONFIRMASI_REGULASI, REGULASI, REGULASI_META, SIFAT_LABEL, STATUS_REGULASI_LABEL, USULAN_REGULASI, dasarSingkat, namaRegulasi } from '../data/regulasi'
import type { StatusRegulasi } from '../types'
import { formatTanggal } from '../lib/utils'

const STATUS_CLS: Record<StatusRegulasi, string> = {
  berlaku: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  dicabut: 'bg-red-50 text-red-700 border-red-200',
  pedoman_teknis: 'bg-navy-50 text-navy-800 border-navy-200',
  dokumen_strategi: 'bg-slate-50 text-slate-700 border-slate-300',
  perlu_konfirmasi: 'bg-amber-50 text-amber-800 border-amber-300',
}

export default function Regulasi() {
  const urut = [...REGULASI].sort((a, b) => Number(b.disebut_di_brief) - Number(a.disebut_di_brief))
  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulasi & Pedoman"
        desc={<>Status per verifikasi {formatTanggal(REGULASI_META.tanggalVerifikasi)}. {REGULASI_META.catatan}</>}
        actions={<Button onClick={() => window.print()}><Printer size={14} /> Cetak</Button>}
      />
      <Note tone="warn">
        Jangan mengutip KMK HK.01.07/MENKES/1128/2022 (sudah dicabut); gunakan KMK HK.01.07/MENKES/1596/2024 (STARKES, PROGNAS 6). Dua dokumen yang naskah resminya belum ditemukan
        (SE Dirjen Yankes 44930/2024 dan Kepdirjen Keslan 3610/2025) tetap berstatus <strong>Perlu konfirmasi</strong>.
      </Note>

      <div className="space-y-3">
        {urut.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className={`font-semibold ${r.status === 'dicabut' ? 'text-slate-500 line-through' : 'text-navy-900'}`}>{namaRegulasi(r)}</h2>
                <p className="text-sm text-slate-700">{r.judul}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${STATUS_CLS[r.status]}`}>{STATUS_REGULASI_LABEL[r.status]}</span>
                <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600">{SIFAT_LABEL[r.sifat]}</span>
                {r.disebut_di_brief && <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600">Disebut di brief</span>}
              </div>
            </div>
            {r.pasal_kunci && <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-slate-600">{r.pasal_kunci.map((p) => <li key={p}>{p}</li>)}</ul>}
            {r.syarat && <p className="mt-2 text-sm text-slate-600"><span className="font-medium">Syarat: </span>{r.syarat}</p>}
            {r.catatan && <p className="mt-2 text-sm text-slate-600">{r.catatan}</p>}
            {r.url.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                {r.url.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-navy-700 hover:underline">
                    {new URL(u).hostname} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card title="Kewajiban PPRA menurut regulasi" right={<Badge sumber="regulasi" />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead><tr><Th className="w-12">ID</Th><Th>Kewajiban</Th><Th>Dasar</Th><Th>Bukti</Th><Th>Frekuensi</Th></tr></thead>
            <tbody>
              {KEWAJIBAN.map((k) => (
                <tr key={k.id}>
                  <Td>{k.id}</Td>
                  <Td>
                    {k.kewajiban}
                    {k.tenggat && <span className="mt-1 block text-xs text-amber-700">Tenggat: {k.tenggat.replace('perlu_konfirmasi', 'Perlu konfirmasi')}</span>}
                    {k.syarat && <span className="mt-1 block text-xs text-amber-700">Syarat: {k.syarat}</span>}
                  </Td>
                  <Td className="text-xs">{k.dasar.map(dasarSingkat).join('; ')}</Td>
                  <Td>{k.bukti}</Td>
                  <Td>{k.frekuensi}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Usulan (bukan kewajiban)" right={<Badge sumber="rekomendasi" />}>
          <ul className="space-y-2 text-sm text-slate-700">
            {USULAN_REGULASI.map((u) => <li key={u.id}><span className="font-medium">{u.id}.</span> {u.usulan}{u.dasar.length > 0 && <span className="text-xs text-slate-500"> ({u.dasar.map(dasarSingkat).join('; ')})</span>}</li>)}
          </ul>
        </Card>
        <Card title="Regulasi yang perlu dikonfirmasi" right={<Badge sumber="konfirmasi" />}>
          <ul className="space-y-2 text-sm text-slate-700">
            {KONFIRMASI_REGULASI.map((k) => <li key={k.id}><span className="font-medium">{k.id}.</span> {k.item} <span className="text-xs text-slate-500">→ {k.pihak}</span></li>)}
          </ul>
        </Card>
      </div>
    </div>
  )
}
