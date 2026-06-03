import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { PhaseDTO } from '@skilldrop/shared';
import { getMainCourse } from '@/lib/queries';
import { Mascot } from '@/components/Mascot';
import { Badge, Card, CardContent, ProgressBar, Spinner } from '@/components/ui';
import { phaseStatusMeta } from '@/lib/status';
import { cn, scoreColor } from '@/lib/utils';

function PhaseCard({ phase, index }: { phase: PhaseDTO; index: number }) {
  const navigate = useNavigate();
  const meta = phaseStatusMeta[phase.status];
  const locked = phase.status === 'LOCKED';
  const challenges = phase.lessons.filter((l) => l.challenge).length;

  return (
    <Card
      onClick={() => !locked && navigate(`/phase/${phase.id}`)}
      className={cn(
        'relative transition-all',
        locked ? 'opacity-60' : 'cursor-pointer hover:border-primary hover:shadow-md',
      )}
    >
      <CardContent className="flex gap-4 pt-5">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
            phase.status === 'COMPLETED'
              ? 'bg-success/15 text-success'
              : locked
                ? 'bg-muted text-muted-foreground'
                : 'bg-accent text-accent-foreground',
          )}
        >
          {phase.status === 'COMPLETED' ? '✓' : index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{phase.code}</span>
            <Badge tone={meta.tone}>{meta.icon} {meta.label}</Badge>
            {phase.averageScore != null && (
              <span className={cn('text-xs font-semibold', scoreColor(phase.averageScore))}>
                media {phase.averageScore}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-semibold">{phase.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{phase.objective}</p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={phase.progressPercent} className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {phase.progressPercent}% · {challenges} retos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Roadmap() {
  const { data: course, isLoading } = useQuery({
    queryKey: ['course'],
    queryFn: getMainCourse,
  });

  if (isLoading || !course) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot variant="guide" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Roadmap del curso</h1>
          <p className="text-sm text-muted-foreground">{course.title}</p>
        </div>
      </div>
      <div className="grid gap-3">
        {course.phases.map((phase, i) => (
          <PhaseCard key={phase.id} phase={phase} index={i} />
        ))}
      </div>
    </div>
  );
}
