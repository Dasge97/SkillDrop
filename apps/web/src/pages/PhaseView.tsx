import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { PhaseDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Card, CardContent, ProgressBar, Spinner } from '@/components/ui';
import { phaseStatusMeta } from '@/lib/status';

const DIFF = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];

export function PhaseView() {
  const { id } = useParams<{ id: string }>();
  const { data: phase, isLoading } = useQuery({
    queryKey: ['phase', id],
    queryFn: () => api.get<PhaseDTO>(`/phases/${id}`),
    enabled: !!id,
  });

  if (isLoading || !phase) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const meta = phaseStatusMeta[phase.status];

  return (
    <div className="space-y-6">
      <Link to="/roadmap" className="text-sm text-muted-foreground hover:text-foreground">← Roadmap</Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-accent/50 to-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Mascot variant="guide" className="h-16 w-16" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">{phase.code}</span>
              <Badge tone={meta.tone}>{meta.icon} {meta.label}</Badge>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{phase.title}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{phase.objective}</p>
          </div>
        </div>
        <div className="min-w-[160px]">
          <p className="text-sm text-muted-foreground">Progreso</p>
          <p className="text-2xl font-bold">{phase.progressPercent}%</p>
          <ProgressBar value={phase.progressPercent} className="mt-1" />
        </div>
      </div>

      {phase.unlockedSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Desbloquea:</span>
          {phase.unlockedSkills.map((s) => <Badge key={s} tone="primary">{s}</Badge>)}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Lecciones</h2>
        <div className="grid gap-3">
          {phase.lessons.map((lesson, i) => (
            <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
              <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-center gap-4 pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{lesson.objective}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    {lesson.challenge && <span title="Dificultad">{DIFF[lesson.challenge.difficulty]}</span>}
                    <span>{lesson.estimatedTimeMinutes} min</span>
                    <span aria-hidden>→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
