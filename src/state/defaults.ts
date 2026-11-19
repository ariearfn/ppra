import type { AppState } from '../types'
import { DEFAULT_EVALUASI } from '../data/evaluasi'
import { DEFAULT_GAP } from '../data/gap'
import { DEFAULT_PROGRAM } from '../data/program'
import { DEFAULT_TIMELINE } from '../data/timeline'
import { DEFAULT_KPI } from '../data/kpi'
import { DEFAULT_KONFIRMASI } from '../data/konfirmasi'

export const STATE_VERSION = 1

export function createDefaultState(): AppState {
  return structuredClone({
    versi: STATE_VERSION,
    profil: {
      namaRS: 'RS Condong Catur',
      namaKetua: 'dr. Rara',
      ketuaSebelumnya: 'dr. Prisilia Almiranti',
      namaDirektur: '',
      nomorSK: '',
      tanggalMulaiPersiapan: '',
      tanggalPresentasi: '',
    },
    persiapan: { checked: {}, catatan: {} },
    evaluasi: DEFAULT_EVALUASI,
    gap: DEFAULT_GAP,
    program: DEFAULT_PROGRAM,
    timeline: DEFAULT_TIMELINE,
    kpi: DEFAULT_KPI,
    konfirmasi: DEFAULT_KONFIRMASI,
    pengingat: [],
    kontakUnit: {},
    laporan: [],
  })
}

export function normalizeState(raw: unknown): AppState {
  const def = createDefaultState()
  if (!raw || typeof raw !== 'object') return def
  const r = raw as Partial<AppState>
  return {
    ...def,
    ...r,
    profil: { ...def.profil, ...(r.profil ?? {}) },
    persiapan: { checked: { ...(r.persiapan?.checked ?? {}) }, catatan: { ...(r.persiapan?.catatan ?? {}) } },
    kontakUnit: { ...(r.kontakUnit ?? {}) },
    versi: STATE_VERSION,
  }
}
