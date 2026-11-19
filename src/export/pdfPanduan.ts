import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { AppState } from '../types'
import { ANGGARAN_2026, AGENDA_PRESENTASI, DOKUMEN_2026, JADWAL_2026, KEGIATAN_POKOK_2026, KERANGKA_PROGRESS, LANGKAH_TATA_KELOLA, PELAPORAN_2026, PERAN, SASARAN_2026, TARGET_MINGGU_PERSIAPAN, TUJUAN_2026 } from '../data/fakta2026'
import { GLOSARIUM, PANDUAN } from '../data/panduan'
import { PERSIAPAN } from '../data/persiapan'
import { KOORDINASI } from '../data/koordinasi'
import { TEMPLATES } from '../data/pelaporan'
import { BULAN } from '../data/timeline'
import { TARGET_FALLBACK } from '../data/kpi'
import { KEWAJIBAN, KONFIRMASI_REGULASI, REGULASI, STATUS_REGULASI_LABEL, SIFAT_LABEL, dasarSingkat, namaRegulasi } from '../data/regulasi'
import { addDays, formatTanggal, persiapanStats, rupiah } from '../lib/utils'
import { GREY, KETERANGAN_LABEL, NAVY, PK, identitas, lines, orPK, tanggalDokumen } from './common'
import { baseDoc, check, h1, h2, h3, label, note, ol, p, small, table, ul } from './pdfHelpers'

const seksi = (id: string) => PANDUAN.find((s) => s.id === id)!

function seksiPanduan(id: string): Content[] {
  const s = seksi(id)
  const out: Content[] = [h2(s.judul, s.sumber), ...s.paragraf.map((t) => p(t))]
  if (s.tabel) out.push(table(s.tabel.kolom, s.tabel.baris, ['*', '*', '*']))
  if (s.butir) {
    if (s.butirJudul) out.push(p(s.butirJudul, { bold: true, margin: [0, 2, 0, 3] }))
    out.push(ul(s.butir))
  }
  return out
}

