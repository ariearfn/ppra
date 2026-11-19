import type { EvaluasiRow } from '../types'

const row = (id: string, kegiatan: string, rencana: string, buktiDicari: string, tindakLanjut: string, catatan = ''): EvaluasiRow => ({
  id,
  kegiatan,
  rencana,
  buktiDicari,
  status: 'Belum diverifikasi',
  bukti: '',
  kendala: '',
  catatan,
  tindakLanjut,
})

export const DEFAULT_EVALUASI: EvaluasiRow[] = [
  row('ev-workshop', 'Workshop PPRA', 'Januari 2026', 'Undangan, sertifikat, laporan', 'Konfirmasi peserta'),
  row('ev-komite', 'Pembentukan Komite PPRA', 'Maret 2026', 'SK Direktur', 'Cek masa berlaku SK'),
  row('ev-revisi', 'Revisi kebijakan/pedoman/panduan', 'Mei 2026', 'Dokumen revisi/pengesahan', 'Cek kesesuaian dengan regulasi terbaru'),
  row('ev-sosialisasi', 'Sosialisasi PPRA', 'Juli 2026', 'Materi, daftar hadir, dokumentasi', 'Cek unit peserta'),
  row('ev-implementasi', 'Implementasi PPRA', 'Maret, Juli, September, Desember 2026', 'Audit dan laporan kegiatan', 'Identifikasi kegiatan nyata'),
  row('ev-monev', 'Monitoring dan evaluasi', 'Maret, Juli, September, Desember 2026', 'Notulen dan hasil evaluasi', 'Cek periode triwulan'),
  row('ev-laporan', 'Penyusunan laporan tahunan', 'Desember 2026', 'Draft laporan', 'Siapkan untuk Desember', 'Menurut brief: dalam persiapan.'),
  row('ev-rtl', 'Rencana tindak lanjut', 'Desember 2026', 'Dokumen rencana tindak lanjut', 'Susun berdasarkan hasil evaluasi'),
  row('ev-2027', 'Perencanaan kegiatan PPRA 2027', 'Desember 2026', 'Draft program kerja 2027', 'Susun berdasarkan evaluasi', 'Menurut brief: dalam persiapan (dikerjakan melalui aplikasi ini).'),
]
