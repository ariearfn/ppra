// Membuat keempat dokumen dari isi awal aplikasi (atau dari file cadangan JSON bila diberikan).
// Pemakaian: npm run docs [-- path/ke/cadangan.json] [--out folder]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { Packer } from 'docx'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { createDefaultState, normalizeState } from '../src/state/defaults'
import { panduanDocDef } from '../src/export/pdfPanduan'
import { progressDocDef } from '../src/export/pdfProgress'
import { programDocument } from '../src/export/docxProgram'
import { trackerWorkbook } from '../src/export/xlsxTracker'
import { FILES } from '../src/export/common'

const require = createRequire(import.meta.url)
const PdfPrinter = require('pdfmake')
const vfs: Record<string, string> = require('pdfmake/build/vfs_fonts')

const args = process.argv.slice(2)
const outIdx = args.indexOf('--out')
const outDir = resolve(outIdx >= 0 ? args[outIdx + 1] : 'output')
const input = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out')
const state = input ? normalizeState(JSON.parse(readFileSync(input, 'utf8'))) : createDefaultState()

const font = (n: string) => Buffer.from(vfs[n], 'base64')
const printer = new PdfPrinter({
  Roboto: { normal: font('Roboto-Regular.ttf'), bold: font('Roboto-Medium.ttf'), italics: font('Roboto-Italic.ttf'), bolditalics: font('Roboto-MediumItalic.ttf') },
})

function pdf(def: TDocumentDefinitions): Promise<Buffer> {
  return new Promise((ok, fail) => {
    const doc = printer.createPdfKitDocument(def)
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => ok(Buffer.concat(chunks)))
    doc.on('error', fail)
    doc.end()
  })
}

mkdirSync(outDir, { recursive: true })
const write = (name: string, buf: Buffer | ArrayBuffer) => {
  writeFileSync(join(outDir, name), Buffer.from(buf as ArrayBuffer))
  console.log('✓', join(outDir, name))
}

write(FILES.panduan, await pdf(panduanDocDef(state)))
write(FILES.progress, await pdf(progressDocDef(state)))
write(FILES.program, await Packer.toBuffer(programDocument(state)))
write(FILES.tracker, await trackerWorkbook(state).xlsx.writeBuffer())
