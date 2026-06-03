import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AdminOverviewDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Icon } from '@/components/icons';
import { Badge, Card, PageLoader } from '@/components/ui';

/* ---------- MetricCard ---------- */
function MetricCard({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        <Icon name={icon} className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        {title}
      </h3>
      {children}
    </Card>
  );
}

/* ---------- Stat mini (número + label) ---------- */
function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
      <p className="text-2xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

type BadgeTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';

const SUBMISSION_ROWS: { label: string; key: keyof AdminOverviewDTO['submissions']; tone: BadgeTone }[] = [
  { label: 'Total',           key: 'total',     tone: 'default' },
  { label: 'Pendientes',      key: 'pending',   tone: 'warning' },
  { label: 'Aprobadas',       key: 'approved',  tone: 'success' },
  { label: 'Requieren mejora',key: 'needsWork', tone: 'danger'  },
];

export function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => api.get<AdminOverviewDTO>('/admin/overview'),
  });

  if (isLoading || !data) return <PageLoader />;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Usuarios por rol */}
      <MetricCard title="Usuarios por rol" icon="users">
        <div className="space-y-2.5">
          {(
            [
              { label: 'Total',    value: data.users.total,    tone: 'default'  },
              { label: 'Alumnos',  value: data.users.students, tone: 'primary'  },
              { label: 'Mentores', value: data.users.mentors,  tone: 'success'  },
              { label: 'Admins',   value: data.users.admins,   tone: 'warning'  },
            ] as { label: string; value: number; tone: BadgeTone }[]
          ).map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <Badge tone={row.tone}>{row.label}</Badge>
              <span className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">{row.value}</span>
            </div>
          ))}
        </div>
      </MetricCard>

      {/* Entregas por estado */}
      <MetricCard title="Entregas por estado" icon="inbox">
        <div className="space-y-2.5">
          {SUBMISSION_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <Badge tone={row.tone}>{row.label}</Badge>
              <span className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">{data.submissions[row.key]}</span>
            </div>
          ))}
        </div>
      </MetricCard>

      {/* Contenido */}
      <MetricCard title="Contenido" icon="layers">
        <div className="grid grid-cols-2 gap-3">
          <StatMini label="Cursos"   value={data.content.courses}    />
          <StatMini label="Fases"    value={data.content.phases}     />
          <StatMini label="Lecciones"value={data.content.lessons}    />
          <StatMini label="Retos"    value={data.content.challenges} />
        </div>
      </MetricCard>

      {/* Evaluaciones */}
      <MetricCard title="Evaluaciones" icon="review">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{data.evaluations}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">evaluaciones realizadas</p>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
