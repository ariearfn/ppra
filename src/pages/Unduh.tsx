import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, FileType2, Loader2 } from 'lucide-react'
import { useStore } from '../state/store'
import { Button, Card, Note, PageHeader } from '../components/ui'
import { FILES } from '../export/common'
import { unduhDokumen, type JenisDokumen } from '../export/browser'

const DOKUMEN: { jenis: JenisDokumen; judul: string; format: string; icon: typeof FileText; isi: string }[] = [
  { jenis: 'panduan', judul: 'Panduan Ketua PPRA 2027', format: 'PDF', icon: FileText, isi: 'Panduan lengkap: pemahaman PPRA, peran ketua, ringkasan program 2026, checklist 7 hari, evaluasi, koordinasi, gap analysis, program kerja, KPI, timeline, pelaporan, regulasi, dan glosarium. Status checklist dan isian tabel mengikuti data terkini.' },
  { jenis: 'program', judul: 'Program Kerja PPRA 2027', format: 'DOCX (Word, dapat diedit)', icon: FileType2, isi: 'Format formal rumah sakit: pendahuluan, latar belakang, tujuan, kegiatan pokok dan rincian, cara pelaksanaan, sasaran, jadwal, evaluasi dan pelaporan, anggaran, penutup, lembar pengesahan. Bagian yang belum lengkap ditandai [Perlu konfirmasi] dengan sorotan kuning.' },
  { jenis: 'tracker', judul: 'Tracker PPRA 2027', format: 'XLSX (Excel)', icon: FileSpreadsheet, isi: 'Sheet kegiatan & timeline, persiapan 7 hari, evaluasi 2026, gap analysis, KPI per triwulan, anggaran dengan rumus otomatis, daftar konfirmasi, dan regulasi. Kolom status memakai daftar pilihan.' },
  { jenis: 'progress', judul: 'Progress Report PPRA 2027', format: 'PDF', icon: FileText, isi: 'Laporan eksekutif untuk Direktur (bagian A–G). Narasi diambil dari draft "Progress Report ke Direktur" terbaru di menu Pelaporan; bagian kosong diberi garis isian. Tabel diambil otomatis.' },
]

export default function Unduh() {
  const { state } = useStore()
  const [loading, setLoading] = useState<JenisDokumen | null>(null)
  const [error, setError] = useState('')

  const unduh = async (j: JenisDokumen) => {
    setLoading(j)
    setError('')
    try {
      await unduhDokumen(j, state)
    } catch (e) {
      setError(`Dokumen gagal dibuat: ${(e as Error).message}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Unduh Dokumen" desc="Dokumen dibuat langsung di browser dari data terkini aplikasi. Tidak ada data yang dikirim ke server." />
      <Note>Dokumen adalah draft kerja. Periksa kembali isian bertanda "Perlu konfirmasi" sebelum dokumen disampaikan atau disahkan.</Note>
      <div className="grid gap-4 md:grid-cols-2">
        {DOKUMEN.map((d) => (
          <Card key={d.jenis}>
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-navy-50 p-2 text-navy-700"><d.icon size={22} /></div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-navy-900">{d.judul}</h2>
                <p className="text-xs text-slate-500">{d.format} · {FILES[d.jenis]}</p>
                <p className="mt-2 text-sm text-slate-600">{d.isi}</p>
                <Button variant="primary" className="mt-3" onClick={() => unduh(d.jenis)} disabled={loading !== null}>
                  {loading === d.jenis ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Unduh {d.format.split(' ')[0]}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  )
}
