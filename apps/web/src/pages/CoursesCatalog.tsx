import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { CourseSummaryDTO } from '@skilldrop/shared';
import { getCourses } from '@/lib/queries';
import { Icon } from '@/components/icons';
import { Badge, Card, cx, PageLoader, ProgressBar } from '@/components/ui';
import { PageHeader } from '@/components/Layout';

function CourseCard({ course }: { course: CourseSummaryDTO }) {
  const navigate = useNavigate();
  const started = course.progressPercent > 0;
  const done = course.phaseCount > 0 && course.completedPhases === course.phaseCount;

  return (
    <Card
      onClick={() => navigate(`/course/${course.id}`)}
      className="p-6 cursor-pointer transition-all hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40 flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <Icon name="layers" className="w-6 h-6" />
        </div>
        {done ? (
          <Badge tone="success" icon="check">Completado</Badge>
        ) : started ? (
          <Badge tone="warning" icon="pencil">En progreso</Badge>
        ) : (
          <Badge tone="primary" icon="arrowRight">Empezar</Badge>
        )}
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg leading-snug">
        {course.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">
        {course.subtitle || course.description}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span>{course.completedPhases}/{course.phaseCount} fases</span>
          <span className="font-medium">{course.progressPercent}%</span>
        </div>
        <ProgressBar value={course.progressPercent} tone={done ? 'success' : 'brand'} />
      </div>

      <div className={cx('mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400')}>
        {started ? 'Continuar' : 'Ver curso'}
        <Icon name="arrowRight" className="w-4 h-4" />
      </div>
    </Card>
  );
}

export function CoursesCatalog() {
  const { data: courses, isLoading } = useQuery({ queryKey: ['courses'], queryFn: getCourses });

  if (isLoading || !courses) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center gap-5 mb-7">
        <img src="/mascot/guide.png" alt="" className="w-20 h-20 object-contain hidden sm:block" />
        <PageHeader
          eyebrow="Catálogo"
          title="Cursos"
          subtitle="Elige un curso y avanza por dominio. Tu progreso se guarda por separado en cada uno."
        />
      </div>

      {courses.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Todavía no hay cursos publicados.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}
