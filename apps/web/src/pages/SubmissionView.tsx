import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { SubmissionDTO } from '@skilldrop/shared';
import { ESTIMATED_LEVEL_LABEL } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, ProgressBar, Spinner } from '@/components/ui';
import { evaluationStatusMeta, submissionStatusMeta } from '@/lib/status';
import { cn, scoreColor } from '@/lib/utils';

export function SubmissionView() {
  const { id } = useParams<{ id: string }>();
  const { data: s, isLoading } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => api.get<SubmissionDTO>(`/submissions/${id}`),
    enabled: !!id,
  });

  if (isLoading || !s) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const ev = s.evaluation;
  const meta = submissionStatusMeta[s.status];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/challenge/${s.challengeId}`} className="text-sm text-muted-foreground hover:text-foreground">← Volver al reto</Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{s.challengeTitle ?? 'Entrega'}</h1>
          <p className="text-sm text-muted-foreground">Versión {s.version}</p>
        </div>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      {/* Datos de la entrega */}
      <Card>
        <CardHeader><CardTitle className="text-base">Tu entrega</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {s.figmaUrl ? (
            <a href={s.figmaUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
              🔗 Abrir archivo de Figma
            </a>
          ) : <p className="text-muted-foreground">Sin enlace de Figma.</p>}
          {s.screenshots.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {s.screenshots.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border">
                  <img src={url} alt={`Captura ${i + 1}`} className="h-28 w-full object-cover" />
                </a>
              ))}
            </div>
          )}
          {s.notes && <p className="text-muted-foreground"><span className="font-semibold text-foreground">Notas: </span>{s.notes}</p>}
        </CardContent>
      </Card>

      {/* Evaluación */}
      {ev ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mascot variant={evaluationStatusMeta[ev.status].mascot} className="h-14 w-14" />
              <div>
                <CardTitle>Evaluación del mentor</CardTitle>
                <p className="text-sm text-muted-foreground">por {ev.mentorName}</p>
              </div>
              <div className="ml-auto text-right">
                <p className={cn('text-3xl font-extrabold', scoreColor(ev.totalScore))}>{ev.totalScore}</p>
                <Badge tone={evaluationStatusMeta[ev.status].tone}>{evaluationStatusMeta[ev.status].label}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="rounded-lg bg-muted p-3 text-sm">{ev.mentorFeedback}</p>

            {/* Criterios */}
            <div className="space-y-3">
              {ev.criteriaScores.map((c) => (
                <div key={c.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      {c.criterionName}
                      {c.isCritical && <Badge tone="danger">crítico</Badge>}
                    </span>
                    <span className={cn('font-semibold', scoreColor(c.score))}>{c.score}/10</span>
                  </div>
                  <ProgressBar value={c.score * 10} />
                  {c.comment && <p className="mt-1 text-xs text-muted-foreground">{c.comment}</p>}
                </div>
              ))}
            </div>

            {ev.requiredImprovements.length > 0 && (
              <div>
                <h3 className="mb-1 text-sm font-semibold text-danger">Mejoras obligatorias</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {ev.requiredImprovements.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
            {ev.optionalImprovements.length > 0 && (
              <div>
                <h3 className="mb-1 text-sm font-semibold">Mejoras opcionales</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {ev.optionalImprovements.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Nivel estimado: <span className="font-semibold text-foreground">{ESTIMATED_LEVEL_LABEL[ev.estimatedLevel]}</span>
            </p>

            {ev.status !== 'APROBADO' && (
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Mascot variant="working" className="h-10 w-10" />
                <p className="flex-1 text-sm">Aplica las mejoras y vuelve a entregar una nueva versión.</p>
                <Link to={`/challenge/${s.challengeId}/submit`}><Button size="sm">Reintentar</Button></Link>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Mascot variant="idea" className="h-20 w-20" />
            <h3 className="font-semibold">En revisión</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Tu entrega está en la cola del mentor. Recibirás una evaluación con rúbrica y feedback.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
