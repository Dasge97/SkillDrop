import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { PhaseDTO, PhaseProgressStatus } from '@skilldrop/shared';
import { getMainCourse } from '@/lib/queries';
import { Icon } from '@/components/icons';
import {
  cx,
  Card,
  PhaseStatusBadge,
  ProgressBar,
  gradeText,
  PageLoader,
} from '@/components/ui';
import { PageHeader } from '@/components/Layout';

function PhaseCard({ phase }: { phase: PhaseDTO }) {
  const navigate = useNavigate();
  const locked = phase.status === 'LOCKED';
  const done = phase.status === 'COMPLETED';
  const challenges = phase.lessons.filter((l) => l.challenge).length;

  const circleClass = cx(
    'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
    done
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
      : locked
        ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
        : 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
  );

  return (
    <Card
      onClick={locked ? undefined : () => navigate(`/phase/${phase.id}`)}
      className={cx(
        'w-full text-left p-5 flex items-center gap-5 transition-all',
        locked
          ? 'opacity-60'
          : 'cursor-pointer hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40',
      )}
    >
      {/* Círculo de número / estado */}
      <div className={circleClass}>
        {done ? (
          <Icon name="check" className="w-6 h-6" />
        ) : locked ? (
          <Icon name="lock" className="w-5 h-5" />
        ) : (
          phase.order
        )}
      </div>

      {/* Contenido principal */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
            FASE {phase.order}
          </span>
          <PhaseStatusBadge status={phase.status as PhaseProgressStatus} />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
          {phase.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
          {phase.objective}
        </p>
        {!locked && phase.progressPercent > 0 && (
          <div className="mt-3 max-w-md">
            <ProgressBar
              value={phase.progressPercent}
              tone={done ? 'success' : 'brand'}
            />
          </div>
        )}
      </div>

      {/* Meta lateral */}
      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 text-right">
        <div className="flex items-center gap-1.5 text-sm">
          <Icon
            name="checkCircle"
            className={cx('w-4 h-4', gradeText(phase.averageScore))}
          />
          <span
            className={cx(
              'font-semibold tabular-nums',
              gradeText(phase.averageScore),
            )}
          >
            {phase.averageScore != null ? phase.averageScore.toFixed(1) : '—'}
          </span>
        </div>
        <span className="text-xs text-slate-400">{challenges} retos</span>
        {!locked && (
          <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        )}
      </div>
    </Card>
  );
}

export function Roadmap() {
  const { data: course, isLoading } = useQuery({
    queryKey: ['course'],
    queryFn: getMainCourse,
  });

  if (isLoading || !course) return <PageLoader />;

  return (
    <div>
      <PageHeader
        eyebrow={course.title}
        title="Roadmap del curso"
        subtitle="Las fases se desbloquean por dominio. Completa los retos de una fase para abrir la siguiente."
      />

      {/* Leyenda de estados */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'] as PhaseProgressStatus[]).map(
          (s) => <PhaseStatusBadge key={s} status={s} />,
        )}
      </div>

      <div className="space-y-3">
        {course.phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </div>
  );
}
