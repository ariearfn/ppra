import type { CSSProperties, ReactNode } from 'react'
import type { Sumber } from '../types'

const SUMBER_STYLE: Record<Sumber, { label: string; cls: string; title: string }> = {
  fakta: { label: 'Fakta – Dok. RSCC 2026', cls: 'bg-ink-100 text-ink-900 border-ink-200', title: 'Isi dokumen Program Kerja Komite PPRA 2026 RS Condong Catur' },
  rekomendasi: { label: 'Rekomendasi', cls: 'text-ink-600 border-ink-200', title: 'Usulan berdasarkan brief persiapan; dapat disesuaikan' },
  konfirmasi: { label: 'Perlu konfirmasi', cls: 'bg-accent/5 text-accent border-accent/35', title: 'Belum diverifikasi; konfirmasikan sebelum digunakan' },
  ilustrasi: { label: 'Ilustrasi', cls: 'text-ink-500 border-ink-300 border-dashed', title: 'Contoh pengisian, bukan data RS' },
  regulasi: { label: 'Regulasi terverifikasi', cls: 'bg-emerald-700/5 text-emerald-800 border-emerald-700/30', title: 'Diverifikasi melalui sumber resmi per 19 November 2026' },
}

export function Badge({ sumber, children }: { sumber: Sumber; children?: ReactNode }) {
  const s = SUMBER_STYLE[sumber]
  return (
    <span title={s.title} className={`inline-flex items-center whitespace-nowrap rounded-sm border px-1.5 py-1 text-xs/none font-medium ${s.cls}`}>
      {children ?? s.label}
    </span>
  )
}

export function Konfirmasi({ teks = 'Perlu konfirmasi' }: { teks?: string }) {
  return <Badge sumber="konfirmasi">{teks}</Badge>
}

export function PageHeader({ title, desc, actions, badges }: { title: string; desc?: ReactNode; actions?: ReactNode; badges?: ReactNode }) {
  return (
    <header className="mb-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="max-w-3xl text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink-900 sm:text-4xl">{title}</h1>
        {desc && <div className="mt-3 max-w-[65ch] text-base leading-relaxed text-pretty text-ink-600">{desc}</div>}
        {badges && <div className="mt-4 flex flex-wrap gap-1.5">{badges}</div>}
      </div>
      {actions && <div className="no-print flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function Card({ title, children, className = '', right, id }: { title?: ReactNode; children: ReactNode; className?: string; right?: ReactNode; id?: string }) {
  return (
    <section id={id} className={className}>
      {(title || right) && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-900 pb-2.5">
          {title && <h2 className="text-base font-semibold text-ink-900">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-ink-900 text-paper border-ink-900 hover:opacity-85',
  secondary: 'bg-card text-ink-900 border-ink-200 hover:border-ink-900',
  ghost: 'bg-transparent text-ink-500 border-transparent hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-card text-red-700 border-red-200 hover:border-red-700',
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
      className={`no-print inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-md border px-3.5 text-sm pointer-coarse:h-11 pointer-coarse:min-w-11 font-medium transition-[opacity,border-color,background-color,color] disabled:cursor-not-allowed disabled:opacity-40 ${BTN[variant]} ${className}`}
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
      <div className="print-only text-sm">{value || <span className="text-ink-400">{placeholder ?? '—'}</span>}</div>
    </>
  )
  if (!label) return input
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500">{label}</span>
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
      <div className="print-only whitespace-pre-wrap text-sm">{value || <span className="text-ink-400">—</span>}</div>
    </>
  )
  if (!label) return area
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500">{label}</span>
      {area}
      {hint && <span className="no-print mt-1 block text-xs text-ink-500">{hint}</span>}
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
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-md px-1.5 py-1.5 hover:bg-ink-100/70 pointer-coarse:py-2.5">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-ink-900 pointer-coarse:mt-0.5" />
      <span className={`text-sm ${checked ? 'text-ink-500 line-through decoration-ink-300' : 'text-ink-900'}`}>{children}</span>
    </label>
  )
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          <span className="min-w-0 text-ink-600">{label}</span>
          <span className="shrink-0 font-mono text-xs text-ink-500">{value}%</span>
        </div>
      )}
      <div className="h-1 w-full overflow-hidden bg-ink-200" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-ink-900 transition-[width] duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-ink-300 px-4 py-8 text-center">
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-xl text-sm text-ink-500">{children}</div>}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  )
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  const cls = tone === 'warn' ? 'border-accent text-ink-900' : 'border-ink-900 text-ink-600'
  return <div className={`max-w-[75ch] border-l-2 py-0.5 pl-3.5 text-sm leading-relaxed ${cls}`}>{children}</div>
}

export function BulletList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-1.5 text-sm text-ink-600 ${className}`}>
      {items.map((t, i) => (
        <li key={i} className="grid grid-cols-[0.875rem_1fr]">
          <span aria-hidden className="text-ink-300">–</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <th className={`border-b border-ink-900 px-3 py-2 text-left text-xs font-medium text-ink-500 ${className}`}>{children}</th>
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`border-b border-ink-200 px-3 py-2.5 align-top text-sm ${className}`}>{children}</td>
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
      <span className="mr-1">Label sumber</span>
      <Badge sumber="fakta" />
      <Badge sumber="regulasi" />
      <Badge sumber="rekomendasi" />
      <Badge sumber="konfirmasi" />
      <Badge sumber="ilustrasi" />
      <span className="ml-1 inline-flex items-center gap-1.5">
        <span className="editable inline-block h-3.5 w-6" /> kolom dapat diisi
      </span>
    </div>
  )
}
