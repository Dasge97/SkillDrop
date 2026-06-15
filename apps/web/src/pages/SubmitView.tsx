import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { ChallengeDTO, SubmissionDTO } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/Layout';
import {
  Button,
  Card,
  cx,
  Field,
  Input,
  Spinner,
  Textarea,
} from '@/components/ui';

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
  const [liveUrl, setLiveUrl] = useState('');
  const [code, setCode] = useState('');
  const [shots, setShots] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      api.post<SubmissionDTO>('/submissions', {
        challengeId: id,
        figmaUrl: figmaUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        code: code.trim() || undefined,
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
    if (!figmaUrl.trim() && !liveUrl.trim() && !code.trim() && shots.every((s) => !s.trim())) {
      setError('Añade al menos un enlace, código o una captura.');
      return;
    }
    mutation.mutate();
  }

  const setShot = (i: number, v: string) =>
    setShots((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  const addShot = () => setShots((prev) => [...prev, '']);
  const removeShot = (i: number) => setShots((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <PageHeader
        back={{ to: `/challenge/${id}`, label: 'Volver al reto' }}
        eyebrow={`Entrega · v${nextVersion}`}
        title="Entrega tu trabajo"
        subtitle={challenge?.title}
      />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <Card className="p-6">
          {/* Alerta motivacional */}
          <div className="rounded-lg border-l-4 border-brand-400 bg-brand-50/60 dark:bg-brand-500/10 p-4 mb-6 flex gap-3">
            <Icon name="sparkles" className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                Primero termina, luego perfecciona.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Entrega aunque no esté perfecto. El mentor te dirá exactamente qué pulir para llegar al dominio.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <Field
              label="Enlace de la entrega"
              hint="Figma, repositorio Git, etc. Asegúrate de que tenga permiso de visualización."
            >
              <div className="relative">
                <Icon name="link" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="url"
                  className="pl-9"
                  placeholder="https://github.com/… o https://figma.com/…"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Web / app desplegada (opcional)" hint="Si tu reto incluye una demo en línea.">
              <div className="relative">
                <Icon name="bolt" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="url"
                  className="pl-9"
                  placeholder="https://mi-app.ejemplo.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Código (opcional)" hint="Pega aquí tu código para que el mentor o la IA lo evalúen.">
              <Textarea
                rows={8}
                className="font-mono text-xs"
                placeholder={'<?php\n// tu código…'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Field>

            <div>
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Capturas (URLs)
              </span>
              <div className="space-y-2">
                {shots.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="relative flex-1">
                      <Icon name="image" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="url"
                        className="pl-9"
                        placeholder={`Captura ${i + 1} — https://…`}
                        value={s}
                        onChange={(e) => setShot(i, e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      className="!px-3"
                      onClick={() => removeShot(i)}
                      disabled={shots.length === 1}
                    >
                      <Icon name="x" className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addShot}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Icon name="plus" className="w-4 h-4" />
                Añadir captura
              </button>
            </div>

            <Field
              label="Notas para el mentor"
              hint="Opcional: cuenta tus decisiones o dónde tienes dudas."
            >
              <Textarea
                rows={4}
                placeholder="Ej: dudé entre dos espaciados internos…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(`/challenge/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" icon="upload" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner className="w-5 h-5 !text-white" /> : 'Enviar a revisión'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Aside */}
        <div className="space-y-5 lg:sticky lg:top-8">
          <Card className="p-5 flex flex-col items-center text-center">
            <img
              src="/mascot/submit.png"
              alt="Mascota entrega"
              className="w-full aspect-[4/3] object-contain mb-4"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tu entrega entra en la cola del mentor. Recibirás una rúbrica del 1 al 10 por criterio.
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Recuerda
            </p>
            <div className={cx('flex gap-2 text-sm text-slate-600 dark:text-slate-300')}>
              <Icon name="info" className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Una entrega imperfecta evaluada vale más que una perfecta que nunca envías.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
