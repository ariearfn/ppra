import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../state/store'
import { Badge, Button, Card, Checkbox, EmptyState, Legend, ProgressBar, TextField } from '../components/ui'
import { TARGET_MINGGU_PERSIAPAN, TUJUAN_2026 } from '../data/fakta2026'
import { daftarTenggat, evaluasiStats, formatTanggal, persiapanStats, timelineStats, todayIso, totalAnggaran, uid, rupiah } from '../lib/utils'

function Stat({ label, value, sub, href, flag }: { label: string; value: string | number; sub?: string; href: string; flag?: boolean }) {
  return (
    <a href={href} className="group block bg-paper px-4 py-5 transition-colors hover:bg-ink-100 max-xl:last:col-span-2 sm:px-5">
      <div className="text-xs text-ink-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink-900">{value}</div>
      {sub && <div className={`mt-1 font-mono text-xs ${flag ? 'text-accent' : 'text-ink-500'}`}>{sub}</div>}
    </a>
  )
}

function Counts({ rows }: { rows: [string, number][] }) {
  return (
    <dl className="divide-y divide-ink-200 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between py-1.5">
          <dt className="text-ink-600">{k}</dt>
          <dd className="font-mono text-xs text-ink-900">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((t, i) => (
        <li key={t} className="grid grid-cols-[1.75rem_1fr] text-sm leading-relaxed text-ink-600">
          <span className="font-mono text-xs leading-6 text-ink-400">{String(i + 1).padStart(2, '0')}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
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
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs text-ink-500">Dashboard persiapan · {state.profil.namaRS}</p>
        <h1 className="mt-4 max-w-3xl text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink-900 sm:mt-5 sm:text-5xl">
          Persiapan Program Kerja PPRA 2027
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-pretty text-ink-600 sm:mt-5">
          {state.profil.namaKetua}, Ketua Komite PPRA <Badge sumber="konfirmasi">SK perlu konfirmasi</Badge>. Progres persiapan disampaikan kepada Direktur pada{' '}
          <span className="text-ink-900">{state.profil.tanggalPresentasi ? formatTanggal(state.profil.tanggalPresentasi) : 'awal Desember 2026'}</span>.
        </p>
        <div className="mt-6">
          <Legend />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px border-y border-ink-900 bg-ink-200 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Persiapan 7 hari" value={`${ps.pct}%`} sub={`${ps.done} dari ${ps.total} butir`} href="#/persiapan" />
        <Stat label="Program kerja 2027" value={state.program.length} sub={`${jumlahKegiatan} kegiatan pokok`} href="#/program" />
        <Stat label="Kegiatan 2026 terverifikasi" value={`${state.evaluasi.length - ev['Belum diverifikasi']}/${state.evaluasi.length}`} sub={`${ev['Terlaksana']} terlaksana`} href="#/evaluasi" />
        <Stat label="Info perlu konfirmasi" value={konfirmasiTerbuka} sub={`dari ${state.konfirmasi.length} butir`} href="#/konfirmasi" flag={konfirmasiTerbuka > 0} />
        <Stat label="Draft anggaran 2027" value={ang.total ? rupiah(ang.total) : '—'} sub={ang.lengkap ? 'lengkap' : 'belum lengkap'} href="#/program" flag={!ang.lengkap} />
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card title="Progres per hari" right={<a className="no-print link-underline text-sm text-ink-500 hover:text-ink-900" href="#/persiapan">Buka checklist →</a>}>
          <ol className="divide-y divide-ink-200">
            {ps.perHari.map((h) => (
              <li key={h.hari}>
                <a href="#/persiapan" className="grid grid-cols-[1.75rem_1fr] items-center py-3 transition-colors hover:bg-ink-100/50">
                  <span className="font-mono text-xs text-ink-400">{String(h.hari).padStart(2, '0')}</span>
                  <ProgressBar value={Math.round((h.done / h.total) * 100)} label={h.judul} />
                </a>
              </li>
            ))}
          </ol>
        </Card>
        <div className="space-y-10">
          <Card title="Evaluasi 2026">
            <Counts rows={Object.entries(ev)} />
          </Card>
          <Card title="Kegiatan 2027">
            <Counts rows={[['Selesai', tl.Selesai], ['Berjalan', tl.Berjalan], ['Belum mulai', tl['Belum mulai']], ['Tertunda', tl.Tertunda]]} />
          </Card>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <Card title="Tenggat terdekat" right={<span className="font-mono text-xs text-ink-400">{tenggat.length}</span>}>
          {!state.profil.tanggalMulaiPersiapan && (
            <p className="mb-3 text-sm text-ink-500">
              Isi <a href="#/pengaturan" className="text-ink-900 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-900">tanggal mulai persiapan</a> agar tenggat Hari 1–7 muncul di sini.
            </p>
          )}
          {tenggat.length === 0 ? (
            <EmptyState title="Belum ada tenggat mendatang">Tenggat diambil dari jadwal persiapan, timeline 2027, dan pengingat Anda.</EmptyState>
          ) : (
            <ul className="divide-y divide-ink-200">
              {tenggat.map((t, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                  <a href={t.href} className="text-sm text-ink-900 hover:text-accent">
                    {t.label}
                    <span className="mt-0.5 block text-xs text-ink-500">{t.sumber}</span>
                  </a>
                  <span className="whitespace-nowrap font-mono text-xs text-ink-600">{formatTanggal(t.tanggal)}</span>
                </li>
              ))}
            </ul>
          )}
          {terlewat.length > 0 && <p className="mt-3 text-xs text-accent">{terlewat.length} tenggat sudah lewat dan belum ditandai selesai.</p>}
        </Card>

        <Card title="Pengingat">
          {otomatis.length > 0 && (
            <ul className="mb-5 space-y-2">
              {otomatis.map((t, i) => (
                <li key={i} className="grid grid-cols-[0.875rem_1fr] text-sm leading-relaxed text-ink-600">
                  <span className="text-accent" aria-hidden>–</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-1">
            {state.pengingat.map((p) => (
              <div key={p.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Checkbox id={p.id} checked={p.selesai} onChange={(v) => update((s) => { s.pengingat.find((x) => x.id === p.id)!.selesai = v })}>
                    {p.teks} {p.tanggal && <span className="font-mono text-xs text-ink-500">· {formatTanggal(p.tanggal)}</span>}
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

      <div className="grid gap-12 lg:grid-cols-2">
        <Card title="Target akhir minggu persiapan" right={<Badge sumber="rekomendasi" />}>
          <NumberedList items={TARGET_MINGGU_PERSIAPAN} />
        </Card>
        <Card title="Tujuan program PPRA RSCC" right={<Badge sumber="fakta" />}>
          <NumberedList items={TUJUAN_2026} />
          <p className="mt-4 text-xs text-ink-500">Tujuan pada dokumen Program Kerja 2026; dapat dipertahankan untuk 2027 setelah ditinjau.</p>
        </Card>
      </div>

      <Card title="Tautan cepat" className="no-print">
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
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
            <li key={href} className="border-b border-ink-200">
              <a href={href} className="group flex items-baseline justify-between gap-3 py-2.5 text-sm text-ink-900">
                <span className="link-underline">{label}</span>
                <span className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-ink-900" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
