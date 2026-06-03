import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ChallengeDTO, SubmissionDTO } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Field, Input, Textarea } from '@/components/ui';

export function SubmitView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => api.get<{ challenge: ChallengeDTO; submissions: SubmissionDTO[] }>(`/challenges/${id}`),
    enabled: !!id,
  });

  const [figmaUrl, setFigmaUrl] = useState('');
  const [shots, setShots] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      api.post<SubmissionDTO>('/submissions', {
        challengeId: id,
        figmaUrl: figmaUrl.trim() || undefined,
        screenshots: shots.map((s) => s.trim()).filter(Boolean),
        notes,
        submit: true,
      }),
    onSuccess: (sub) => {
      qc.invalidateQueries({ queryKey: ['challenge', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/submission/${sub.id}`);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo enviar la entrega'),
  });

  const challenge = data?.challenge;
  const nextVersion = (data?.submissions[0]?.version ?? 0) + 1;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!figmaUrl.trim() && shots.every((s) => !s.trim())) {
      setError('Añade al menos un enlace de Figma o una captura.');
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to={`/challenge/${id}`} className="text-sm text-muted-foreground hover:text-foreground">← Volver al reto</Link>

      <div className="flex items-center gap-4">
        <Mascot variant="submit" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Entregar trabajo</h1>
          <p className="text-sm text-muted-foreground">
            {challenge?.title} · versión {nextVersion}
          </p>
        </div>
      </div>

      <Alert tone="primary">
        💡 Primero termina, luego perfecciona. Una entrega imperfecta evaluada vale más que una
        perfecta que nunca envías.
      </Alert>

      <Card>
        <CardHeader><CardTitle>Tu entrega</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Enlace de Figma" hint="Comparte tu archivo con permiso de visualización.">
              <Input
                type="url"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://www.figma.com/file/..."
              />
            </Field>

            <div className="space-y-2">
              <span className="text-sm font-medium">Capturas (URLs)</span>
              {shots.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    type="url"
                    value={s}
                    onChange={(e) => setShots(shots.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder="https://..."
                  />
                  {shots.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShots(shots.filter((_, j) => j !== i))}>
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setShots([...shots, ''])}>
                + Añadir captura
              </Button>
            </div>

            <Field label="Notas" hint="Explica tus decisiones de diseño y la organización.">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="¿Qué decisiones tomaste y por qué?" />
            </Field>

            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex justify-end gap-2">
              <Link to={`/challenge/${id}`}><Button type="button" variant="outline">Cancelar</Button></Link>
              <Button type="submit" loading={mutation.isPending}>Enviar a revisión</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
