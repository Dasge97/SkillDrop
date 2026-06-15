import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { ChallengeDTO, EstimatedLevel, SubmissionDTO } from '@skilldrop/shared';
import { ESTIMATED_LEVEL_LABEL } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { Icon } from '@/components/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  PageLoader,
  SectionTitle,
  Select,
  Textarea,
  gradeText,
  gradeTone,
  ProgressBar,
  cx,
} from '@/components/ui';
import { PageHeader } from '@/components/Layout';

const LEVELS: EstimatedLevel[] = [
  'PRINCIPIANTE',
  'JUNIOR_BAJO',
  'JUNIOR',
  'JUNIOR_SOLIDO',
  'PROFESIONAL_INICIAL',
];

// ─── ScorePicker ────────────────────────────────────────────────────────────
function ScorePicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        const on = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cx(
              'w-8 h-8 rounded-md text-sm font-semibold tabular-nums transition-colors',
              on
                ? n >= 8
                  ? 'bg-emerald-500 text-white'
                  : n >= 7
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

// ─── MentorReview ────────────────────────────────────────────────────────────
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

  // Media ponderada en vivo
  const liveAvg = useMemo(() => {
    if (!criteria.length) return null;
    let ws = 0,
      wt = 0;
    for (const c of criteria) {
      const sc = scores[c.id];
      if (sc != null) {
        ws += sc * c.weight;
        wt += c.weight;
      }
    }
    return wt > 0 ? Math.round((ws / wt) * 10) / 10 : null;
  }, [scores, criteria]);

  const allScored = criteria.length > 0 && criteria.every((c) => scores[c.id] != null);
  const hasCriticalLow = criteria.some((c) => c.isCritical && (scores[c.id] ?? 0) < 7 && scores[c.id] != null);

  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/mentor/submissions/${id}/evaluation`, {
        criteria: criteria.map((c) => ({
          criterionId: c.id,
          score: scores[c.id],
          comment: comments[c.id] ?? '',
        })),
        mentorFeedback: feedback,
        requiredImprovements: required
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        optionalImprovements: optional
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        estimatedLevel: level,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentor-queue'] });
      navigate('/mentor');
    },
    onError: (err) =>
      setError(
        err instanceof ApiError ? err.message : 'No se pudo guardar la evaluación.',
      ),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (criteria.some((c) => scores[c.id] == null)) {
      setError('Puntúa todos los criterios antes de guardar.');
      return;
    }
    if (!feedback.trim()) {
      setError('El feedback general es obligatorio.');
      return;
    }
    mutation.mutate();
  }

  if (!submission || !challengeData) return <PageLoader />;

  // Entrega ya evaluada
  if (submission.evaluation) {
    return (
      <div>
        <PageHeader
          back={{ to: '/mentor', label: 'Cola de revisión' }}
          title="Entrega ya evaluada"
        />
        <Card className="p-6 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Icon name="checkCircle" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Esta entrega ya fue evaluada.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {submission.challengeTitle} · {submission.studentName} · v{submission.version}
              </p>
            </div>
          </div>
          <Button variant="outline" icon="arrowLeft" onClick={() => navigate('/mentor')}>
            Volver a la cola
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        back={{ to: '/mentor', label: 'Cola de revisión' }}
        eyebrow={`Mentor · v${submission.version}`}
        title={submission.challengeTitle ?? 'Evaluar entrega'}
        actions={
          <div className="flex items-center gap-2">
            <Avatar name={submission.studentName ?? ''} size="sm" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {submission.studentName ?? 'Alumno'}
            </span>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* ── Columna principal: rúbrica + formulario ── */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Rúbrica */}
          <Card className="p-6">
            <SectionTitle
              icon="review"
              title="Rúbrica de evaluación"
              action={
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Media</span>
                  <span className={cx('font-bold tabular-nums', gradeText(liveAvg))}>
                    {liveAvg != null ? liveAvg.toFixed(1) : '—'}
                  </span>
                </div>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {criteria.map((c) => (
                <div key={c.id} className="py-4 first:pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {c.name}
                    </p>
                    {c.isCritical && (
                      <Badge tone="danger" className="!text-[10px] !px-1.5">
                        crítico
                      </Badge>
                    )}
                    {c.isCritical && scores[c.id] != null && scores[c.id] < 7 && (
                      <Badge tone="warning" className="!text-[10px]">
                        crítico bajo
                      </Badge>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                      {c.description}
                    </p>
                  )}
                  <ScorePicker
                    value={scores[c.id] ?? null}
                    onChange={(n) => setScores({ ...scores, [c.id]: n })}
                  />
                  <input
                    type="text"
                    className="mt-2.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2 text-sm transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    value={comments[c.id] ?? ''}
                    onChange={(e) =>
                      setComments({ ...comments, [c.id]: e.target.value })
                    }
                    placeholder="Comentario para este criterio (opcional)"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback y nivel */}
          <Card className="p-6 space-y-5">
            <Field label="Feedback general" hint="Exigente pero constructivo. Señala lo concreto.">
              <Textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Resume el resultado y qué destaca o falta para el dominio…"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Mejoras obligatorias" hint="Una por línea.">
                <Textarea
                  rows={3}
                  value={required}
                  onChange={(e) => setRequired(e.target.value)}
                  placeholder={'Ej: unifica el espaciado a múltiplos de 8\nEj: añade estados hover'}
                />
              </Field>
              <Field label="Mejoras opcionales" hint="Una por línea.">
                <Textarea
                  rows={3}
                  value={optional}
                  onChange={(e) => setOptional(e.target.value)}
                  placeholder="Ej: prueba una versión compacta"
                />
              </Field>
            </div>

            <Field label="Nivel estimado">
              <Select
                value={level}
                onChange={(e) => setLevel(e.target.value as EstimatedLevel)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {ESTIMATED_LEVEL_LABEL[l]}
                  </option>
                ))}
              </Select>
            </Field>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3">
                <Icon name="alert" className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/mentor')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                icon="check"
                loading={mutation.isPending}
                disabled={!allScored}
              >
                Guardar evaluación
              </Button>
            </div>
            {!allScored && (
              <p className="text-xs text-center text-slate-400">
                Puntúa todos los criterios para guardar.
              </p>
            )}
          </Card>
        </form>

        {/* ── Columna lateral: entrega + estado ── */}
        <div className="space-y-5 lg:sticky lg:top-8">
          {/* Entrega del alumno */}
          <Card className="p-5">
            <img
              src="/mascot/guide.png"
              alt="Mentor guía"
              className="w-full aspect-[5/3] object-contain mb-4 select-none"
              draggable={false}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Entrega del alumno
            </p>
            {submission.figmaUrl ? (
              <a
                href={submission.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Icon name="link" className="w-4 h-4" />
                Abrir archivo de Figma
              </a>
            ) : (
              <p className="text-sm text-slate-400">Sin enlace de entrega.</p>
            )}
            {submission.liveUrl && (
              <a
                href={submission.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline break-all"
              >
                <Icon name="bolt" className="w-4 h-4" />
                Ver desplegado
              </a>
            )}
            {submission.code && (
              <pre className="mt-3 max-h-60 overflow-auto rounded-lg bg-slate-900 dark:bg-slate-950 p-3 text-[11px] text-slate-100 font-mono">
                <code>{submission.code}</code>
              </pre>
            )}
            {submission.screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {submission.screenshots.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Captura ${i + 1}`}
                      className="aspect-square w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            )}
            {submission.notes && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Notas: </span>
                {submission.notes}
              </p>
            )}
          </Card>

          {/* Estado resultante */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Estado resultante
            </p>
            <div className="flex items-center justify-between mb-3">
              <span
                className={cx(
                  'text-2xl font-extrabold tabular-nums',
                  gradeText(liveAvg),
                )}
              >
                {liveAvg != null ? liveAvg.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-slate-400">/ 10</span>
            </div>
            {liveAvg != null && (
              <ProgressBar
                value={liveAvg * 10}
                tone={gradeTone(liveAvg)}
                className="mb-3"
              />
            )}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 flex gap-2">
              <Icon
                name="info"
                className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5"
              />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El estado se asigna automáticamente:{' '}
                <strong>Aprobado</strong> si la media ≥ 8 y ningún crítico {'<'} 7; si
                no, <strong>Requiere mejoras</strong>; con media muy baja,{' '}
                <strong>Rehacer</strong>.
              </p>
            </div>
            {hasCriticalLow && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Icon name="alert" className="w-3.5 h-3.5" />
                Hay un criterio crítico por debajo de 7.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
