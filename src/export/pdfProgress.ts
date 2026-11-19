import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { AppState } from '../types'
import { AGENDA_PRESENTASI } from '../data/fakta2026'
import { TARGET_FALLBACK } from '../data/kpi'
import { evaluasiStats, formatTanggal, parseVolume, persiapanStats, rupiah, totalAnggaran, totalProgram } from '../lib/utils'
import { GREY, NAVY, PK, identitas, latestDraft, lines, orPK, tanggalDokumen } from './common'
import { baseDoc, check, h1, h2, label, note, p, small, table, writeLines } from './pdfHelpers'

const KEPUTUSAN_DEFAULT = [
  'Penetapan SK Ketua dan struktur Komite PPRA 2027.',
  'Penugasan anggota Komite PPRA dari unit terkait (klinisi KSM, keperawatan, farmasi, laboratorium mikrobiologi klinik, PPI, KFT).',
  'Persetujuan akses data penggunaan antibiotik, laboratorium, dan rekam medis sesuai ketentuan kerahasiaan pasien.',
  'Persetujuan draft Program Kerja PPRA 2027 untuk difinalisasi.',
  'Persetujuan mekanisme dan besaran anggaran 2027.',
  'Arahan jadwal rapat koordinasi dan pelaporan triwulan.',
]

function isianAtauGaris(v: string | undefined, n = 4): Content {
  return v && v.trim() ? p(v.trim()) : writeLines(n)
}

