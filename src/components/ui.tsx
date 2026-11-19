import type { CSSProperties, ReactNode } from 'react'
import type { Sumber } from '../types'

const SUMBER_STYLE: Record<Sumber, { label: string; cls: string; title: string }> = {
  fakta: { label: 'Fakta – Dok. RSCC 2026', cls: 'bg-navy-100 text-navy-800 border-navy-200', title: 'Isi dokumen Program Kerja Komite PPRA 2026 RS Condong Catur' },
  rekomendasi: { label: 'Rekomendasi', cls: 'bg-white text-navy-700 border-navy-200', title: 'Usulan berdasarkan brief persiapan; dapat disesuaikan' },
  konfirmasi: { label: 'Perlu konfirmasi', cls: 'bg-amber-50 text-amber-800 border-amber-300', title: 'Belum diverifikasi; konfirmasikan sebelum digunakan' },
  ilustrasi: { label: 'Ilustrasi', cls: 'bg-slate-50 text-slate-600 border-slate-300 border-dashed', title: 'Contoh pengisian, bukan data RS' },
  regulasi: { label: 'Regulasi terverifikasi', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300', title: 'Diverifikasi melalui sumber resmi per 19 November 2026' },
}

export function Badge({ sumber, children }: { sumber: Sumber; children?: ReactNode }) {
  const s = SUMBER_STYLE[sumber]
  return (
    <span title={s.title} className={`inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none ${s.cls}`}>
      {children ?? s.label}
    </span>
  )
}

export function Konfirmasi({ teks = 'Perlu konfirmasi' }: { teks?: string }) {
  return <Badge sumber="konfirmasi">{teks}</Badge>
}

export function PageHeader({ title, desc, actions, badges }: { title: string; desc?: ReactNode; actions?: ReactNode; badges?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">{title}</h1>
        {desc && <div className="mt-1 max-w-3xl text-sm text-slate-600">{desc}</div>}
        {badges && <div className="mt-2 flex flex-wrap gap-1.5">{badges}</div>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function Card({ title, children, className = '', right, id }: { title?: ReactNode; children: ReactNode; className?: string; right?: ReactNode; id?: string }) {
  return (
    <section id={id} className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {(title || right) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          {title && <h2 className="text-base font-semibold text-navy-900">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800 border-navy-700',
  secondary: 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50',
  ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100',
  danger: 'bg-white text-red-700 border-red-200 hover:bg-red-50',
}

export function Button({
  children,
  onClick,
  variant = 'secondary',
  type = 'button',
  title,
  className = '',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  type?: 'button' | 'submit'
  title?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`no-print inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BTN[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function TextField({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  className = '',
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  label?: string
  type?: 'text' | 'date' | 'number'
  className?: string
  ariaLabel?: string
}) {
  const input = (
    <>
      <input
        type={type}
        value={value}
        aria-label={ariaLabel ?? label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`editable print-hide-field w-full px-2 py-1.5 text-sm ${className}`}
      />
      <div className="print-only text-sm">{value || <span className="text-slate-400">{placeholder ?? '—'}</span>}</div>
    </>
  )
  if (!label) return input
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {input}
    </label>
  )
}

export function AreaField({
  value,
  onChange,
  placeholder,
  label,
  rows = 2,
  hint,
  ariaLabel,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  label?: string
  rows?: number
  hint?: string
  ariaLabel?: string
  className?: string
}) {
  const area = (
    <>
      <textarea
        value={value}
        rows={rows}
        aria-label={ariaLabel ?? label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ fieldSizing: 'content' } as CSSProperties}
        className={`editable print-hide-field block w-full resize-y px-2 py-1.5 text-sm ${className}`}
      />
      <div className="print-only whitespace-pre-wrap text-sm">{value || <span className="text-slate-400">—</span>}</div>
    </>
  )
  if (!label) return area
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {area}
      {hint && <span className="no-print mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export function SelectField<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
  labels,
}: {
  value: T
  onChange: (v: T) => void
  options: readonly T[]
  ariaLabel: string
  className?: string
  labels?: Partial<Record<T, string>>
}) {
  return (
    <>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value as T)}
        className={`editable print-hide-field w-full px-2 py-1.5 text-sm ${className}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? (o || '— pilih —')}
          </option>
        ))}
      </select>
      <div className="print-only text-sm">{labels?.[value] ?? (value || '—')}</div>
    </>
  )
}

export function Checkbox({ checked, onChange, children, id }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-1 hover:bg-navy-50">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-navy-700" />
      <span className={`text-sm ${checked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{children}</span>
    </label>
  )
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-slate-600">
          <span>{label}</span>
          <span className="font-medium text-navy-800">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-navy-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{children}</div>}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  )
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  const cls = tone === 'warn' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-navy-200 bg-navy-50 text-navy-900'
  return <div className={`rounded-md border-l-4 px-3 py-2 text-sm ${cls}`}>{children}</div>
}

export function BulletList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`list-disc space-y-1 pl-5 text-sm text-slate-700 ${className}`}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  )
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <th className={`border-b border-slate-200 bg-navy-50 px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-800 ${className}`}>{children}</th>
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`border-b border-slate-100 px-2 py-2 align-top text-sm ${className}`}>{children}</td>
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
      <span>Label sumber:</span>
      <Badge sumber="fakta" />
      <Badge sumber="regulasi" />
      <Badge sumber="rekomendasi" />
      <Badge sumber="konfirmasi" />
      <Badge sumber="ilustrasi" />
      <span className="ml-1 inline-flex items-center gap-1">
        <span className="editable inline-block h-3.5 w-6" /> = kolom dapat diisi
      </span>
    </div>
  )
}
