import { useEffect, useState, type ReactNode } from 'react'
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
  { path: '', label: 'Dashboard', icon: LayoutDashboard, group: 'Ringkasan' },
  { path: 'panduan', label: 'Panduan Ketua PPRA', icon: BookOpen, group: 'Ringkasan' },
  { path: 'persiapan', label: 'Persiapan 7 Hari', icon: CheckSquare, group: 'Persiapan & evaluasi' },
  { path: 'evaluasi', label: 'Evaluasi Program 2026', icon: ClipboardList, group: 'Persiapan & evaluasi' },
  { path: 'gap', label: 'Gap Analysis', icon: Search, group: 'Persiapan & evaluasi' },
  { path: 'program', label: 'Program Kerja 2027', icon: Target, group: 'Perencanaan 2027' },
  { path: 'timeline', label: 'Timeline 2027', icon: CalendarDays, group: 'Perencanaan 2027' },
  { path: 'kpi', label: 'Monitoring KPI', icon: Gauge, group: 'Perencanaan 2027' },
  { path: 'koordinasi', label: 'Panduan Koordinasi', icon: Users, group: 'Pelaksanaan' },
  { path: 'pelaporan', label: 'Template Pelaporan', icon: FileText, group: 'Pelaksanaan' },
  { path: 'konfirmasi', label: 'Info Perlu Konfirmasi', icon: HelpCircle, group: 'Referensi' },
  { path: 'regulasi', label: 'Regulasi & Pedoman', icon: Scale, group: 'Referensi' },
  { path: 'unduh', label: 'Unduh Dokumen', icon: Download, group: 'Dokumen & data' },
  { path: 'pengaturan', label: 'Profil & Data', icon: Settings, group: 'Dokumen & data' },
] as const

const GROUPS = [...new Set(NAV.map((n) => n.group))]

function NavLinks({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Menu utama" className="flex flex-col gap-5">
      {GROUPS.map((group) => (
        <div key={group}>
          <div className="mb-1.5 px-2.5 font-mono text-xs text-ink-500">{group}</div>
          <div className="flex flex-col">
            {NAV.filter((n) => n.group === group).map(({ path, label, icon: Icon }) => {
              const active = current === path
              return (
                <a
                  key={path}
                  href={`#/${path}`}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors pointer-coarse:py-2.5 ${
                    active ? 'bg-ink-100 font-medium text-ink-900' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.75} aria-hidden className={active ? 'text-ink-900' : 'text-ink-400'} />
                  {label}
                </a>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  const { savedAt } = useStore()
  return (
    <div className="mt-auto border-t border-ink-200 px-2.5 pt-4 text-xs leading-relaxed text-ink-500">
      <p>{savedAt ? 'Tersimpan otomatis di perangkat ini.' : 'Penyimpanan lokal tidak tersedia.'}</p>
      <p className="mt-1">Alat bantu administratif, bukan pedoman klinis.</p>
    </div>
  )
}

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pageLabel = NAV.find((n) => n.path === current)?.label ?? 'Dashboard'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-screen bg-paper text-ink-900">
      <header className="no-print pt-safe sticky top-0 z-30 border-b border-ink-200 bg-paper/90 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center gap-2 px-2 sm:px-4">
          <button type="button" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md text-ink-900 hover:bg-ink-100">
            <Menu size={20} />
          </button>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[15px] font-semibold tracking-tight">{pageLabel}</div>
            <div className="font-mono text-xs text-ink-500">PPRA 2027</div>
          </div>
        </div>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink-900/30" onClick={() => setOpen(false)} />
          <aside className="pt-safe pb-safe absolute left-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col overflow-y-auto overscroll-contain border-r border-ink-200 bg-paper px-3">
            <div className="mb-6 flex items-center justify-between pl-2.5 pt-3">
              <Brand />
              <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900">
                <X size={20} />
              </button>
            </div>
            <NavLinks current={current} onNavigate={() => setOpen(false)} />
            <div className="mt-6 flex flex-1 flex-col pb-4">
              <SidebarFooter />
            </div>
          </aside>
        </div>
      )}

      <div className="flex">
        <aside className="scrollbar-thin no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-ink-200 px-3 pb-5 pt-6 lg:flex">
          <div className="mb-8 px-2.5">
            <Brand />
          </div>
          <NavLinks current={current} />
          <div className="mt-6 flex flex-1 flex-col">
            <SidebarFooter />
          </div>
        </aside>
        <main className="pb-safe min-w-0 flex-1 px-4 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

function Brand() {
  const { state } = useStore()
  return (
    <div className="min-w-0">
      <div className="text-sm font-semibold tracking-tight">PPRA 2027</div>
      <div className="mt-0.5 truncate font-mono text-xs text-ink-500">{state.profil.namaRS}</div>
    </div>
  )
}
