import type { TraceStep } from '@/lib/runner';
import { Icon } from './icons';
import { cx } from './ui';

function statusTone(status?: number) {
  if (status == null) return 'text-slate-500';
  if (status >= 500) return 'text-red-600 dark:text-red-400';
  if (status >= 400) return 'text-amber-600 dark:text-amber-400';
  if (status >= 200 && status < 300) return 'text-emerald-600 dark:text-emerald-400';
  return 'text-slate-600 dark:text-slate-300';
}

function Box({
  icon,
  label,
  sub,
  tone = 'slate',
}: {
  icon: string;
  label: string;
  sub?: string;
  tone?: 'slate' | 'brand' | 'amber' | 'emerald';
}) {
  const tones = {
    slate: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
    brand: 'border-brand-300 dark:border-brand-500/40 bg-brand-50/60 dark:bg-brand-500/10',
    amber: 'border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-500/10',
    emerald: 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-500/10',
  };
  return (
    <div className={cx('flex items-center gap-3 rounded-lg border px-3.5 py-2.5', tones[tone])}>
      <Icon name={icon} className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {sub && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{sub}</p>}
      </div>
    </div>
  );
}

function Connector({ blocked }: { blocked?: boolean }) {
  return (
    <div className="flex items-center justify-center h-4">
      <Icon
        name="chevronDown"
        className={cx('w-4 h-4', blocked ? 'text-red-400' : 'text-slate-300 dark:text-slate-600')}
      />
    </div>
  );
}

export function RequestVisualizer({ trace }: { trace: TraceStep[] }) {
  const reachedHandler = trace.some((t) => t.step === 'handler');
  const response = trace.find((t) => t.step === 'response');
  const blocked = !!response && !response.reached;

  return (
    <div className="space-y-0">
      {trace.map((t, i) => {
        if (t.step === 'request') {
          return (
            <div key={i}>
              <Box icon="upload" label="Petición" sub={`${t.method} ${t.path}`} tone="brand" />
              <Connector />
            </div>
          );
        }
        if (t.step === 'middleware') {
          // ¿este middleware cortó la cadena? (es el último antes de la respuesta y no se llegó al handler)
          const isLastMw =
            trace.slice(i + 1).every((x) => x.step === 'response');
          const cut = isLastMw && blocked;
          return (
            <div key={i}>
              <Box
                icon="layers"
                label={`Middleware: ${t.name}`}
                sub={cut ? '⛔ cortó la cadena (no llamó a next)' : 'pasa a next()'}
                tone={cut ? 'amber' : 'slate'}
              />
              <Connector blocked={cut} />
            </div>
          );
        }
        if (t.step === 'handler') {
          return (
            <div key={i}>
              <Box icon="bolt" label="Handler" sub="genera la respuesta" tone="emerald" />
              <Connector />
            </div>
          );
        }
        // response
        return (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5">
            <Icon name="check" className="w-4 h-4 shrink-0 text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Respuesta <span className={cx('font-bold tabular-nums', statusTone(t.status))}>{t.status}</span>
                {blocked && <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">(no llegó al handler)</span>}
              </p>
              {t.body !== undefined && (
                <pre className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap break-all">
                  {typeof t.body === 'string' ? t.body : JSON.stringify(t.body)}
                </pre>
              )}
            </div>
          </div>
        );
      })}
      {!reachedHandler && !response && (
        <p className="text-xs text-slate-400 mt-2">No se generó respuesta.</p>
      )}
    </div>
  );
}
