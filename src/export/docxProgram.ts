import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  PageBreak,
  PageNumber,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type IParagraphOptions,
} from 'docx'
import type { AppState } from '../types'
import { DOKUMEN_2026, PELAPORAN_2026, SASARAN_2026, TUJUAN_2026 } from '../data/fakta2026'
import { BULAN } from '../data/timeline'
import { TARGET_FALLBACK } from '../data/kpi'
import { REGULASI, namaRegulasi } from '../data/regulasi'
import { parseVolume, rupiah, totalAnggaran, totalProgram } from '../lib/utils'
import { PK, identitas, lines, tanggalDokumen } from './common'

const FONT = 'Arial'
const NAVY = '1E3A8A'

const run = (text: string, o: { bold?: boolean; italics?: boolean; size?: number; color?: string } = {}) => new TextRun({ text, font: FONT, size: o.size ?? 22, ...o })
const pk = (text = PK) => new TextRun({ text: `[${text}]`, font: FONT, size: 22, highlight: 'yellow' })

function para(content: string | TextRun[], o: Partial<IParagraphOptions> = {}) {
  return new Paragraph({
    children: typeof content === 'string' ? [run(content)] : content,
    spacing: { after: 120, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    ...o,
  })
}
const val = (v: string) => (v && v.trim() ? [run(v.trim())] : [pk()])
const bab = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(text, { bold: true, size: 24, color: NAVY })], spacing: { before: 320, after: 160 } })
const sub = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(text, { bold: true, size: 22 })], spacing: { before: 200, after: 100 } })
const bullet = (text: string | TextRun[], level = 0) => new Paragraph({ children: typeof text === 'string' ? [run(text)] : text, bullet: { level }, spacing: { after: 60 } })
const num = (items: string[]) => items.map((t, i) => new Paragraph({ children: [run(`${i + 1}. ${t}`)], indent: { left: 360, hanging: 360 }, spacing: { after: 60 } }))

const border = { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' }
const borders = { top: border, bottom: border, left: border, right: border }

function cell(content: string | TextRun[] | Paragraph[], o: { head?: boolean; width?: number; fill?: string; span?: number } = {}) {
  const children =
    Array.isArray(content) && content[0] instanceof Paragraph
      ? (content as Paragraph[])
      : [new Paragraph({ children: typeof content === 'string' ? [run(content, { bold: o.head, size: 18, color: o.head ? NAVY : undefined })] : (content as TextRun[]), spacing: { after: 40 } })]
  return new TableCell({
    children,
    borders,
    columnSpan: o.span,
    width: o.width ? { size: o.width, type: WidthType.PERCENTAGE } : undefined,
    shading: o.head || o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill ?? 'E1E9F5' } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  })
}
const small = (t: string) => [run(t, { size: 18 })]
const smallVal = (v: string) => (v && v.trim() ? small(v.trim()) : [new TextRun({ text: `[${PK}]`, font: FONT, size: 18, highlight: 'yellow' })])

function tabel(head: string[], rows: (string | TextRun[] | Paragraph[])[][], widths: number[]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, children: head.map((h, i) => cell(h, { head: true, width: widths[i] })) }),
      ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(typeof c === 'string' ? small(c) : c, { width: widths[i] })) })),
    ],
  })
}

