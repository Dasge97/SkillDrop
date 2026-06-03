import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ChallengeDTO, EstimatedLevel, SubmissionDTO } from '@skilldrop/shared';
import { ESTIMATED_LEVEL_LABEL } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Alert, Badge, Button, Card, CardContent, CardHeader, CardTitle, Field, Spinner, Textarea } from '@/components/ui';
import { cn, scoreColor } from '@/lib/utils';

const LEVELS: EstimatedLevel[] = [
  'PRINCIPIANTE', 'JUNIOR_BAJO', 'JUNIOR', 'JUNIOR_SOLIDO', 'PROFESIONAL_INICIAL',
];

export function MentorReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: submission } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => api.get<SubmissionDTO>(`/submissions/${id}`),
    enabled: !!id,
  });

  const { data: challengeData } = useQuery({
    queryKey: ['challenge', submission?.challengeId],
    queryFn: () =>
      api.get<{ challenge: ChallengeDTO }>(`/challenges/${submission!.challengeId}`),
    enabled: !!submission?.challengeId,
  });

  const criteria = challengeData?.challenge.rubric?.criteria ?? [];

  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const [required, setRequired] = useState('');
  const [optional, setOptional] = useState('');
  const [level, setLevel] = useState<EstimatedLevel>('JUNIOR');
  const [error, setError] = useState<string | null>(null);

  // Nota media ponderada en vivo.
  const liveAvg = useMemo(() => {
    if (!criteria.length) return null;
    let ws = 0, wt = 0;
    for (const c of criteria) {
      const sc = scores[c.id];
      if (sc != null) { ws += sc * c.weight; wt += c.weight; }
    }
    return wt > 0 ? Math.round((ws / wt) * 10) / 10 : null;
  }, [scores, criteria]);

  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/mentor/submissions/${id}/evaluation`, {
        criteria: criteria.map((c) => ({
          criterionId: c.id,
          score: scores[c.id],
          comment: comments[c.id] ?? '',
        })),
        mentorFeedback: feedback,
        requiredImprovements: required.split('\n').map((s) => s.trim()).filter(Boolean),
        optionalImprovements: optional.split('\n').map((s) => s.trim()).filter(Boolean),
        estimatedLevel: level,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentor-queue'] });
      navigate('/mentor');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo guardar la evaluación'),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (criteria.some((c) => scores[c.id] == null)) {
      setError('Puntúa todos los criterios.');
      return;
    }
    if (!feedback.trim()) {
      setError('El feedback general es obligatorio.');
      return;
    }
    mutation.mutate();
  }

  if (!submission || !challengeData) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  if (submission.evaluation) {
    return (
      <div className="mx-auto max-w-xl">
        <Alert tone="success">Esta entrega ya fue evaluada.</Alert>
        <Link to="/mentor"><Button className="mt-4">← Volver a la cola</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/mentor" className="text-sm text-muted-foreground hover:text-foreground">← Cola de revisión</Link>

      <div className="flex items-center gap-4">
        <Mascot variant="guide" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Evaluar entrega</h1>
          <p className="text-sm text-muted-foreground">
            {submission.challengeTitle} · {submission.studentName} · v{submission.version}
          </p>
        </div>
      </div>

      {/* Entrega del alumno */}
      <Card>
        <CardHeader><CardTitle className="text-base">Entrega del alumno</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {submission.figmaUrl ? (
            <a href={submission.figmaUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">🔗 Abrir Figma</a>
          ) : <p className="text-muted-foreground">Sin enlace de Figma.</p>}
          {submission.screenshots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {submission.screenshots.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="h-24 w-full rounded-lg border border-border object-cover" /></a>
              ))}
            </div>
          )}
          {submission.notes && <p className="text-muted-foreground"><span className="font-semibold text-foreground">Notas: </span>{submission.notes}</p>}
        </CardContent>
      </Card>

      {/* Formulario de rúbrica */}
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Rúbrica</CardTitle>
              {liveAvg != null && (
                <span className={cn('text-lg font-bold', scoreColor(liveAvg))}>media {liveAvg}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {criteria.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.name}</span>
                  {c.isCritical && <Badge tone="danger">crítico</Badge>}
                  <span className={cn('ml-auto text-sm font-semibold', scoreColor(scores[c.id] ?? null))}>
                    {scores[c.id] ?? '–'}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScores({ ...scores, [c.id]: n })}
                      className={cn(
                        'h-8 w-8 rounded-md border text-sm font-medium transition-colors',
                        scores[c.id] === n
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:bg-muted',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <Textarea
                  className="min-h-[40px]"
                  placeholder="Comentario (opcional)"
                  value={comments[c.id] ?? ''}
                  onChange={(e) => setComments({ ...comments, [c.id]: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-5">
            <Field label="Feedback general" hint="Exigente pero no destructivo. Señala lo concreto.">
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Lo que funciona, lo que no, y por qué…" />
            </Field>
            <Field label="Mejoras obligatorias" hint="Una por línea.">
              <Textarea value={required} onChange={(e) => setRequired(e.target.value)} placeholder={'Corrige el espaciado de las cards\nUnifica la tipografía'} />
            </Field>
            <Field label="Mejoras opcionales" hint="Una por línea.">
              <Textarea value={optional} onChange={(e) => setOptional(e.target.value)} placeholder="Prueba una variante con más contraste" />
            </Field>
            <Field label="Nivel estimado">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as EstimatedLevel)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{ESTIMATED_LEVEL_LABEL[l]}</option>)}
              </select>
            </Field>

            {liveAvg != null && (
              <Alert tone={liveAvg >= 8 ? 'success' : liveAvg >= 7 ? 'primary' : liveAvg >= 5 ? 'warning' : 'danger'}>
                El estado se asignará automáticamente según la nota: ≥8 aprobado, 7 aprobado justo, 5–6 requiere mejoras, &lt;5 rehacer (un crítico &lt;7 fuerza rehacer).
              </Alert>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex justify-end gap-2">
              <Link to="/mentor"><Button type="button" variant="outline">Cancelar</Button></Link>
              <Button type="submit" loading={mutation.isPending}>Guardar evaluación</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
