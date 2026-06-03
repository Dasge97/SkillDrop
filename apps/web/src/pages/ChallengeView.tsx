import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { ChallengeDTO, SubmissionDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import { submissionStatusMeta } from '@/lib/status';
import { scoreColor } from '@/lib/utils';

const DIFF = ['', 'Muy fácil', 'Fácil', 'Media', 'Difícil', 'Muy difícil'];

function List({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">{icon} {title}</h3>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChallengeView() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => api.get<{ challenge: ChallengeDTO; submissions: SubmissionDTO[] }>(`/challenges/${id}`),
    enabled: !!id,
  });

  if (isLoading || !data) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const { challenge, submissions } = data;

  return (
    <div className="space-y-6">
      <Link to={`/lesson/${challenge.lessonId}`} className="text-sm text-muted-foreground hover:text-foreground">← Volver a la lección</Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-accent/50 to-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Mascot variant="working" className="h-20 w-20" />
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Reto práctico</p>
            <h1 className="text-2xl font-extrabold tracking-tight">{challenge.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge tone="muted">Dificultad: {DIFF[challenge.difficulty]}</Badge>
              <Badge tone="muted">⏱ {challenge.timeLimitMinutes} min recomendados</Badge>
            </div>
          </div>
        </div>
        <Link to={`/challenge/${challenge.id}/submit`}>
          <Button size="lg">Entregar trabajo</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Brief</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[15px] leading-relaxed">{challenge.brief}</p>
              {challenge.context && (
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Contexto: </span>{challenge.context}</p>
              )}
              {challenge.objective && (
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Objetivo: </span>{challenge.objective}</p>
              )}
              {challenge.targetUser && (
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Usuario objetivo: </span>{challenge.targetUser}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card><CardContent className="pt-5"><List title="Restricciones" icon="🚫" items={challenge.restrictions} /></CardContent></Card>
            <Card><CardContent className="pt-5"><List title="Entregables" icon="📦" items={challenge.deliverables} /></CardContent></Card>
            <Card><CardContent className="pt-5"><List title="Checklist antes de entregar" icon="✅" items={challenge.checklist} /></CardContent></Card>
            <Card><CardContent className="pt-5"><List title="Errores comunes" icon="⚠️" items={challenge.commonMistakes} /></CardContent></Card>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rúbrica */}
          {challenge.rubric && (
            <Card>
              <CardHeader><CardTitle className="text-base">Criterios de evaluación</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {challenge.rubric.criteria.map((c) => (
                  <div key={c.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {c.isCritical && <Badge tone="danger">crítico</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                ))}
                <p className="pt-2 text-xs text-muted-foreground">
                  Cada criterio se puntúa de 1 a 10. Para aprobar la fase: media ≥ 8 y ningún crítico &lt; 7.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {challenge.skills.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Habilidades evaluadas</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {challenge.skills.map((s) => <Badge key={s} tone="primary">{s}</Badge>)}
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          <Card>
            <CardHeader><CardTitle className="text-base">Tus entregas</CardTitle></CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no has entregado este reto.</p>
              ) : (
                <div className="space-y-2">
                  {submissions.map((s) => (
                    <Link
                      key={s.id}
                      to={`/submission/${s.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm hover:border-primary"
                    >
                      <span className="font-medium">v{s.version}</span>
                      <div className="flex items-center gap-2">
                        {s.evaluation && (
                          <span className={`font-semibold ${scoreColor(s.evaluation.totalScore)}`}>
                            {s.evaluation.totalScore}
                          </span>
                        )}
                        <Badge tone={submissionStatusMeta[s.status].tone}>
                          {submissionStatusMeta[s.status].label}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
