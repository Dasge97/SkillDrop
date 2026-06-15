import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { PhaseDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/Layout';
import {
  Badge,
  Card,
  cx,
  PageLoader,
  PhaseStatusBadge,
  ProgressBar,
  SectionTitle,
  Stars,
} from '@/components/ui';

export function PhaseView() {
  const { id } = useParams<{ id: string }>();
  const { data: phase, isLoading } = useQuery({
    queryKey: ['phase', id],
    queryFn: () => api.get<PhaseDTO>(`/phases/${id}`),
    enabled: !!id,
  });

  if (isLoading || !phase) return <PageLoader />;

  const progressTone = phase.status === 'COMPLETED' ? 'success' : 'brand';

  return (
    <div>
      <PageHeader
        back={{ to: `/course/${phase.courseId}`, label: 'Roadmap del curso' }}
        eyebrow={phase.code}
        title={phase.title}
        subtitle={phase.objective}
        actions={<PhaseStatusBadge status={phase.status} />}
      />

      {/* Tarjeta de progreso y habilidades */}
      <Card className="p-6 mb-6 grid sm:grid-cols-[1fr_auto] gap-5 items-center">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500 dark:text-slate-400">Progreso de la fase</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{phase.progressPercent}%</span>
          </div>
          <ProgressBar value={phase.progressPercent} tone={progressTone} className="mb-5" />

          {phase.unlockedSkills.length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Habilidades que desbloquea
              </p>
              <div className="flex flex-wrap gap-2">
                {phase.unlockedSkills.map((sk) => (
                  <Badge key={sk} tone="primary" icon="layers">{sk}</Badge>
                ))}
              </div>
            </>
          )}
        </div>
        <img
          src="/mascot/guide.png"
          alt=""
          className="w-28 h-28 object-contain hidden sm:block"
        />
      </Card>

      <SectionTitle icon="book" title={`Lecciones (${phase.lessons.length})`} />
      <div className="space-y-3">
        {phase.lessons.map((lesson, i) => (
          <Link key={lesson.id} to={`/lesson/${lesson.id}`} className="block">
            <Card className="w-full text-left p-4 flex items-center gap-4 hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40 transition-all">
              <div
                className={cx(
                  'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold',
                  'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {lesson.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {lesson.objective}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
                {lesson.challenge && (
                  <Stars value={lesson.challenge.difficulty} className="w-3.5 h-3.5" />
                )}
                <span className="flex items-center gap-1 text-xs">
                  <Icon name="clock" className="w-3.5 h-3.5" />
                  {lesson.estimatedTimeMinutes} min
                </span>
                <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
