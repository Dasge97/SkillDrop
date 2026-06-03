import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { DashboardDTO } from '@skilldrop/shared';
import { ESTIMATED_LEVEL_LABEL } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, ProgressBar, Spinner } from '@/components/ui';
import { evaluationStatusMeta } from '@/lib/status';
import { scoreColor } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardDTO>('/me/dashboard'),
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7 text-primary" />
      </div>
    );
  }

  const ev = data.lastEvaluation;

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-accent/60 to-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Mascot variant="guide" className="h-20 w-20" />
          <div>
            <p className="text-sm text-muted-foreground">Hola de nuevo,</p>
            <h1 className="text-2xl font-extrabold tracking-tight">{user?.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{data.course.title}</p>
          </div>
        </div>
        {data.nextChallenge ? (
          <Link to={`/challenge/${data.nextChallenge.id}`}>
            <Button size="lg">Continuar →</Button>
          </Link>
        ) : (
          <Link to="/roadmap">
            <Button size="lg" variant="outline">Ver roadmap</Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Progreso del curso" value={`${data.progressPercent}%`} />
        <Stat
          label="Nota media"
          value={<span className={scoreColor(data.averageScore)}>{data.averageScore ?? '—'}</span>}
          sub="mínimo 8 para avanzar"
        />
        <Stat label="XP total" value={data.totalXp} sub="🔥 puntos de experiencia" />
        <Stat label="Racha" value={`${data.streakDays} días`} sub="¡no la rompas!" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fase / lección actual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tu posición actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.currentPhase ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge tone="primary">{data.currentPhase.code}</Badge>
                    <p className="mt-1 font-semibold">{data.currentPhase.title}</p>
                  </div>
                  <Link to={`/phase/${data.currentPhase.id}`}>
                    <Button variant="outline" size="sm">Ver fase</Button>
                  </Link>
                </div>
                <ProgressBar value={data.progressPercent} />
                {data.currentLesson && (
                  <p className="text-sm text-muted-foreground">
                    Lección actual: <span className="font-medium text-foreground">{data.currentLesson.title}</span>
                  </p>
                )}
                {data.nextChallenge && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    <Mascot variant="working" className="h-10 w-10" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Próximo reto</p>
                      <p className="text-sm text-muted-foreground">{data.nextChallenge.title}</p>
                    </div>
                    <Link to={`/challenge/${data.nextChallenge.id}`}>
                      <Button size="sm">Ir</Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Empieza por el roadmap para activar tu primera fase.</p>
            )}
          </CardContent>
        </Card>

        {/* Última evaluación */}
        <Card>
          <CardHeader>
            <CardTitle>Última evaluación</CardTitle>
          </CardHeader>
          <CardContent>
            {ev ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mascot variant={evaluationStatusMeta[ev.status].mascot} className="h-12 w-12" />
                  <div>
                    <Badge tone={evaluationStatusMeta[ev.status].tone}>
                      {evaluationStatusMeta[ev.status].label}
                    </Badge>
                    <p className={`text-2xl font-bold ${scoreColor(ev.totalScore)}`}>{ev.totalScore}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nivel estimado: {ESTIMATED_LEVEL_LABEL[ev.estimatedLevel]}
                </p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{ev.mentorFeedback}</p>
                <Link to={`/submission/${ev.submissionId}`}>
                  <Button variant="outline" size="sm" className="w-full">Ver evaluación</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <Mascot variant="idea" className="h-16 w-16" />
                <p className="text-sm text-muted-foreground">Aún no tienes evaluaciones. ¡Entrega tu primer reto!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fortalezas / debilidades */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">💪 Puntos fuertes</CardTitle></CardHeader>
          <CardContent>
            {data.strengths.length ? (
              <div className="flex flex-wrap gap-2">
                {data.strengths.map((s) => <Badge key={s} tone="success">{s}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">Se revelarán con tus primeras entregas.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">🎯 A mejorar</CardTitle></CardHeader>
          <CardContent>
            {data.weaknesses.length ? (
              <div className="flex flex-wrap gap-2">
                {data.weaknesses.map((s) => <Badge key={s} tone="warning">{s}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">Sin debilidades destacadas todavía.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
