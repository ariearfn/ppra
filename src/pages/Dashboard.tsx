import { useState } from 'react'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { Badge, Button, Card, Checkbox, EmptyState, Legend, PageHeader, ProgressBar, TextField } from '../components/ui'
import { TARGET_MINGGU_PERSIAPAN, TUJUAN_2026 } from '../data/fakta2026'
import { daftarTenggat, evaluasiStats, formatTanggal, persiapanStats, timelineStats, todayIso, totalAnggaran, uid, rupiah } from '../lib/utils'

function Stat({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href: string }) {
  return (
    <a href={href} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-navy-200 hover:bg-navy-50/40">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-navy-900">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </a>
  )
}

export default function Dashboard() {
  const { state, update } = useStore()
  const [baru, setBaru] = useState('')
  const [tglBaru, setTglBaru] = useState('')
  const ps = persiapanStats(state)
  const ev = evaluasiStats(state)
  const tl = timelineStats(state)
  const ang = totalAnggaran(state)
  const konfirmasiTerbuka = state.konfirmasi.filter((k) => k.status !== 'Sudah dikonfirmasi').length
  const targetKosong = state.kpi.filter((k) => !k.target.trim()).length
  const today = todayIso()
  const tenggat = daftarTenggat(state).filter((t) => t.tanggal >= today).slice(0, 7)
  const terlewat = daftarTenggat(state).filter((t) => t.tanggal < today && t.sumber !== 'Timeline 2027 (akhir bulan)')
  const jumlahKegiatan = state.program.reduce((n, p) => n + p.kegiatan.split('\n').filter((s) => s.trim()).length, 0)

  const otomatis: string[] = []
  const sk = state.konfirmasi.find((k) => k.id === 'kf-sk')
  if (sk && sk.status !== 'Sudah dikonfirmasi') otomatis.push('SK Komite PPRA dan penetapan ketua baru belum dikonfirmasi. Mandat formal diperlukan sebelum meminta tugas lintas unit.')
  if (ev['Belum diverifikasi'] > 0) otomatis.push(`${ev['Belum diverifikasi']} kegiatan 2026 masih "Belum diverifikasi". Cocokkan dengan bukti sebelum presentasi.`)
  if (!state.profil.tanggalPresentasi) otomatis.push('Tanggal presentasi kepada Direktur belum diisi (target: awal Desember 2026).')
  if (targetKosong > 0) otomatis.push(`${targetKosong} indikator belum memiliki target. Target ditetapkan setelah baseline RS diketahui.`)
  if (!ang.lengkap) otomatis.push('Rincian anggaran 2027 belum lengkap (volume/harga satuan perlu konfirmasi).')

  const addPengingat = () => {
    if (!baru.trim()) return
    update((s) => {
      s.pengingat.push({ id: uid('pg'), teks: baru.trim(), tanggal: tglBaru, selesai: false })
    })
    setBaru('')
    setTglBaru('')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Persiapan PPRA 2027"
        desc={
          <>
            {state.profil.namaKetua} · Ketua Komite PPRA {state.profil.namaRS} <Badge sumber="konfirmasi">SK perlu konfirmasi</Badge>
            <br />
            Target: progress persiapan disampaikan kepada Direktur pada{' '}
            <strong>{state.profil.tanggalPresentasi ? formatTanggal(state.profil.tanggalPresentasi) : 'awal Desember 2026'}</strong>.
          </>
        }
      />
      <Legend />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Progres persiapan 7 hari" value={`${ps.pct}%`} sub={`${ps.done} dari ${ps.total} butir`} href="#/persiapan" />
        <Stat label="Program kerja 2027" value={state.program.length} sub={`${jumlahKegiatan} kegiatan pokok`} href="#/program" />
        <Stat label="Kegiatan 2026 terverifikasi" value={`${state.evaluasi.length - ev['Belum diverifikasi']}/${state.evaluasi.length}`} sub={`${ev['Terlaksana']} terlaksana`} href="#/evaluasi" />
        <Stat label="Info perlu konfirmasi" value={konfirmasiTerbuka} sub={`dari ${state.konfirmasi.length} butir`} href="#/konfirmasi" />
        <Stat label="Draft anggaran 2027" value={ang.total ? rupiah(ang.total) : '—'} sub={ang.lengkap ? 'lengkap' : 'belum lengkap'} href="#/program" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Progres per hari" className="lg:col-span-2" right={<a className="no-print text-sm text-navy-700 hover:underline" href="#/persiapan">Buka checklist</a>}>
          <div className="space-y-3">
            {ps.perHari.map((h) => (
              <a key={h.hari} href="#/persiapan" className="block">
                <ProgressBar value={Math.round((h.done / h.total) * 100)} label={`Hari ${h.hari} – ${h.judul}`} />
              </a>
            ))}
          </div>
        </Card>
        <Card title="Status kegiatan">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Evaluasi 2026</h3>
          <dl className="mb-4 space-y-1 text-sm">
            {Object.entries(ev).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-slate-600">{k}</dt>
                <dd className="font-medium text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Kegiatan 2027 (timeline)</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-slate-600">Selesai</dt><dd className="font-medium">{tl.Selesai}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Berjalan</dt><dd className="font-medium">{tl.Berjalan}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Belum mulai</dt><dd className="font-medium">{tl['Belum mulai']}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Tertunda</dt><dd className="font-medium">{tl.Tertunda}</dd></div>
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Tenggat terdekat">
          {!state.profil.tanggalMulaiPersiapan && (
            <p className="mb-3 text-sm text-slate-600">
              Isi <a href="#/pengaturan" className="text-navy-700 underline">tanggal mulai persiapan</a> agar tenggat Hari 1–7 muncul di sini.
            </p>
          )}
          {tenggat.length === 0 ? (
            <EmptyState title="Belum ada tenggat mendatang">Tenggat diambil dari jadwal persiapan, timeline 2027, dan pengingat Anda.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {tenggat.map((t, i) => (
                <li key={i} className="flex items-start justify-between gap-3 py-2">
                  <a href={t.href} className="text-sm text-slate-800 hover:text-navy-700">
                    {t.label}
                    <span className="block text-xs text-slate-500">{t.sumber}</span>
                  </a>
                  <span className="whitespace-nowrap text-sm font-medium text-navy-800">{formatTanggal(t.tanggal)}</span>
                </li>
              ))}
            </ul>
          )}
          {terlewat.length > 0 && <p className="mt-2 text-xs text-amber-700">{terlewat.length} tenggat sudah lewat dan belum ditandai selesai.</p>}
        </Card>

        <Card title="Pengingat">
          {otomatis.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {otomatis.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-1">
            {state.pengingat.map((p) => (
              <div key={p.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Checkbox id={p.id} checked={p.selesai} onChange={(v) => update((s) => { s.pengingat.find((x) => x.id === p.id)!.selesai = v })}>
                    {p.teks} {p.tanggal && <span className="text-xs text-slate-500">· {formatTanggal(p.tanggal)}</span>}
                  </Checkbox>
                </div>
                <Button variant="ghost" title="Hapus pengingat" onClick={() => update((s) => { s.pengingat = s.pengingat.filter((x) => x.id !== p.id) })}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
          <div className="no-print mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="flex-1"><TextField value={baru} onChange={setBaru} placeholder="Tambah pengingat, mis. hubungi Farmasi" ariaLabel="Teks pengingat" /></div>
            <div className="sm:w-40"><TextField type="date" value={tglBaru} onChange={setTglBaru} ariaLabel="Tanggal pengingat" /></div>
            <Button variant="primary" onClick={addPengingat}><Plus size={14} /> Tambah</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Target akhir minggu persiapan" right={<Badge sumber="rekomendasi" />}>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {TARGET_MINGGU_PERSIAPAN.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </Card>
        <Card title="Tujuan program PPRA RSCC" right={<Badge sumber="fakta" />}>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {TUJUAN_2026.map((t) => <li key={t}>{t}</li>)}
          </ol>
          <p className="mt-3 text-xs text-slate-500">Tujuan pada dokumen Program Kerja 2026; dapat dipertahankan untuk 2027 setelah ditinjau.</p>
        </Card>
      </div>

      <Card title="Tautan cepat" className="no-print">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['#/persiapan', 'Lanjutkan checklist 7 hari'],
            ['#/evaluasi', 'Verifikasi kegiatan 2026'],
            ['#/konfirmasi', 'Daftar info perlu konfirmasi'],
            ['#/pelaporan', 'Susun progress report'],
            ['#/program', 'Edit program & anggaran 2027'],
            ['#/kpi', 'Isi baseline & target KPI'],
            ['#/koordinasi', 'Siapkan pertemuan unit'],
            ['#/unduh', 'Unduh dokumen'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-navy-800 hover:border-navy-200 hover:bg-navy-50">
              {label} <ArrowRight size={14} />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
