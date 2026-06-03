import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import type {
  EvaluationStatus,
  PhaseProgressStatus,
  SubmissionStatus,
} from '@skilldrop/shared';
import { cn } from '@/lib/utils';
import { Icon } from './icons';
import { Mascot, type MascotVariant } from './Mascot';

export const cx = cn;

/* --------------------------------- Button --------------------------------- */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/20',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
  outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 bg-white dark:bg-slate-900',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/20',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20',
};
const buttonSizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconRight?: string;
    loading?: boolean;
  }
>(({ className = '', variant = 'primary', size = 'md', icon, iconRight, loading, children, disabled, ...props }, ref) => {
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none select-none',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner className={iconSize} /> : icon && <Icon name={icon} className={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} className={iconSize} />}
    </button>
  );
});
Button.displayName = 'Button';

/* ---------------------------------- Card ---------------------------------- */
export function Card({ className = '', as, ...props }: HTMLAttributes<HTMLDivElement> & { as?: ElementType }) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cx('rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft', className)}
      {...props}
    />
  );
}

/* ---------------------------------- Badge --------------------------------- */
type BadgeTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
const badgeTones: Record<BadgeTone, string> = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
  outline: 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
};
export function Badge({
  tone = 'default',
  icon,
  className = '',
  children,
}: {
  tone?: BadgeTone;
  icon?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', badgeTones[tone], className)}>
      {icon && <Icon name={icon} className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

/* ------------------------------ Status badges ----------------------------- */
const PHASE_STATUS: Record<PhaseProgressStatus, { label: string; tone: BadgeTone; icon: string }> = {
  LOCKED: { label: 'Bloqueada', tone: 'default', icon: 'lock' },
  AVAILABLE: { label: 'Disponible', tone: 'primary', icon: 'arrowRight' },
  IN_PROGRESS: { label: 'En progreso', tone: 'warning', icon: 'pencil' },
  IN_REVIEW: { label: 'En revisión', tone: 'primary', icon: 'clock' },
  COMPLETED: { label: 'Completada', tone: 'success', icon: 'check' },
};
export function PhaseStatusBadge({ status }: { status: PhaseProgressStatus }) {
  const s = PHASE_STATUS[status] ?? PHASE_STATUS.LOCKED;
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

const EVAL_STATUS: Record<EvaluationStatus, { label: string; tone: BadgeTone; icon: string }> = {
  APROBADO: { label: 'Aprobado', tone: 'success', icon: 'checkCircle' },
  REQUIERE_MEJORAS: { label: 'Requiere mejoras', tone: 'warning', icon: 'alert' },
  REHACER: { label: 'Rehacer', tone: 'danger', icon: 'x' },
};
export function EvalStatusBadge({ status }: { status: EvaluationStatus }) {
  const s = EVAL_STATUS[status] ?? EVAL_STATUS.REQUIERE_MEJORAS;
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

const SUBMISSION_STATUS: Record<SubmissionStatus, { label: string; tone: BadgeTone; icon: string }> = {
  DRAFT: { label: 'Borrador', tone: 'default', icon: 'doc' },
  SUBMITTED: { label: 'Enviada', tone: 'primary', icon: 'upload' },
  IN_REVIEW: { label: 'En revisión', tone: 'primary', icon: 'clock' },
  APPROVED: { label: 'Aprobada', tone: 'success', icon: 'checkCircle' },
  NEEDS_WORK: { label: 'Requiere mejoras', tone: 'warning', icon: 'alert' },
  REDO: { label: 'Rehacer', tone: 'danger', icon: 'x' },
};
export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const s = SUBMISSION_STATUS[status] ?? SUBMISSION_STATUS.SUBMITTED;
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

/* -------------------------------- ProgressBar ----------------------------- */
type ProgressTone = 'brand' | 'success' | 'warning' | 'danger';
export function ProgressBar({
  value = 0,
  className = '',
  tone = 'brand',
  height = 'h-2',
}: {
  value?: number;
  className?: string;
  tone?: ProgressTone;
  height?: string;
}) {
  const tones: Record<ProgressTone, string> = {
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };
  return (
    <div className={cx('w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden', height, className)}>
      <div className={cx('h-full rounded-full transition-all duration-500', tones[tone])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/* ------------------------------ Score helpers ----------------------------- */
export function gradeTone(n: number | null): ProgressTone {
  if (n == null) return 'brand';
  if (n >= 8) return 'success';
  if (n >= 6.5) return 'warning';
  return 'danger';
}
export function gradeText(n: number | null): string {
  if (n == null) return 'text-slate-400';
  if (n >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (n >= 6.5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

/* ---------------------------------- Stars --------------------------------- */
export function Stars({ value = 0, max = 5, className = 'w-3.5 h-3.5' }: { value?: number; max?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: max }).map((_, i) => (
        <Icon key={i} name="star" className={cx(className, i < value ? '' : 'text-slate-200 dark:text-slate-700')} fill={i < value ? 'currentColor' : 'none'} strokeWidth={i < value ? 0 : 1.5} />
      ))}
    </span>
  );
}

/* ----------------------------------- Dots --------------------------------- */
export function LevelDots({ value = 0, max = 5 }: { value?: number; max?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={cx('w-2 h-2 rounded-full', i < value ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700')} />
      ))}
    </span>
  );
}

/* ------------------------------ Form controls ----------------------------- */
export function Field({ label, hint, children, className = '' }: { label?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx('block', className)}>
      {label && <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1.5">{hint}</span>}
    </label>
  );
}
const fieldBase = 'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className = '', ...props }, ref) => (
  <input ref={ref} className={cx(fieldBase, className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className = '', rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cx(fieldBase, 'resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(fieldBase, 'appearance-none pr-9 cursor-pointer', className)} {...props}>{children}</select>
      <Icon name="chevronDown" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

/* ---------------------------------- Avatar -------------------------------- */
export function Avatar({ name = '', size = 'md', className = '' }: { name?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '·';
  const sizes = { xs: 'w-7 h-7 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <span className={cx('inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 font-semibold shrink-0', sizes[size], className)}>
      {initials}
    </span>
  );
}

/* ----------------------------------- Table -------------------------------- */
export function Table({ head, children, className = '' }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className={cx('overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {head.map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
      </table>
    </div>
  );
}

/* --------------------------------- Spinner -------------------------------- */
export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={cx('animate-spin text-brand-600', className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------ Section title ----------------------------- */
export function SectionTitle({ icon, title, action, className = '' }: { icon?: string; title: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-center justify-between gap-3 mb-4', className)}>
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
        {icon && <Icon name={icon} className="w-5 h-5 text-brand-600 dark:text-brand-400" />}
        {title}
      </h2>
      {action}
    </div>
  );
}

/* -------------------------------- EmptyState ------------------------------ */
export function EmptyState({
  mascot = 'success',
  title,
  children,
  action,
}: {
  mascot?: MascotVariant;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <Mascot variant={mascot} className="w-40 h-40 mb-5" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {children && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------------- Loader --------------------------------- */
export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
