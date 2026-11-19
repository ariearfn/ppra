import ExcelJS from 'exceljs'
import type { AppState } from '../types'
import { STATUS_2026, STATUS_KEGIATAN, STATUS_KONFIRMASI, PRIORITAS } from '../types'
import { PERSIAPAN } from '../data/persiapan'
import { BULAN } from '../data/timeline'
import { TARGET_FALLBACK } from '../data/kpi'
import { REGULASI, STATUS_REGULASI_LABEL, SIFAT_LABEL, namaRegulasi } from '../data/regulasi'
import { ANGGARAN_2026 } from '../data/fakta2026'
import { addDays, parseVolume } from '../lib/utils'
import { PK, identitas, tanggalDokumen } from './common'

const NAVY = 'FF1E3A8A'
const HEAD_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1E9F5' } }
const EDIT_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F9FF' } }
const thin: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FFCBD5E1' } }

function sheet(wb: ExcelJS.Workbook, name: string, title: string, cols: { header: string; key: string; width: number; edit?: boolean }[], sub?: string) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 3 }], pageSetup: { orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 } })
  ws.columns = cols.map((c) => ({ key: c.key, width: c.width }))
  ws.getCell('A1').value = title
  ws.getCell('A1').font = { bold: true, size: 14, color: { argb: NAVY } }
  ws.getCell('A2').value = sub ?? ''
  ws.getCell('A2').font = { italic: true, size: 9, color: { argb: 'FF64748B' } }
  const head = ws.getRow(3)
  cols.forEach((c, i) => {
    const cell = head.getCell(i + 1)
    cell.value = c.header
    cell.font = { bold: true, color: { argb: NAVY } }
    cell.fill = HEAD_FILL
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.border = { top: thin, bottom: thin, left: thin, right: thin }
  })
  head.height = 30
  ws.pageSetup.printTitlesRow = '3:3'
  return {
    ws,
    add(values: Record<string, unknown>) {
      const row = ws.addRow(values)
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        cell.alignment = { vertical: 'top', wrapText: true }
        cell.border = { top: thin, bottom: thin, left: thin, right: thin }
        if (cols[col - 1]?.edit) cell.fill = EDIT_FILL
      })
      return row
    },
  }
}

function listValidation(ws: ExcelJS.Worksheet, col: string, from: number, to: number, options: readonly string[]) {
  for (let r = from; r <= to; r++) {
    ws.getCell(`${col}${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${options.filter(Boolean).join(',')}"`] }
  }
}

function statusFormatting(ws: ExcelJS.Worksheet, ref: string, map: Record<string, string>) {
  ws.addConditionalFormatting({
    ref,
    rules: Object.entries(map).map(([text, color], i) => ({
      type: 'containsText',
      operator: 'containsText',
      text,
      priority: i + 1,
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: color } } },
    })),
  })
}

