import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useStore } from '../state/store'
import { Button, Card, Note, PageHeader, TextField } from '../components/ui'
import type { ProfilRS } from '../types'
import { todayIso } from '../lib/utils'
import { simpanBlob } from '../export/browser'

export default function Pengaturan() {
  const { state, update, replace, reset } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pesan, setPesan] = useState('')
  const setP = (p: Partial<ProfilRS>) => update((s) => { Object.assign(s.profil, p) })

  const ekspor = () => {
    simpanBlob(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), `cadangan-ppra-2027-${todayIso()}.json`)
  }
  const impor = async (f: File) => {
    try {
      replace(JSON.parse(await f.text()))
      setPesan('Data berhasil dipulihkan dari file cadangan.')
    } catch {
      setPesan('File tidak dapat dibaca. Pastikan memilih file cadangan JSON dari aplikasi ini.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil & Data" desc="Informasi dasar yang dipakai di seluruh aplikasi dan dokumen, serta cadangan data." />
      <Card title="Profil">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nama rumah sakit" value={state.profil.namaRS} onChange={(v) => setP({ namaRS: v })} />
          <TextField label="Ketua Komite PPRA" value={state.profil.namaKetua} onChange={(v) => setP({ namaKetua: v })} />
          <TextField label="Ketua sebelumnya" value={state.profil.ketuaSebelumnya} onChange={(v) => setP({ ketuaSebelumnya: v })} />
          <TextField label="Nama Direktur" value={state.profil.namaDirektur} onChange={(v) => setP({ namaDirektur: v })} placeholder="Perlu konfirmasi" />
          <TextField label="Nomor SK Komite PPRA (terbaru)" value={state.profil.nomorSK} onChange={(v) => setP({ nomorSK: v })} placeholder="Perlu konfirmasi" />
          <TextField label="Tanggal mulai persiapan (Hari 1)" type="date" value={state.profil.tanggalMulaiPersiapan} onChange={(v) => setP({ tanggalMulaiPersiapan: v })} />
          <TextField label="Tanggal presentasi kepada Direktur" type="date" value={state.profil.tanggalPresentasi} onChange={(v) => setP({ tanggalPresentasi: v })} />
        </div>
      </Card>
      <Card title="Penyimpanan dan cadangan">
        <Note>Data disimpan otomatis di browser perangkat ini (localStorage), tanpa server. Data tidak berpindah ke perangkat lain. Unduh cadangan secara berkala, terutama sebelum mengganti perangkat atau membersihkan riwayat browser. Jangan menyimpan data pasien di aplikasi ini.</Note>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" onClick={ekspor}><Download size={14} /> Unduh cadangan (JSON)</Button>
          <Button onClick={() => fileRef.current?.click()}><Upload size={14} /> Pulihkan dari cadangan</Button>
          <Button variant="danger" onClick={() => { if (confirm('Semua isian akan dihapus dan dikembalikan ke isi awal. Lanjutkan?')) { reset(); setPesan('Data dikembalikan ke isi awal.') } }}>
            <RotateCcw size={14} /> Kembalikan ke isi awal
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) impor(f); e.target.value = '' }} />
        </div>
        {pesan && <p className="mt-3 text-sm text-ink-800" role="status">{pesan}</p>}
      </Card>
    </div>
  )
}