export function programDocument(state: AppState): Document {
  const id = identitas(state)
  const ang = totalAnggaran(state)
  const rank = (j: string) => (j.startsWith('Peraturan Pemerintah') ? 0 : j.startsWith('Permenkes') ? 1 : j.startsWith('Keputusan Menteri') ? 2 : 3)
  const regWajib = REGULASI.filter((r) => r.status === 'berlaku' && (r.sifat === 'wajib' || r.sifat === 'wajib_bersyarat')).sort((a, b) => rank(a.jenis) - rank(b.jenis) || a.tahun - b.tahun)

  const cover = [
    new Paragraph({ children: [], spacing: { before: 2400 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [run('PROGRAM KERJA', { bold: true, size: 36, color: NAVY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [run('KOMITE PROGRAM PENGENDALIAN RESISTENSI ANTIMIKROBA (PPRA)', { bold: true, size: 28, color: NAVY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [run('TAHUN 2027', { bold: true, size: 28, color: NAVY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [run(id.rs.toUpperCase(), { bold: true, size: 28 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [run(`DRAFT – disusun ${tanggalDokumen()}`, { italics: true, size: 20, color: '64748B' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Untuk ditinjau Komite PPRA dan disahkan Direktur', { italics: true, size: 20, color: '64748B' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [run('Teks bertanda ', { size: 18, color: '64748B' }), new TextRun({ text: `[${PK}]`, font: FONT, size: 18, highlight: 'yellow' }), run(' wajib dilengkapi sebelum disahkan.', { size: 18, color: '64748B' })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ]

  const pengesahan = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [run('LEMBAR PENGESAHAN', { bold: true, size: 26, color: NAVY })] }),
    tabel(['', 'Nama', 'Jabatan', 'Tanda tangan', 'Tanggal'], [
      ['Disusun oleh', [run(id.ketua, { size: 18 })], 'Ketua Komite PPRA', '', ''],
      ['Diperiksa oleh', smallVal(''), smallVal(''), '', ''],
      ['Disetujui oleh', smallVal(state.profil.namaDirektur), `Direktur ${id.rs}`, '', ''],
    ], [16, 24, 24, 20, 16]),
    para([run('Nomor SK Komite PPRA: ', { bold: true }), ...val(state.profil.nomorSK)], { spacing: { before: 240 } }),
    new Paragraph({ children: [new PageBreak()] }),
  ]

  const body = [
    bab('I. PENDAHULUAN'),
    para('Resistansi antimikroba merupakan masalah kesehatan yang memerlukan upaya terkoordinasi di rumah sakit. Pengendaliannya dilakukan melalui penggunaan antibiotik secara bijak dan pencegahan penyebaran mikroba resisten melalui penerapan prinsip Pencegahan dan Pengendalian Infeksi (PPI).'),
    para(`Program Kerja Komite PPRA Tahun 2027 ini disusun sebagai kelanjutan dari ${DOKUMEN_2026.judul} yang disahkan pada ${DOKUMEN_2026.tanggalPengesahan}, dengan memperhatikan hasil evaluasi pelaksanaan tahun 2026, hasil assessment kondisi rumah sakit, serta regulasi yang berlaku.`),
    para([run('Tahun 2027 juga menandai pergantian kepemimpinan Komite PPRA dari '), run(state.profil.ketuaSebelumnya || 'ketua sebelumnya'), run(` kepada ${id.ketua}. Penetapan ketua dan struktur komite dilakukan melalui SK Direktur `), pk('nomor dan tanggal SK perlu konfirmasi'), run('.')]),

    bab('II. LATAR BELAKANG'),
    para('Rumah sakit wajib melaksanakan Program Pengendalian Resistensi Antimikroba. Dasar hukum yang menjadi acuan penyusunan program ini (status per verifikasi 19 November 2026; dicek ulang melalui JDIH Kemenkes sebelum pengesahan) adalah:'),
    ...regWajib.map((r) => bullet(`${namaRegulasi(r)} tentang ${r.judul}${r.sifat === 'wajib_bersyarat' ? ' (kewajiban teknis penuh bagi RS lokus surveilans; status lokus RSCC perlu konfirmasi)' : ''}.`)),
    para([run('Hasil evaluasi pelaksanaan program 2026: ', { bold: true }), ...(state.evaluasi.every((r) => r.status === 'Belum diverifikasi') ? [pk('evaluasi berbasis bukti belum selesai')] : [run(state.evaluasi.map((r) => `${r.kegiatan} (${r.status.toLowerCase()})`).join('; ') + '.')])], { spacing: { before: 120, after: 120 } }),
    para([run('Kondisi rumah sakit (jenis layanan, jumlah tempat tidur, kapasitas laboratorium, ketersediaan data): ', { bold: true }), ...(state.gap.some((g) => g.kondisi.trim()) ? [run(state.gap.filter((g) => g.kondisi.trim()).map((g) => `${g.area}: ${g.kondisi.trim()}`).join('; ') + '.')] : [pk('diisi berdasarkan hasil assessment')])]),

    bab('III. TUJUAN'),
    sub('A. Tujuan Umum'),
    ...num(TUJUAN_2026),
    sub('B. Tujuan Khusus'),
    ...num(state.program.map((p) => `${p.nama}: ${p.tujuan || PK}`)),

    bab('IV. KEGIATAN POKOK DAN RINCIAN KEGIATAN'),
    ...state.program.flatMap((p) => [
      sub(`${p.kode}. ${p.nama}`),
      para([run('Latar belakang: ', { bold: true }), ...val(p.latarBelakang)]),
      para([run('Rincian kegiatan:', { bold: true })], { spacing: { after: 60 } }),
      ...lines(p.kegiatan).map((k) => bullet(k)),
      tabel(['Komponen', 'Uraian'], [
        ['Sasaran', smallVal(p.sasaran)],
        ['Unit penanggung jawab', smallVal(p.unitPJ)],
        ['Indikator keberhasilan', smallVal(p.indikator)],
        ['Waktu pelaksanaan', smallVal(p.timeline)],
        ['Sumber daya', smallVal(p.sumberDaya)],
        ['Dokumentasi/bukti', smallVal(p.dokumentasi)],
      ], [28, 72]),
      new Paragraph({ children: [], spacing: { after: 120 } }),
    ]),

    bab('V. CARA MELAKSANAKAN KEGIATAN'),
    ...[
      'Rapat Komite PPRA untuk menetapkan prioritas, pembagian tugas, dan memantau pelaksanaan.',
      'Koordinasi lintas unit (Farmasi, Laboratorium, PPI, KSM/klinisi, Keperawatan, Rekam Medis, IT, Unit Mutu) melalui permintaan tertulis dan rapat koordinasi.',
      'Review dokumen kebijakan/panduan bersama tenaga klinis dan farmasi yang berwenang.',
      'Audit kuantitas dan kualitas penggunaan antibiotik sesuai metode yang ditetapkan regulasi dan disepakati komite.',
      'Pengumpulan dan validasi data laboratorium untuk surveilans resistansi.',
      'Sosialisasi, edukasi, dan forum kajian kasus infeksi terintegrasi (FORKKIT).',
      'Pencatatan triwulan, evaluasi, dan pelaporan kepada Direktur.',
    ].map((t) => bullet(t)),

    bab('VI. SASARAN'),
    para('Sasaran program mengacu pada lima indikator mutu PPRA yang juga tercantum dalam dokumen Program Kerja 2026:'),
    ...num(SASARAN_2026),
    para('Matriks indikator 2027 (tidak ada regulasi yang menetapkan angka target; target ditetapkan RS setelah baseline diketahui):', { spacing: { before: 120, after: 80 } }),
    tabel(['Indikator', 'Kategori', 'Baseline', 'Target 2027', 'Sumber data', 'PIC', 'Frekuensi'], state.kpi.map((k) => [
      k.nama, k.kategori === 'wajib' ? 'Wajib (regulasi)' : 'Usulan', smallVal(k.baseline), k.target ? small(k.target) : [new TextRun({ text: `[${TARGET_FALLBACK}]`, font: FONT, size: 18, highlight: 'yellow' })], k.sumberData, smallVal(k.pic), k.frekuensi,
    ]), [24, 11, 11, 15, 14, 13, 12]),
  ]

  const jadwal = [
    bab('VII. JADWAL PELAKSANAAN KEGIATAN'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: [cell('Kegiatan', { head: true, width: 34 }), cell('PIC', { head: true, width: 18 }), ...BULAN.map((b) => cell(b, { head: true, width: 4 }))] }),
        ...state.program.flatMap((p) => [
          new TableRow({ children: [cell([run(`${p.kode}. ${p.nama}`, { bold: true, size: 18 })], { span: 14, fill: 'F1F5F9' })] }),
          ...state.timeline.filter((t) => t.programId === p.id).map((t) => new TableRow({
            cantSplit: true,
            children: [
              cell(small(t.kegiatan)),
              cell(smallVal(t.pic)),
              ...BULAN.map((_, i) => (t.bulan.includes(i + 1) ? cell([run(t.jenis === 'milestone' ? 'M' : t.jenis === 'evaluasi' ? 'E' : t.jenis === 'laporan' ? 'L' : 'X', { size: 16, bold: true, color: 'FFFFFF' })], { fill: t.jenis === 'evaluasi' ? 'D97706' : t.jenis === 'laporan' ? '059669' : NAVY }) : cell(''))),
            ],
          })),
        ]),
      ],
    }),
    para('Keterangan: X = kegiatan, M = milestone, E = evaluasi triwulan, L = laporan. Jadwal bersifat usulan dan dapat disesuaikan.', { spacing: { before: 120 } }),
  ]

  const penutup = [
    bab('VIII. EVALUASI PELAKSANAAN KEGIATAN DAN PELAPORAN'),
    ...[
      'Evaluasi pelaksanaan kegiatan dilakukan setiap triwulan (Maret, Juni, September, Desember 2027) oleh Komite PPRA.',
      'Hasil evaluasi disampaikan secara lisan dan tertulis saat koordinasi dengan kepala unit/instalasi setiap tiga bulan.',
      'Laporan tahunan disusun Komite PPRA dan disampaikan kepada Direktur pada akhir tahun.',
      'Laporan tahunan rumah sakit disampaikan Direktur kepada Menteri Kesehatan c.q. KPRA dengan tembusan Dinas Kesehatan Provinsi dan Kabupaten/Kota melalui aplikasi nasional (Permenkes 8/2015 Pasal 12; STARKES PROGNAS 6 EP5).',
    ].map((t) => bullet(t)),
    para([run('Tenggat dan kanal pelaporan nasional: '), pk('31 Agustus menurut SE Dirjen Yankes HK.02.02/D/44930/2024 – naskah resmi belum ditemukan')]),
    para([run('Kewajiban pelaporan surveilans AMR paling lambat 30 April (Kepdirjen Keslan HK.02.02/D/1476/2026) berlaku bila RSCC ditetapkan sebagai lokus surveilans: '), pk('status lokus perlu konfirmasi')]),

    bab('IX. PENCATATAN, PELAPORAN, DAN EVALUASI KEGIATAN'),
    para('Mekanisme pada dokumen Program Kerja 2026 dipertahankan sebagai dasar:'),
    ...PELAPORAN_2026.map((t) => bullet(t)),
    para('Setiap kegiatan didokumentasikan dengan undangan, daftar hadir, notulen, laporan, dan bukti lain yang relevan. Evaluasi akhir tahun 2027 menjadi dasar penyusunan rencana tindak lanjut dan program kerja 2028.'),

    bab('X. ANGGARAN'),
    para('Anggaran disusun berdasarkan kegiatan nyata. Anggaran 2026 (Rp6.600.000) hanya digunakan sebagai referensi historis dan tidak disalin tanpa evaluasi.'),
    tabel(['Program', 'Uraian', 'Volume', 'Harga satuan', 'Jumlah'], [
      ...state.program.flatMap((p) => p.anggaran.map((b) => {
        const v = parseVolume(b.volume)
        const ok = v !== null && b.hargaSatuan !== null
        return [p.kode, b.uraian, b.volume ? `${b.volume} ${b.satuan}` : smallVal(''), b.hargaSatuan !== null ? rupiah(b.hargaSatuan) : smallVal(''), ok ? rupiah(v! * b.hargaSatuan!) : smallVal('')] as (string | TextRun[])[]
      })),
      ...state.program.map((p) => [p.kode, `Subtotal ${p.nama}`, '', '', rupiah(totalProgram(p).total)]),
      ['', [run('TOTAL', { bold: true, size: 18 })], '', '', [run(rupiah(ang.total), { bold: true, size: 18 })]],
    ], [9, 43, 14, 16, 18]),
    ...(ang.lengkap ? [] : [para([pk('Sebagian pos anggaran belum memiliki volume/harga satuan; total belum final')], { spacing: { before: 120 } })]),

    bab('XI. PENUTUP'),
    para(`Program Kerja Komite PPRA Tahun 2027 ini menjadi acuan pelaksanaan kegiatan PPRA di ${id.rs}. Program akan ditinjau secara berkala dan disesuaikan dengan hasil evaluasi, perkembangan regulasi, serta kebijakan Direktur.`),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 480 }, children: [run(`${id.rs}, `), pk('tanggal')] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('Ketua Komite PPRA')] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 900 }, children: [run(id.ketua, { bold: true })] }),

    new Paragraph({ children: [new PageBreak()] }),
    bab('LAMPIRAN. HAL YANG PERLU DIKONFIRMASI SEBELUM PENGESAHAN'),
    tabel(['No', 'Hal', 'Ditanyakan ke', 'Status'], state.konfirmasi.map((k, i) => [String(i + 1), k.pertanyaan, k.ditanyakanKe, k.status]), [6, 58, 22, 14]),
  ]

  const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(`Program Kerja Komite PPRA ${id.rs} Tahun 2027 – DRAFT`, { size: 16, color: '64748B' })] })] })
  const footer = new Footer({
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Halaman ', PageNumber.CURRENT, ' dari ', PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: '64748B' })] })],
  })
  const page = { margin: { top: 1418, bottom: 1418, left: 1701, right: 1418 } }

  return new Document({
    creator: `Komite PPRA ${id.rs}`,
    title: 'Program Kerja Komite PPRA Tahun 2027',
    description: 'Draft program kerja yang dihasilkan PPRA 2027 Management Kit',
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [
      { properties: { page }, children: [...cover, ...pengesahan, ...body], headers: { default: header }, footers: { default: footer } },
      { properties: { page: { ...page, size: { orientation: PageOrientation.LANDSCAPE } } }, children: jadwal, headers: { default: header }, footers: { default: footer } },
      { properties: { page }, children: penutup, headers: { default: header }, footers: { default: footer } },
    ],
  })
}