export function panduanDocDef(state: AppState): TDocumentDefinitions {
  const id = identitas(state)
  const ps = persiapanStats(state)
  const mulai = state.profil.tanggalMulaiPersiapan

  const cover: Content[] = [
    { text: 'KOMITE PROGRAM PENGENDALIAN RESISTENSI ANTIMIKROBA', fontSize: 9, bold: true, color: GREY, margin: [0, 120, 0, 6], characterSpacing: 1 },
    { text: 'Panduan Ketua PPRA 2027', fontSize: 30, bold: true, color: NAVY },
    { text: id.rs, fontSize: 16, color: '#0f1f4a', margin: [0, 4, 0, 24] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 3, lineColor: NAVY }], margin: [0, 0, 0, 24] },
    p([{ text: 'Untuk: ', bold: true }, `${id.ketua} – Ketua Komite PPRA `, label('konfirmasi', 'Penetapan SK perlu konfirmasi')]),
    p([{ text: 'Periode persiapan: ', bold: true }, 'November 2026; progress disampaikan kepada Direktur ', state.profil.tanggalPresentasi ? `pada ${formatTanggal(state.profil.tanggalPresentasi)}` : 'pada awal Desember 2026']),
    p([{ text: 'Sumber internal utama: ', bold: true }, `${DOKUMEN_2026.judul} (${DOKUMEN_2026.halaman} halaman, disahkan ${DOKUMEN_2026.tanggalPengesahan}).`]),
    p([{ text: 'Versi: ', bold: true }, `draft kerja, dibuat ${tanggalDokumen()} dari PPRA 2027 Management Kit.`]),
    { text: 'Keterangan label sumber', style: 'h3', margin: [0, 30, 0, 4] },
    table(['Label', 'Arti'], KETERANGAN_LABEL.map(([a, b]) => [{ text: a, bold: true }, b]), [130, '*']),
    note('Dokumen ini adalah alat bantu administratif dan manajerial. Dokumen ini tidak memuat rekomendasi terapi, dosis, maupun protokol klinis. Keputusan klinis dan kebijakan antibiotik ditetapkan oleh tenaga klinis/farmasi yang berwenang.', 'warn'),
  ]

  const toc: Content = { toc: { title: { text: 'Daftar Isi', style: 'h1' } }, pageBreak: 'before' }
  const brk = { pageBreak: true }

  const bab1: Content[] = [
    h1('1. Pendahuluan', brk),
    p(`${id.rs} sedang mengalami pergantian kepemimpinan Komite PPRA. Dalam dokumen Program Kerja 2026, ${state.profil.ketuaSebelumnya || 'ketua sebelumnya'} tercantum sebagai Ketua Komite PPRA. ${id.ketua} ditunjuk untuk mengambil alih kepemimpinan; penunjukan ini perlu diformalkan melalui mekanisme dan SK Direktur.`),
    p('Fokus satu minggu persiapan bukan menyelesaikan seluruh program 2026, melainkan melakukan serah terima, mengevaluasi pelaksanaan 2026, memetakan kondisi rumah sakit, dan menyusun rancangan Program Kerja PPRA 2027 yang realistis dan terukur.'),
    h2('Target akhir minggu persiapan', 'rekomendasi'),
    ol(TARGET_MINGGU_PERSIAPAN),
    h2('Cara menggunakan panduan ini'),
    ul([
      'Bab 2–3 menjelaskan PPRA dan peran ketua dengan bahasa sederhana.',
      'Bab 4 merangkum isi dokumen Program Kerja 2026 (fakta, bukan asumsi).',
      'Bab 5 berisi rencana persiapan 7 hari lengkap dengan checklist.',
      'Bab 6–11 berisi kerangka evaluasi, koordinasi, gap analysis, program kerja, indikator, dan timeline.',
      'Bab 12–15 berisi monev, pelaporan, regulasi, dan daftar informasi yang masih perlu dikonfirmasi.',
      'Isian tabel pada dokumen ini mengikuti data terakhir di aplikasi saat dokumen dibuat. Kolom kosong berarti belum diisi.',
    ]),
    h2('Status persiapan saat dokumen dibuat'),
    table(['Hari', 'Kegiatan', 'Butir selesai'], ps.perHari.map((h) => [`Hari ${h.hari}`, h.judul, `${h.done}/${h.total}`]), [40, '*', 70]),
    small(`Progres keseluruhan: ${ps.pct}% (${ps.done} dari ${ps.total} butir).`),
  ]

  const bab2: Content[] = [h1('2. Memahami PPRA'), ...seksiPanduan('apa'), ...seksiPanduan('penting'), ...seksiPanduan('data')]

  const bab3: Content[] = [
    h1('3. Peran dan Tanggung Jawab Ketua PPRA'),
    ...seksiPanduan('tanggungjawab'),
    h2('Pihak yang perlu dilibatkan', 'rekomendasi'),
    p(seksi('pihak').paragraf[0]),
    table(['Pihak', 'Peran yang disarankan'], PERAN.map((r) => [{ text: r.pihak, bold: true }, r.peran]), [120, '*']),
    h2('Tata kelola dan SK kepengurusan', 'regulasi'),
    ...seksi('tatakelola').paragraf.map((t) => p(t)),
    p('Langkah yang disarankan:', { bold: true }),
    ...LANGKAH_TATA_KELOLA.map((t) => check(t)),
  ]

  const bab4: Content[] = [
    h1('4. Ringkasan Program Kerja PPRA 2026', { sumber: 'fakta' }),
    p(`Bab ini merangkum isi dokumen internal "${DOKUMEN_2026.judul}", bukan asumsi. Status pelaksanaan kegiatan belum boleh diasumsikan.`),
    h2('Tujuan program 2026'),
    ol(TUJUAN_2026),
    h2('Kegiatan pokok'),
    h3(`A. ${KEGIATAN_POKOK_2026.a.judul}`),
    ul(KEGIATAN_POKOK_2026.a.butir),
    h3(`B. ${KEGIATAN_POKOK_2026.b.judul}`),
    ul(KEGIATAN_POKOK_2026.b.butir),
    h2('Sasaran program 2026'),
    ul(SASARAN_2026),
    small('Kelima sasaran ini sama dengan lima indikator mutu PPRA pada Permenkes 8/2015 Pasal 11.'),
    h2('Jadwal kegiatan dalam dokumen 2026'),
    table(['Kegiatan', 'Jadwal dalam dokumen'], JADWAL_2026.map((j) => [j.kegiatan, j.jadwal]), ['*', 180]),
    note('Jadwal di atas adalah rencana pada dokumen 2026. Status pelaksanaannya harus diperiksa berdasarkan bukti (lihat Bab 6).', 'warn'),
    h2('Evaluasi dan pelaporan dalam dokumen 2026'),
    ul(PELAPORAN_2026),
    h2('Anggaran 2026'),
    table(['Pos', 'Nilai'], [...ANGGARAN_2026.rincian.map((r) => [r.pos, { text: rupiah(r.nilai), alignment: 'right' as const }]), [{ text: 'Total', bold: true }, { text: rupiah(ANGGARAN_2026.total), bold: true, alignment: 'right' as const }]], ['*', 100]),
    note(ANGGARAN_2026.catatan, 'warn'),
  ]

  const bab5: Content[] = [
    h1('5. Rencana Persiapan 7 Hari', { sumber: 'rekomendasi', ...brk }),
    p('Rencana ini adalah usulan praktis untuk memenuhi tenggat progress awal Desember 2026. Urutannya dapat disesuaikan dengan ketersediaan orang dan data. Kotak yang terisi menandakan butir yang sudah ditandai selesai di aplikasi.'),
  ]
  PERSIAPAN.forEach((h) => {
    bab5.push(
      h2(`Hari ${h.hari} – ${h.judul}`),
      p([{ text: 'Tujuan: ', bold: true }, h.tujuan]),
      ...(mulai ? [p([{ text: 'Tanggal target: ', bold: true }, formatTanggal(addDays(mulai, h.hari - 1))])] : []),
      h3('Tugas'),
      ...h.tugas.map((t) => check(t.teks, !!state.persiapan.checked[t.id])),
      h3('Pihak yang dihubungi'),
      p(h.pihak.join(' · ')),
      h3('Dokumen/data yang dibutuhkan'),
      ...(h.hari === 1 ? h.dokumen.map((d) => check(d)) : [ul(h.dokumen)]),
    )
    if (h.pertanyaan) bab5.push(h3('Pertanyaan untuk ketua sebelumnya'), ol(h.pertanyaan))
    bab5.push(h3('Deliverable'), ...h.deliverable.map((t) => check(t.teks, !!state.persiapan.checked[t.id])))
    if (h.catatanPenting) bab5.push(note(h.catatanPenting, 'warn'))
    const cat = state.persiapan.catatan[`d${h.hari}`]
    if (cat) bab5.push(h3('Catatan'), p(cat))
  })

  const bab6: Content[] = [
    h1('6. Evaluasi Program 2026'),
    p('Cocokkan jadwal program 2026 dengan bukti pelaksanaan. Evaluasi harus berbasis bukti, bukan perkiraan.'),
    table(['Status', 'Arti'], [
      ['Terlaksana', 'Ada bukti kegiatan dan hasil.'],
      ['Sebagian terlaksana', 'Kegiatan berjalan tetapi belum lengkap.'],
      ['Belum terlaksana', 'Belum ada pelaksanaan.'],
      ['Belum diverifikasi', 'Bukti belum ditemukan atau belum dikonfirmasi (status awal).'],
    ], [110, '*']),
    h2('Tabel evaluasi (data aplikasi saat ini)'),
    table(['Kegiatan', 'Rencana', 'Status', 'Bukti dicari / bukti', 'Tindak lanjut'], state.evaluasi.map((r) => [
      { text: r.kegiatan, bold: true },
      r.rencana,
      { text: r.status, color: r.status === 'Belum diverifikasi' ? '#92400e' : undefined },
      r.bukti || `Dicari: ${r.buktiDicari}`,
      r.tindakLanjut || '—',
    ]), [90, 70, 65, '*', 90]),
    h2('Contoh pengisian', 'ilustrasi'),
    p('Contoh berikut hanya menunjukkan cara menulis; bukan data RSCC.', { italics: true, color: GREY }),
    table(['Kegiatan', 'Status', 'Bukti', 'Kendala', 'Tindak lanjut'], [[
      { text: 'Sosialisasi PPRA', italics: true },
      { text: 'Sebagian terlaksana', italics: true },
      { text: 'Daftar hadir dan materi untuk 2 unit; dokumentasi foto.', italics: true },
      { text: 'Unit lain belum dijadwalkan.', italics: true },
      { text: 'Jadwalkan unit sisanya pada triwulan I 2027.', italics: true },
    ]], [80, 70, '*', 90, 100]),
  ]

  const bab7: Content[] = [
    h1('7. Koordinasi Lintas Unit', { sumber: 'rekomendasi' }),
    ...seksi('koordinasi').paragraf.map((t) => p(t)),
    ul(seksi('koordinasi').butir ?? []),
    note('Jangan meminta atau membagikan data pasien secara bebas. Penggunaan data harus sesuai kewenangan, kebutuhan program, dan ketentuan kerahasiaan pasien.', 'warn'),
  ]
  bab7.push(
    table(['Unit', 'Mengapa penting', 'Informasi yang diminta', 'Output yang diharapkan', 'PIC unit'], KOORDINASI.map((u) => [
      { text: u.unit, bold: true },
      u.mengapa + (u.catatan ? `\n${u.catatan}` : ''),
      { ul: u.informasi, fontSize: 8 },
      { ul: u.output, fontSize: 8 },
      { text: orPK(state.kontakUnit[u.id]?.pic), color: state.kontakUnit[u.id]?.pic ? undefined : '#92400e' },
    ]), [62, '*', '*', 100, 55], { fontSize: 8 }),
    small('Kegiatan bersama per unit dan kolom hasil koordinasi tersedia di menu Panduan Koordinasi pada aplikasi.'),
  )

  const bab8: Content[] = [
    h1('8. Assessment dan Gap Analysis'),
    p('Bandingkan kondisi aktual dengan kebutuhan program PPRA dan pedoman yang berlaku. Pertanyaan kunci berikut membantu assessment; kolom kondisi diisi berdasarkan bukti.'),
    table(['Area', 'Pertanyaan kunci', 'Kondisi saat ini', 'Prioritas'], state.gap.map((g, i) => [
      { text: `${i + 1}. ${g.area}`, bold: true },
      { ul: g.pertanyaanKunci, fontSize: 8 },
      g.kondisi || { text: 'Isi setelah assessment', color: GREY, italics: true },
      g.prioritas || '—',
    ]), [95, '*', 120, 45]),
    h2('Rekomendasi perbaikan dan PIC'),
    table(['Area', 'Permasalahan', 'Rekomendasi', 'PIC'], state.gap.map((g) => [g.area, g.permasalahan || '—', g.rekomendasi || '—', g.pic || '—']), [100, '*', '*', 70]),
  ]

  const bab9: Content[] = [
    h1('9. Rancangan Program Kerja 2027', { sumber: 'rekomendasi', ...brk }),
    p('Enam kelompok program berikut adalah rancangan awal. Program final harus disesuaikan dengan hasil assessment, jenis layanan RSCC, kemampuan SDM, fasilitas, dan regulasi yang berlaku. Dokumen formal tersedia sebagai Program_Kerja_PPRA_2027.docx.'),
  ]
  state.program.forEach((pr) => {
    bab9.push(
      h2(`${pr.kode}. ${pr.nama}`),
      table(['Komponen', 'Isi'], [
        ['Latar belakang', orPK(pr.latarBelakang)],
        ['Tujuan', orPK(pr.tujuan)],
        ['Kegiatan', { ul: lines(pr.kegiatan), fontSize: 8.5 }],
        ['Sasaran', orPK(pr.sasaran)],
        ['Unit penanggung jawab', orPK(pr.unitPJ)],
        ['Indikator', orPK(pr.indikator)],
        ['Timeline', orPK(pr.timeline)],
        ['Dokumentasi', orPK(pr.dokumentasi)],
      ], [110, '*']),
    )
  })

  const wajib = state.kpi.filter((k) => k.kategori === 'wajib')
  const usulan = state.kpi.filter((k) => k.kategori === 'usulan')
  const kpiRows = (list: typeof wajib) => list.map((k) => [{ text: k.nama, bold: true }, k.definisi, k.baseline || PK, k.target || TARGET_FALLBACK, k.pic || PK, k.frekuensi || '—'])
  const bab10: Content[] = [
    h1('10. Indikator dan Monitoring'),
    note('Tidak ada regulasi yang menetapkan angka target indikator PPRA. Target disusun setelah baseline diketahui dan dikonfirmasi dengan Direktur serta unit terkait. Angka usulan tidak boleh disajikan sebagai standar regulasi.', 'warn'),
    h2('Indikator wajib (regulasi)', 'regulasi'),
    small('Yang wajib adalah pelaksanaan dan pengukurannya, bukan angka targetnya.'),
    table(['Indikator', 'Definisi', 'Baseline', 'Target', 'PIC', 'Frekuensi'], kpiRows(wajib), [80, '*', 50, 60, 55, 55], { fontSize: 7.5 }),
    small('Dasar regulasi per indikator: ' + wajib.map((k) => `${k.nama} – ${k.rujukan}`).join('; ') + '.'),
    h2('Indikator usulan (tidak wajib)', 'rekomendasi'),
    table(['Indikator', 'Definisi', 'Baseline', 'Target', 'PIC', 'Frekuensi'], kpiRows(usulan), [80, '*', 50, 60, 55, 55], { fontSize: 7.5 }),
    h2('Cara memantau indikator'),
    ul([
      'Tetapkan definisi operasional dan sumber data bersama unit pemilik data.',
      'Kumpulkan baseline terlebih dahulu; jangan menetapkan target sebelum baseline tersedia.',
      'Catat capaian sesuai frekuensi yang disepakati dan bahas di rapat komite.',
      'Laporkan capaian, kendala, dan tindak lanjut pada laporan triwulan kepada Direktur.',
    ]),
  ]

  const bab11: Content[] = [
    h1('11. Timeline Januari–Desember 2027', { sumber: 'rekomendasi' }),
    p('Jadwal usulan berikut dapat diubah setelah dikonfirmasi. Sel berwarna navy = kegiatan, M = milestone, E = evaluasi triwulan, L = laporan.'),
    {
      table: {
        headerRows: 1,
        widths: [128, 62, ...BULAN.map(() => 15)],
        body: [
          [{ text: 'Kegiatan', bold: true, fillColor: '#e1e9f5', color: NAVY, fontSize: 7.5 }, { text: 'PIC', bold: true, fillColor: '#e1e9f5', color: NAVY, fontSize: 7.5 }, ...BULAN.map((b) => ({ text: b, bold: true, fillColor: '#e1e9f5', color: NAVY, fontSize: 7, alignment: 'center' as const }))],
          ...state.program.flatMap((pr) => [
            [{ text: `${pr.kode}. ${pr.nama}`, colSpan: 14, bold: true, fontSize: 7.5, fillColor: '#f8fafc' }, ...Array(13).fill({})],
            ...state.timeline.filter((t) => t.programId === pr.id).map((t) => [
              { text: t.kegiatan, fontSize: 7.5 },
              { text: t.pic || PK, fontSize: 7, color: t.pic ? undefined : '#92400e' },
              ...BULAN.map((_, i) => {
                const on = t.bulan.includes(i + 1)
                const sym = t.jenis === 'milestone' ? 'M' : t.jenis === 'evaluasi' ? 'E' : t.jenis === 'laporan' ? 'L' : ''
                return { text: on ? sym : '', alignment: 'center' as const, fontSize: 7, bold: true, color: '#fff', fillColor: on ? (t.jenis === 'evaluasi' ? '#d97706' : t.jenis === 'laporan' ? '#059669' : NAVY) : undefined }
              }),
            ]),
          ]),
        ],
      },
      layout: { hLineWidth: () => 0.4, vLineWidth: () => 0.4, hLineColor: () => '#cbd5e1', vLineColor: () => '#cbd5e1' },
    },
  ]

  const bab12: Content[] = [
    h1('12. Monitoring, Evaluasi, dan Jika Program Tidak Berjalan'),
    ...seksiPanduan('monev'),
    ul(PELAPORAN_2026),
    ...seksiPanduan('tidakjalan'),
  ]

  const bab13: Content[] = [
    h1('13. Pelaporan dan Presentasi kepada Direktur'),
    h2('Kerangka laporan progress kepada Direktur', 'rekomendasi'),
    table(['Bagian', 'Isi'], KERANGKA_PROGRESS.map((k) => [{ text: `${k.kode}. ${k.judul}`, bold: true }, k.isi]), [150, '*']),
    h2('Agenda paparan 10–20 menit'),
    ol(AGENDA_PRESENTASI),
    h2('Template pelaporan di aplikasi'),
    table(['Template', 'Kegunaan'], TEMPLATES.map((t) => [{ text: t.judul, bold: true }, t.deskripsi]), [130, '*']),
    h2('Contoh notulen rapat', 'ilustrasi'),
    p('Contoh berikut hanya menunjukkan struktur penulisan; nama, tanggal, dan isi bukan data RSCC.', { italics: true, color: GREY }),
    table(['Komponen', 'Contoh isi'], [
      ['Agenda', 'Koordinasi permintaan data penggunaan antibiotik.'],
      ['Pembahasan', 'Farmasi menyampaikan format data yang dapat ditarik dari sistem dan periode yang tersedia.'],
      ['Keputusan', 'Disepakati format rekap dan PIC dari Farmasi.'],
      ['Tindak lanjut', 'PIC Farmasi menyiapkan contoh rekap satu bulan; tenggat dua minggu.'],
    ].map(([a, b]) => [{ text: a, bold: true }, { text: b, italics: true, color: GREY }]), [100, '*']),
  ]

  const bab14: Content[] = [
    h1('14. Regulasi dan Pedoman'),
    p('Status regulasi per verifikasi 19 November 2026. Cek ulang di JDIH Kemenkes sebelum Program Kerja 2027 disahkan. Jangan mengutip regulasi yang sudah dicabut.'),
    table(['Regulasi', 'Tentang', 'Status', 'Sifat'], REGULASI.map((r) => [
      { text: namaRegulasi(r), bold: true, decoration: r.status === 'dicabut' ? 'lineThrough' : undefined },
      r.judul,
      { text: STATUS_REGULASI_LABEL[r.status], color: r.status === 'berlaku' ? '#065f46' : r.status === 'dicabut' ? '#b91c1c' : r.status === 'perlu_konfirmasi' ? '#92400e' : undefined },
      SIFAT_LABEL[r.sifat],
    ]), [130, '*', 75, 55], { fontSize: 7.5 }),
    h2('Kewajiban PPRA menurut regulasi', 'regulasi'),
    table(['Kewajiban', 'Dasar', 'Frekuensi'], KEWAJIBAN.map((k) => [k.kewajiban + (k.tenggat ? `\nTenggat: ${k.tenggat.replace('perlu_konfirmasi', 'Perlu konfirmasi')}` : '') + (k.syarat ? `\nSyarat: ${k.syarat}` : ''), k.dasar.map(dasarSingkat).join('; '), k.frekuensi]), ['*', 140, 70], { fontSize: 7.5 }),
    h2('Hal regulasi yang perlu dikonfirmasi', 'konfirmasi'),
    table(['Hal', 'Ditanyakan ke'], KONFIRMASI_REGULASI.map((k) => [k.item, k.pihak]), ['*', 150]),
  ]

  const bab15: Content[] = [
    h1('15. Informasi yang Masih Perlu Dikonfirmasi', { sumber: 'konfirmasi' }),
    p('Jika informasi belum tersedia, tandai "Perlu konfirmasi". Jangan mengarang data rumah sakit. Daftar berikut mengikuti status terakhir di aplikasi.'),
    table(['No', 'Hal yang perlu dikonfirmasi', 'Ditanyakan ke', 'Status', 'Jawaban'], state.konfirmasi.map((k, i) => [String(i + 1), k.pertanyaan, k.ditanyakanKe, k.status, k.jawaban || '—']), [18, '*', 80, 60, 90], { fontSize: 8 }),
  ]

  const lampiran: Content[] = [
    h1('Lampiran. Glosarium'),
    table(['Istilah', 'Arti'], GLOSARIUM.map((g) => [{ text: g.istilah, bold: true }, g.arti]), [130, '*']),
  ]

  return baseDoc('Panduan Ketua PPRA 2027', id.rs, [
    ...cover, toc, ...bab1, ...bab2, ...bab3, ...bab4, ...bab5, ...bab6, ...bab7, ...bab8, ...bab9, ...bab10, ...bab11, ...bab12, ...bab13, ...bab14, ...bab15, ...lampiran,
  ])
}
