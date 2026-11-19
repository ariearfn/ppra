import type { Content, ContentTable, TDocumentDefinitions, TableCell } from 'pdfmake/interfaces'
import { AMBER, GREY, NAVY, NAVY_LIGHT } from './common'

export const LABEL_COLOR: Record<string, string> = {
  fakta: NAVY,
  regulasi: '#065f46',
  rekomendasi: '#1d4ed8',
  konfirmasi: AMBER,
  ilustrasi: GREY,
}
const LABEL_TEXT: Record<string, string> = {
  fakta: 'Fakta – Dok. RSCC 2026',
  regulasi: 'Regulasi terverifikasi',
  rekomendasi: 'Rekomendasi',
  konfirmasi: 'Perlu konfirmasi',
  ilustrasi: 'Ilustrasi',
}

export const label = (k: keyof typeof LABEL_TEXT | string, text?: string): Content => ({
  text: `[${text ?? LABEL_TEXT[k]}]`,
  color: LABEL_COLOR[k] ?? GREY,
  fontSize: 8,
  bold: true,
})

export const h1 = (text: string, opts: { pageBreak?: boolean; sumber?: string } = {}): Content => ({
  stack: [
    { text, style: 'h1', tocItem: true, tocStyle: { bold: true }, tocMargin: [0, 4, 0, 0] },
    ...(opts.sumber ? [label(opts.sumber)] : []),
  ],
  pageBreak: opts.pageBreak ? 'before' : undefined,
  margin: [0, opts.pageBreak ? 0 : 14, 0, 8],
})

export const h2 = (text: string, sumber?: string): Content => ({
  columns: [
    { text, style: 'h2', width: 'auto' },
    ...(sumber ? [{ ...(label(sumber) as object), width: '*', margin: [6, 6, 0, 0] } as unknown as Content] : []),
  ],
  columnGap: 4,
  margin: [0, 10, 0, 4],
})

export const h3 = (text: string): Content => ({ text, style: 'h3' })
export const p = (text: string | Content[], extra: Record<string, unknown> = {}): Content => ({ text, margin: [0, 0, 0, 6], ...extra }) as Content
export const small = (text: string): Content => ({ text, fontSize: 8.5, color: GREY, margin: [0, 0, 0, 6] })

export const ul = (items: string[]): Content => ({ ul: items, margin: [0, 0, 0, 6] })
export const ol = (items: string[]): Content => ({ ol: items, margin: [0, 0, 0, 6] })

export const note = (text: string | Content[], tone: 'info' | 'warn' = 'info'): Content => ({
  table: {
    widths: ['*'],
    body: [[{ text, fontSize: 9, margin: [6, 4, 6, 4] }]],
  },
  layout: {
    hLineWidth: () => 0,
    vLineWidth: (i: number) => (i === 0 ? 3 : 0),
    vLineColor: () => (tone === 'warn' ? '#f59e0b' : NAVY),
    fillColor: () => (tone === 'warn' ? '#fffbeb' : '#f1f5fb'),
  },
  unbreakable: true,
  margin: [0, 2, 0, 8],
})

export function table(head: string[], rows: (string | TableCell)[][], widths?: (string | number)[], opts: { fontSize?: number } = {}): ContentTable {
  return {
    table: {
      headerRows: 1,
      widths: widths ?? head.map(() => '*'),
      dontBreakRows: true,
      body: [
        head.map((h) => ({ text: h, bold: true, color: NAVY, fillColor: NAVY_LIGHT, fontSize: (opts.fontSize ?? 8.5) })),
        ...rows.map((r) => r.map((c) => (typeof c === 'string' ? { text: c, fontSize: opts.fontSize ?? 8.5 } : c))),
      ],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#cbd5e1',
      vLineColor: () => '#cbd5e1',
      paddingTop: () => 3,
      paddingBottom: () => 3,
    },
    margin: [0, 2, 0, 10],
  }
}

export const check = (text: string, checked = false): Content => ({
  columns: [
    {
      width: 14,
      canvas: [
        { type: 'rect', x: 0, y: 2, w: 8, h: 8, lineWidth: 0.8, lineColor: NAVY, color: checked ? NAVY : '#ffffff' },
      ],
    },
    { text, width: '*', color: checked ? GREY : undefined, decoration: checked ? 'lineThrough' : undefined },
  ],
  margin: [0, 1, 0, 2],
})

export const writeLines = (n: number): Content => ({
  canvas: Array.from({ length: n }, (_, i) => ({ type: 'line' as const, x1: 0, y1: 18 * (i + 1), x2: 515, y2: 18 * (i + 1), lineWidth: 0.4, lineColor: '#cbd5e1' })),
  margin: [0, 0, 0, 8],
})

// pdfmake menulis ulang node konten saat layout; salin agar data sumber tidak berubah.
function salin<T>(v: T): T {
  if (Array.isArray(v)) return v.map(salin) as T
  if (v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, salin(x)])) as T
  }
  return v
}

export function baseDoc(title: string, rs: string, content: Content[], extra: Partial<TDocumentDefinitions> = {}): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [38, 48, 38, 46],
    info: { title, author: `Komite PPRA ${rs}`, subject: title, creator: 'PPRA 2027 Management Kit' },
    defaultStyle: { font: 'Roboto', fontSize: 9, lineHeight: 1.18, color: '#1f2937' },
    styles: {
      h1: { fontSize: 15, bold: true, color: NAVY, margin: [0, 0, 0, 2] },
      h2: { fontSize: 12, bold: true, color: NAVY },
      h3: { fontSize: 10, bold: true, color: '#0f1f4a', margin: [0, 6, 0, 3] },
    },
    header: (page: number) =>
      page === 1
        ? ''
        : { columns: [{ text: title, color: GREY, fontSize: 8 }, { text: `Komite PPRA ${rs}`, alignment: 'right', color: GREY, fontSize: 8 }], margin: [40, 22, 40, 0] },
    footer: (page: number, pages: number) => ({
      columns: [
        { text: 'Draft kerja – alat bantu administratif, bukan pedoman klinis', color: GREY, fontSize: 7.5 },
        { text: `Halaman ${page} dari ${pages}`, alignment: 'right', color: GREY, fontSize: 8 },
      ],
      margin: [40, 16, 40, 0],
    }),
    content: salin(content),
    ...extra,
  }
}