export function trackerWorkbook(state: AppState): ExcelJS.Workbook {
  const id = identitas(state)
  const wb = new ExcelJS.Workbook()
  wb.creator = `Komite PPRA ${id.rs}`
  wb.created = new Date()
  wb.title = 'Tracker PPRA 2027'

  // Petunjuk
  const info = wb.addWorksheet('Petunjuk')
  info.columns = [{ width: 28 }, { width: 100 }]
  const infoRows: [string, string][] = [
    ['Tracker PPRA 2027', ''],
    ['Rumah sakit', id.rs],
    ['Ketua Komite PPRA', `${id.ketua} (penetapan SK: ${state.profil.nomorSK || PK})`],
    ['Dibuat', `${tanggalDokumen()} dari PPRA 2027 Management Kit`],
    ['', ''],
    ['Cara pakai', 'Sel berlatar biru muda dapat diisi. Kolom status memakai daftar pilihan. Kolom Jumlah di sheet Anggaran dihitung otomatis.'],
    ['Perlu konfirmasi', 'Isian yang belum tersedia ditandai "Perlu konfirmasi". Jangan mengisi dengan asumsi.'],
    ['Target indikator', 'Tidak ada regulasi yang menetapkan angka target indikator PPRA. Target ditetapkan RS setelah baseline diketahui.'],
    ['Anggaran 2026', `Referensi historis Rp${ANGGARAN_2026.total.toLocaleString('id-ID')}; jangan disalin sebagai anggaran 2027 tanpa evaluasi.`],
    ['Sheet', 'Kegiatan 2027 · Persiapan 7 Hari · Evaluasi 2026 · Gap Analysis · KPI · Anggaran · Konfirmasi · Regulasi'],
    ['Catatan', 'Alat bantu administratif, bukan pedoman klinis. Jangan memasukkan data pasien.'],
  ]
  infoRows.forEach((r) => info.addRow(r))
  info.getCell('A1').font = { bold: true, size: 16, color: { argb: NAVY } }
  for (let r = 2; r <= infoRows.length; r++) {
    info.getCell(`A${r}`).font = { bold: true }
    info.getCell(`B${r}`).alignment = { wrapText: true, vertical: 'top' }
  }

  // Kegiatan 2027
  const monthCols = BULAN.map((b, i) => ({ header: b, key: `m${i + 1}`, width: 5, edit: true }))
  const keg = sheet(wb, 'Kegiatan 2027', 'Kegiatan dan Timeline 2027', [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Program', key: 'program', width: 26 },
    { header: 'Kegiatan', key: 'kegiatan', width: 44, edit: true },
    { header: 'Jenis', key: 'jenis', width: 12 },
    { header: 'PIC', key: 'pic', width: 24, edit: true },
    { header: 'Tenggat', key: 'tenggat', width: 13, edit: true },
    { header: 'Status', key: 'status', width: 14, edit: true },
    ...monthCols,
    { header: 'Catatan / bukti', key: 'catatan', width: 30, edit: true },
  ], 'Jadwal usulan (rekomendasi). X = bulan pelaksanaan. Tenggat default = akhir bulan terakhir bila tidak diisi.')
  state.timeline.forEach((t, i) => {
    const p = state.program.find((x) => x.id === t.programId)
    const last = t.bulan.length ? Math.max(...t.bulan) : 0
    const row = keg.add({
      no: i + 1,
      program: p ? `${p.kode}. ${p.nama}` : '',
      kegiatan: t.kegiatan,
      jenis: t.jenis,
      pic: t.pic || PK,
      tenggat: t.tenggat ? new Date(t.tenggat + 'T00:00:00') : last ? new Date(2027, last, 0) : '',
      status: t.status,
      ...Object.fromEntries(t.bulan.map((m) => [`m${m}`, 'X'])),
      catatan: '',
    })
    row.getCell('tenggat').numFmt = 'dd/mm/yyyy'
    BULAN.forEach((_, m) => {
      const c = row.getCell(`m${m + 1}`)
      c.alignment = { horizontal: 'center', vertical: 'middle' }
      if (t.bulan.includes(m + 1)) {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: t.jenis === 'evaluasi' ? 'FFD97706' : t.jenis === 'laporan' ? 'FF059669' : NAVY } }
        c.font = { color: { argb: 'FFFFFFFF' }, bold: true }
      }
    })
  })
  const kegEnd = 3 + state.timeline.length
  listValidation(keg.ws, 'G', 4, kegEnd + 30, STATUS_KEGIATAN)
  statusFormatting(keg.ws, `G4:G${kegEnd + 30}`, { Selesai: 'FFD1FAE5', Berjalan: 'FFDBEAFE', Tertunda: 'FFFEE2E2' })
  keg.ws.autoFilter = { from: 'A3', to: `T${kegEnd}` }

  // Persiapan
  const per = sheet(wb, 'Persiapan 7 Hari', 'Checklist Persiapan 7 Hari', [
    { header: 'Hari', key: 'hari', width: 7 },
    { header: 'Tanggal target', key: 'tgl', width: 14, edit: true },
    { header: 'Tahap', key: 'tahap', width: 30 },
    { header: 'Jenis', key: 'jenis', width: 12 },
    { header: 'Butir', key: 'butir', width: 70 },
    { header: 'Selesai', key: 'selesai', width: 10, edit: true },
    { header: 'Catatan', key: 'catatan', width: 34, edit: true },
  ], 'Rencana persiapan (rekomendasi). Kolom Selesai: Ya/Belum.')
  let perCount = 0
  PERSIAPAN.forEach((h) => {
    const tgl = state.profil.tanggalMulaiPersiapan ? new Date(addDays(state.profil.tanggalMulaiPersiapan, h.hari - 1) + 'T00:00:00') : ''
    ;[...h.tugas.map((t) => ['Tugas', t] as const), ...h.deliverable.map((t) => ['Deliverable', t] as const)].forEach(([jenis, t]) => {
      const r = per.add({ hari: h.hari, tgl, tahap: h.judul, jenis, butir: t.teks, selesai: state.persiapan.checked[t.id] ? 'Ya' : 'Belum', catatan: '' })
      r.getCell('tgl').numFmt = 'dd/mm/yyyy'
      perCount++
    })
  })
  listValidation(per.ws, 'F', 4, 3 + perCount, ['Ya', 'Belum'])
  statusFormatting(per.ws, `F4:F${3 + perCount}`, { Ya: 'FFD1FAE5' })

  // Evaluasi 2026
  const ev = sheet(wb, 'Evaluasi 2026', 'Evaluasi Program PPRA 2026', [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kegiatan (dok. 2026)', key: 'kegiatan', width: 32 },
    { header: 'Rencana', key: 'rencana', width: 22 },
    { header: 'Bukti yang dicari', key: 'dicari', width: 26 },
    { header: 'Status', key: 'status', width: 20, edit: true },
    { header: 'Bukti', key: 'bukti', width: 30, edit: true },
    { header: 'Kendala', key: 'kendala', width: 26, edit: true },
    { header: 'Catatan', key: 'catatan', width: 26, edit: true },
    { header: 'Tindak lanjut', key: 'tl', width: 28, edit: true },
  ], 'Kegiatan dan jadwal: Fakta – dokumen Program Kerja PPRA 2026 (disahkan 30 Januari 2026). Status default: Belum diverifikasi.')
  state.evaluasi.forEach((r, i) => ev.add({ no: i + 1, kegiatan: r.kegiatan, rencana: r.rencana, dicari: r.buktiDicari, status: r.status, bukti: r.bukti, kendala: r.kendala, catatan: r.catatan, tl: r.tindakLanjut }))
  listValidation(ev.ws, 'E', 4, 3 + state.evaluasi.length + 20, STATUS_2026)
  statusFormatting(ev.ws, `E4:E${3 + state.evaluasi.length + 20}`, { 'Belum diverifikasi': 'FFFEF3C7', 'Belum terlaksana': 'FFFEE2E2', Sebagian: 'FFDBEAFE', Terlaksana: 'FFD1FAE5' })

  // Gap
  const gap = sheet(wb, 'Gap Analysis', 'Gap Analysis – 10 Area', [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Area', key: 'area', width: 30 },
    { header: 'Kondisi saat ini', key: 'kondisi', width: 34, edit: true },
    { header: 'Permasalahan', key: 'masalah', width: 30, edit: true },
    { header: 'Bukti', key: 'bukti', width: 24, edit: true },
    { header: 'Prioritas', key: 'prio', width: 11, edit: true },
    { header: 'Rekomendasi', key: 'rek', width: 32, edit: true },
    { header: 'PIC', key: 'pic', width: 18, edit: true },
  ], 'Isi berdasarkan hasil assessment dan bukti.')
  state.gap.forEach((g, i) => gap.add({ no: i + 1, area: g.area, kondisi: g.kondisi || 'Isi setelah assessment', masalah: g.permasalahan, bukti: g.bukti, prio: g.prioritas, rek: g.rekomendasi, pic: g.pic }))
  listValidation(gap.ws, 'F', 4, 13, PRIORITAS)
  statusFormatting(gap.ws, 'F4:F13', { Tinggi: 'FFFEE2E2', Sedang: 'FFFEF3C7', Rendah: 'FFD1FAE5' })

  // KPI
  const kpi = sheet(wb, 'KPI', 'Matriks Indikator (KPI) 2027', [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kategori', key: 'kat', width: 16 },
    { header: 'Indikator', key: 'nama', width: 34 },
    { header: 'Definisi', key: 'def', width: 44 },
    { header: 'Dasar/rujukan', key: 'ruj', width: 30 },
    { header: 'Baseline', key: 'baseline', width: 16, edit: true },
    { header: 'Target 2027', key: 'target', width: 18, edit: true },
    { header: 'Capaian TW I', key: 'tw1', width: 12, edit: true },
    { header: 'Capaian TW II', key: 'tw2', width: 12, edit: true },
    { header: 'Capaian TW III', key: 'tw3', width: 12, edit: true },
    { header: 'Capaian TW IV', key: 'tw4', width: 12, edit: true },
    { header: 'Sumber data', key: 'sumber', width: 22 },
    { header: 'PIC', key: 'pic', width: 18, edit: true },
    { header: 'Frekuensi', key: 'frek', width: 16 },
    { header: 'Catatan', key: 'cat', width: 30, edit: true },
  ], 'Wajib = kewajiban dengan dasar regulasi terverifikasi; Usulan = tidak wajib. Tidak ada regulasi yang menetapkan angka target.')
  state.kpi.forEach((k, i) => {
    const r = kpi.add({ no: i + 1, kat: k.kategori === 'wajib' ? 'Wajib (regulasi)' : 'Usulan', nama: k.nama, def: k.definisi, ruj: k.rujukan, baseline: k.baseline || PK, target: k.target || TARGET_FALLBACK, tw1: k.capaian, tw2: '', tw3: '', tw4: '', sumber: k.sumberData, pic: k.pic || PK, frek: k.frekuensi, cat: k.catatan })
    r.getCell('kat').font = { bold: true, color: { argb: k.kategori === 'wajib' ? 'FF065F46' : 'FF1D4ED8' } }
  })

  // Anggaran with formulas
  const ang = sheet(wb, 'Anggaran', 'Draft Anggaran 2027', [
    { header: 'Program', key: 'prog', width: 30 },
    { header: 'Uraian', key: 'uraian', width: 40, edit: true },
    { header: 'Volume', key: 'vol', width: 10, edit: true },
    { header: 'Satuan', key: 'sat', width: 12, edit: true },
    { header: 'Harga satuan (Rp)', key: 'harga', width: 18, edit: true },
    { header: 'Jumlah (Rp)', key: 'jumlah', width: 18 },
    { header: 'Catatan', key: 'cat', width: 30, edit: true },
  ], 'Kosong = Perlu konfirmasi. Jumlah = Volume × Harga satuan (otomatis).')
  let rowNo = 4
  for (const p of state.program) {
    for (const b of p.anggaran) {
      const vol = parseVolume(b.volume)
      const r = ang.add({ prog: `${p.kode}. ${p.nama}`, uraian: b.uraian, vol: vol ?? null, sat: b.satuan, harga: b.hargaSatuan, cat: b.catatan || (b.hargaSatuan === null ? PK : '') })
      r.getCell('jumlah').value = { formula: `IF(AND(ISNUMBER(C${rowNo}),ISNUMBER(E${rowNo})),C${rowNo}*E${rowNo},"${PK}")`, result: vol !== null && b.hargaSatuan !== null ? vol * b.hargaSatuan : PK }
      r.getCell('harga').numFmt = '#,##0'
      r.getCell('jumlah').numFmt = '#,##0'
      rowNo++
    }
  }
  const totalRow = ang.ws.addRow({ prog: 'TOTAL', uraian: '(baris yang lengkap)' })
  totalRow.getCell('jumlah').value = { formula: `SUM(F4:F${rowNo - 1})` }
  totalRow.getCell('jumlah').numFmt = '#,##0'
  totalRow.font = { bold: true }
  ang.ws.addRow({})
  ang.ws.addRow({ prog: 'Referensi historis 2026 (Fakta)', uraian: ANGGARAN_2026.rincian.map((r) => `${r.pos}: Rp${r.nilai.toLocaleString('id-ID')}`).join('; ') + ` – Total Rp${ANGGARAN_2026.total.toLocaleString('id-ID')}` }).getCell('uraian').alignment = { wrapText: true }

  // Konfirmasi
  const kf = sheet(wb, 'Konfirmasi', 'Informasi yang Perlu Dikonfirmasi', [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Hal', key: 'hal', width: 70 },
    { header: 'Ditanyakan ke', key: 'ke', width: 30, edit: true },
    { header: 'Status', key: 'status', width: 20, edit: true },
    { header: 'Jawaban', key: 'jawab', width: 44, edit: true },
  ])
  state.konfirmasi.forEach((k, i) => kf.add({ no: i + 1, hal: k.pertanyaan, ke: k.ditanyakanKe, status: k.status, jawab: k.jawaban }))
  listValidation(kf.ws, 'D', 4, 3 + state.konfirmasi.length + 20, STATUS_KONFIRMASI)
  statusFormatting(kf.ws, `D4:D${3 + state.konfirmasi.length + 20}`, { 'Perlu konfirmasi': 'FFFEF3C7', 'Sudah dikonfirmasi': 'FFD1FAE5' })

  // Regulasi
  const rg = sheet(wb, 'Regulasi', 'Regulasi dan Pedoman (status per 19 November 2026)', [
    { header: 'Regulasi', key: 'nama', width: 44 },
    { header: 'Tentang', key: 'judul', width: 50 },
    { header: 'Status', key: 'status', width: 22 },
    { header: 'Sifat', key: 'sifat', width: 16 },
    { header: 'Catatan', key: 'cat', width: 50 },
    { header: 'Tautan', key: 'url', width: 50 },
  ], 'Cek ulang di JDIH Kemenkes sebelum Program Kerja 2027 disahkan.')
  REGULASI.forEach((r) => rg.add({ nama: namaRegulasi(r), judul: r.judul, status: STATUS_REGULASI_LABEL[r.status], sifat: SIFAT_LABEL[r.sifat], cat: r.catatan ?? '', url: r.url[0] ?? '' }))
  statusFormatting(rg.ws, `C4:C${3 + REGULASI.length}`, { Berlaku: 'FFD1FAE5', Dicabut: 'FFFEE2E2', 'Perlu konfirmasi': 'FFFEF3C7' })

  return wb
}
