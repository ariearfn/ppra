import { useState, type ReactNode } from 'react'
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Download,
  FileText,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  Menu,
  Scale,
  Search,
  Settings,
  Target,
  Users,
  X,
} from 'lucide-react'
import { useStore } from '../state/store'

export const NAV = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'panduan', label: 'Panduan Ketua PPRA', icon: BookOpen },
  { path: 'persiapan', label: 'Persiapan 7 Hari', icon: CheckSquare },
  { path: 'evaluasi', label: 'Evaluasi Program 2026', icon: ClipboardList },
  { path: 'gap', label: 'Gap Analysis', icon: Search },
  { path: 'program', label: 'Program Kerja 2027', icon: Target },
  { path: 'timeline', label: 'Timeline 2027', icon: CalendarDays },
  { path: 'kpi', label: 'Monitoring KPI', icon: Gauge },
  { path: 'koordinasi', label: 'Panduan Koordinasi', icon: Users },
  { path: 'pelaporan', label: 'Template Pelaporan', icon: FileText },
  { path: 'konfirmasi', label: 'Info Perlu Konfirmasi', icon: HelpCircle },
  { path: 'regulasi', label: 'Regulasi & Pedoman', icon: Scale },
  { path: 'unduh', label: 'Unduh Dokumen', icon: Download },
  { path: 'pengaturan', label: 'Profil & Data', icon: Settings },
] as const

function NavLinks({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Menu utama" className="flex flex-col gap-0.5">
      {NAV.map(({ path, label, icon: Icon }) => {
        const active = current === path
        return (
          <a
            key={path}
            href={`#/${path}`}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              active ? 'bg-navy-700 font-medium text-white' : 'text-slate-700 hover:bg-navy-50 hover:text-navy-800'
            }`}
          >
            <Icon size={16} strokeWidth={2} aria-hidden />
            {label}
          </a>
        )
      })}
    </nav>
  )
}

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { savedAt, state } = useStore()

  return (
    <div className="min-h-screen bg-white">
      <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button type="button" aria-label="Buka menu" onClick={() => setOpen(true)} className="rounded-md p-2 text-navy-800 hover:bg-navy-50">
          <Menu size={20} />
        </button>
        <span className="text-sm font-semibold text-navy-900">PPRA 2027 · {state.profil.namaRS}</span>
        <span className="w-9" />
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <Brand />
              <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <NavLinks current={current} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex">
        <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-3 lg:flex">
          <div className="mb-4 px-2 pt-2">
            <Brand />
          </div>
          <NavLinks current={current} />
          <div className="mt-auto px-2 pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ListChecks size={14} aria-hidden />
              {savedAt ? 'Tersimpan otomatis di perangkat ini' : 'Penyimpanan lokal tidak tersedia'}
            </div>
            <p className="mt-1">Alat bantu administratif, bukan pedoman klinis.</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

function Brand() {
  const { state } = useStore()
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-navy-600">Management Kit</div>
      <div className="text-base font-semibold leading-tight text-navy-900">PPRA 2027</div>
      <div className="text-xs text-slate-500">{state.profil.namaRS}</div>
    </div>
  )
}