export function progressDocDef(state: AppState): TDocumentDefinitions {
  const id = identitas(state)
  const d = latestDraft(state, 'progress')
  const v = d?.nilai ?? {}
  const ev = evaluasiStats(state)
  const ps = persiapanStats(state)
  const ang = totalAnggaran(state)
  const terverifikasi = state.evaluasi.length - ev['Belum diverifikasi']
  const konfirmasiTerbuka = state.konfirmasi.filter((k) => k.status !== 'Sudah dikonfirmasi')
  const prioritas = state.gap.filter((g) => g.prioritas)

  const header: Content[] = [
    { text: `KOMITE PPRA ${id.rs.toUpperCase()}`, fontSize: 9, bold: true, color: GREY, characterSpacing: 1 },
    { text: 'Progress Report Persiapan PPRA 2027', fontSize: 20, bold: true, color: NAVY, margin: [0, 2, 0, 2] },
    { text: 'Laporan kepada Direktur', fontSize: 11, color: '#0f1f4a', margin: [0, 0, 0, 10] },
    table(['Komponen', 'Keterangan'], [
      ['Kepada', `Direktur ${id.rs}${state.profil.namaDirektur ? ` (${state.profil.namaDirektur})` : ''}`],
      ['Dari', `${id.ketua}, Ketua Komite PPRA (penetapan SK: ${state.profil.nomorSK || PK})`],
      ['Tanggal', v.tanggal ? formatTanggal(v.tanggal) : state.profil.tanggalPresentasi ? formatTanggal(state.profil.tanggalPresentasi) : `${tanggalDokumen()} (draft)`],
      ['Sumber internal', 'Program Kerja Komite PPRA 2026 RS Condong Catur (disahkan 30 Januari 2026); hasil persiapan November 2026'],
    ], [90, '*']),
    {
      columns: [
        { stack: [{ text: `${ps.pct}%`, fontSize: 18, bold: true, color: NAVY }, { text: 'progres persiapan 7 hari', fontSize: 8, color: GREY }] },
        { stack: [{ text: `${terverifikasi}/${state.evaluasi.length}`, fontSize: 18, bold: true, color: NAVY }, { text: 'kegiatan 2026 terverifikasi', fontSize: 8, color: GREY }] },
        { stack: [{ text: String(state.program.length), fontSize: 18, bold: true, color: NAVY }, { text: 'kelompok program 2027', fontSize: 8, color: GREY }] },
        { stack: [{ text: String(konfirmasiTerbuka.length), fontSize: 18, bold: true, color: '#92400e' }, { text: 'hal perlu konfirmasi', fontSize: 8, color: GREY }] },
      ],
      margin: [0, 4, 0, 10],
    },
  ]

  const A: Content[] = [h1('A. Ringkasan Eksekutif', { pageBreak: false }), isianAtauGaris(v.a, 6)]
  if (!v.a) A.push(small('Isi ringkas: status serah terima, status SK, temuan utama evaluasi 2026, gap prioritas, dan keputusan yang diminta.'))

  const B: Content[] = [
    h1('B. Evaluasi Program 2026', { pageBreak: false }),
    p(`Status: ${Object.entries(ev).map(([k, n]) => `${k} ${n}`).join(' · ')}.`),
    table(['Kegiatan (dok. 2026)', 'Rencana', 'Status', 'Bukti', 'Kendala / tindak lanjut'], state.evaluasi.map((r) => [
      { text: r.kegiatan, bold: true }, r.rencana, { text: r.status, color: r.status === 'Belum diverifikasi' ? '#92400e' : undefined }, r.bukti || '—', [r.kendala, r.tindakLanjut].filter(Boolean).join(' / ') || '—',
    ]), [95, 70, 65, '*', '*'], { fontSize: 8 }),
    ...(v.b ? [p(v.b)] : []),
  ]

  const C: Content[] = [
    h1('C. Assessment Kondisi Rumah Sakit', { pageBreak: false }),
    isianAtauGaris(v.c, 4),
    table(['Hal', 'Status'], state.konfirmasi.slice(0, 10).map((k) => [k.pertanyaan, k.status === 'Sudah dikonfirmasi' ? orPK(k.jawaban, 'Sudah dikonfirmasi') : { text: k.status, color: '#92400e' }]), ['*', 150], { fontSize: 8 }),
  ]

  const D: Content[] = [
    h1('D. Gap Analysis dan Masalah Prioritas', { pageBreak: false }),
    isianAtauGaris(v.d, 3),
    prioritas.length
      ? table(['Area', 'Permasalahan', 'Prioritas', 'Rekomendasi', 'PIC'], prioritas.map((g) => [g.area, g.permasalahan || '—', g.prioritas, g.rekomendasi || '—', g.pic || '—']), [90, '*', 45, '*', 60], { fontSize: 8 })
      : note('Prioritas gap belum ditetapkan. Area yang dinilai: tata kelola; kebijakan dan panduan antibiotik; audit kualitas; pemantauan kuantitas; surveilans resistansi; kesiapan laboratorium; kolaborasi PPRA–PPI; edukasi; forum kajian kasus infeksi; monev dan pelaporan.', 'warn'),
  ]

  const E: Content[] = [
    h1('E. Rencana Program 2027'),
    ...(v.e ? [p(v.e)] : []),
    table(['Program', 'Kegiatan pokok', 'Penanggung jawab', 'Timeline'], state.program.map((pr) => [
      { text: `${pr.kode}. ${pr.nama}`, bold: true }, { ul: lines(pr.kegiatan), fontSize: 7.5 }, orPK(pr.unitPJ), orPK(pr.timeline),
    ]), [95, '*', 90, 95], { fontSize: 8 }),
    h2('Indikator', 'regulasi'),
    table(['Indikator', 'Kategori', 'Baseline', 'Target'], state.kpi.map((k) => [k.nama, k.kategori === 'wajib' ? 'Wajib (regulasi)' : 'Usulan', k.baseline || PK, k.target || TARGET_FALLBACK]), ['*', 70, 70, 100], { fontSize: 8 }),
    small('Tidak ada regulasi yang menetapkan angka target indikator PPRA; target ditetapkan RS setelah baseline tersedia.'),
  ]

  const rowsAng: Content[][] = []
  for (const pr of state.program) {
    const t = totalProgram(pr)
    rowsAng.push([{ text: `${pr.kode}. ${pr.nama}`, fontSize: 8 }, { text: pr.anggaran.map((b) => b.uraian).join('; '), fontSize: 7.5 }, { text: t.lengkap ? rupiah(t.total) : `${rupiah(t.total)} (belum lengkap)`, alignment: 'right', fontSize: 8, color: t.lengkap ? undefined : '#92400e' }])
  }
  const F: Content[] = [
    h1('F. Rencana Anggaran', { pageBreak: false }),
    table(['Program', 'Pos kegiatan', 'Subtotal'], [...rowsAng, [{ text: 'Total draft', bold: true }, '', { text: rupiah(ang.total), bold: true, alignment: 'right' }]], [120, '*', 95]),
    ...(ang.lengkap ? [] : [note('Sebagian pos anggaran belum memiliki volume/harga satuan (Perlu konfirmasi). Anggaran 2026 (Rp6.600.000) hanya referensi historis dan tidak disalin sebagai anggaran 2027.', 'warn')]),
    ...(v.f ? [p(v.f)] : []),
  ]
  const lengkapRows = state.program.flatMap((pr) => pr.anggaran.filter((b) => parseVolume(b.volume) !== null && b.hargaSatuan !== null))
  if (lengkapRows.length) F.push(small(`${lengkapRows.length} pos anggaran sudah memiliki volume dan harga satuan.`))

  const keputusan = v.g ? lines(v.g) : KEPUTUSAN_DEFAULT
  const G: Content[] = [
    h1('G. Dukungan dan Keputusan yang Dibutuhkan dari Direktur', { pageBreak: false }),
    ...(v.g ? [] : [p([label('rekomendasi'), ' Daftar usulan; sesuaikan sebelum disampaikan.'])]),
    ...keputusan.map((k) => check(k)),
    h2('Agenda paparan (10–20 menit)'),
    { ol: AGENDA_PRESENTASI, fontSize: 8.5, margin: [0, 0, 0, 8] },
    h2('Hal yang masih perlu dikonfirmasi', 'konfirmasi'),
    konfirmasiTerbuka.length
      ? table(['Hal', 'Ditanyakan ke'], konfirmasiTerbuka.map((k) => [k.pertanyaan, k.ditanyakanKe]), ['*', 130], { fontSize: 7.5 })
      : p('Seluruh butir sudah dikonfirmasi.'),
    {
      columns: [
        { stack: [{ text: 'Mengetahui,' }, { text: `Direktur ${id.rs}` }, { text: '\n\n\n\n' }, { text: state.profil.namaDirektur || '(.................................)', bold: true }], alignment: 'center' },
        { stack: [{ text: 'Disusun oleh,' }, { text: 'Ketua Komite PPRA' }, { text: '\n\n\n\n' }, { text: id.ketua, bold: true }], alignment: 'center' },
      ],
      margin: [0, 24, 0, 0],
      unbreakable: true,
    } as Content,
  ]

  return baseDoc('Progress Report Persiapan PPRA 2027', id.rs, [...header, ...A, ...B, ...C, ...D, ...E, ...F, ...G])
}
