import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { AppState } from '../types'
import { FILES } from './common'

export function simpanBlob(blob: Blob, nama: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nama
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

async function pdfBlob(def: TDocumentDefinitions): Promise<Blob> {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default
  const fonts = (await import('pdfmake/build/vfs_fonts')).default as unknown as Record<string, string> & { pdfMake?: { vfs: Record<string, string> } }
  ;(pdfMake as unknown as { vfs: Record<string, string> }).vfs = fonts.pdfMake?.vfs ?? fonts
  return new Promise((resolve) => pdfMake.createPdf(def).getBlob((b: Blob) => resolve(b)))
}

export type JenisDokumen = keyof typeof FILES

export async function buatDokumen(jenis: JenisDokumen, state: AppState): Promise<Blob> {
  switch (jenis) {
    case 'panduan': {
      const { panduanDocDef } = await import('./pdfPanduan')
      return pdfBlob(panduanDocDef(state))
    }
    case 'progress': {
      const { progressDocDef } = await import('./pdfProgress')
      return pdfBlob(progressDocDef(state))
    }
    case 'program': {
      const [{ programDocument }, { Packer }] = await Promise.all([import('./docxProgram'), import('docx')])
      return Packer.toBlob(programDocument(state))
    }
    case 'tracker': {
      const { trackerWorkbook } = await import('./xlsxTracker')
      const buf = await trackerWorkbook(state).xlsx.writeBuffer()
      return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    }
  }
}

export async function unduhDokumen(jenis: JenisDokumen, state: AppState) {
  simpanBlob(await buatDokumen(jenis, state), FILES[jenis])
}
