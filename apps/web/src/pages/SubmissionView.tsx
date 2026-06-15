import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { EvaluationDTO, SubmissionDTO } from '@skilldrop/shared';
import { ESTIMATED_LEVEL_LABEL } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/Layout';
import {
  Badge,
  Button,
  Card,
  cx,
  EvalStatusBadge,
  gradeText,
  gradeTone,
  PageLoader,
  ProgressBar,
  SectionTitle,
  SubmissionStatusBadge,
} from '@/components/ui';

/* -------------------------------------------------------------------------- */
/*  CriterionRow                                                               */
/* -------------------------------------------------------------------------- */
function CriterionRow({ cr }: { cr: EvaluationDTO['criteriaScores'][number] }) {
  return (
    <div className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
            {cr.criterionName}
          </p>
          {cr.isCritical && (
            <Badge tone="danger" className="!text-[10px] !px-1.5 shrink-0">
              crítico
            </Badge>
          )}
        </div>
        <span className={cx('text-sm font-bold tabular-nums shrink-0', gradeText(cr.score))}>
          {cr.score}
          <span className="text-slate-400 font-medium">/10</span>
        </span>
      </div>
      <ProgressBar value={cr.score * 10} height="h-1.5" tone={gradeTone(cr.score)} className="mb-1.5" />
      {cr.comment && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cr.comment}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SubmissionView                                                             */
/* -------------------------------------------------------------------------- */
export function SubmissionView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: s, isLoading } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => api.get<SubmissionDTO>(`/submissions/${id}`),
    enabled: !!id,
  });
  const { data: cfg } = useQuery({
    queryKey: ['config'],
    queryFn: () => api.get<{ aiEvaluation: boolean }>('/config'),
  });

  const aiEval = useMutation({
    mutationFn: () => api.post(`/submissions/${id}/ai-evaluation`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submission', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading || !s) return <PageLoader />;

  const ev = s.evaluation;
  const isOwner = user?.id === s.userId;
  const canAi = cfg?.aiEvaluation && isOwner;

  /* ---- Estado "en revisión" (sin evaluación) ---- */
  if (!ev) {
    return (
      <div>
        <PageHeader
          back={{ to: `/challenge/${s.challengeId}`, label: 'Volver al reto' }}
          eyebrow={`Entrega v${s.version}`}
          title="En revisión"
          actions={<SubmissionStatusBadge status={s.status} />}
        />
        <Card className="p-10 flex flex-col items-center text-center max-w-xl mx-auto">
          <img
            src="/mascot/idea.png"
            alt="En revisión"
            className="w-40 h-40 object-contain mb-6"
          />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-4">
            Tu entrega está esperando evaluación
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            {canAi
              ? 'Pide una evaluación instantánea a la IA con rúbrica y feedback, o espera a tu mentor.'
              : 'Recibirás tu evaluación con rúbrica de tu mentor. Te avisaremos en cuanto esté lista.'}
          </p>
          {canAi && (
            <Button
              className="mt-6"
              icon="sparkles"
              loading={aiEval.isPending}
              onClick={() => aiEval.mutate()}
            >
              {aiEval.isPending ? 'Evaluando…' : 'Evaluar con IA'}
            </Button>
          )}
          {aiEval.isError && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3">
              {aiEval.error instanceof ApiError ? aiEval.error.message : 'No se pudo evaluar con IA.'}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Ir al dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate(`/challenge/${s.challengeId}`)}>
              Volver al reto
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const aprobado = ev.status === 'APROBADO';
  const mascotSrc = aprobado ? '/mascot/success.png' : '/mascot/working.png';

  return (
    <div>
      <PageHeader
        back={{ to: `/challenge/${s.challengeId}`, label: 'Volver al reto' }}
        eyebrow={`Entrega v${s.version}`}
        title={s.challengeTitle ?? 'Entrega'}
        actions={<EvalStatusBadge status={ev.status} />}
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ---- Columna principal ---- */}
        <div className="space-y-6">

          {/* Detalle de la entrega */}
          <Card className="p-6">
            <SectionTitle icon="inbox" title="Tu entrega" />

            {s.figmaUrl ? (
              <a
                href={s.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline break-all"
              >
                <Icon name="link" className="w-4 h-4 shrink-0" />
                {s.figmaUrl}
              </a>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Sin enlace de entrega.</p>
            )}

            {s.liveUrl && (
              <a
                href={s.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline break-all"
              >
                <Icon name="bolt" className="w-4 h-4 shrink-0" />
                {s.liveUrl}
              </a>
            )}

            {s.code && (
              <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 text-xs text-slate-100 font-mono">
                <code>{s.code}</code>
              </pre>
            )}

            {s.screenshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {s.screenshots.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={url}
                      alt={`Captura ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}

            {s.notes && (
              <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Tus notas
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{s.notes}</p>
              </div>
            )}
          </Card>

          {/* Rúbrica */}
          <Card className="p-6">
            <SectionTitle
              icon="review"
              title="Rúbrica del mentor"
              action={
                <span className="text-xs text-slate-400">
                  por {ev.mentorName}
                </span>
              }
            />
            <div>
              {ev.criteriaScores.map((cr) => (
                <CriterionRow key={cr.id} cr={cr} />
              ))}
            </div>
          </Card>

          {/* Mejoras */}
          <div className="grid sm:grid-cols-2 gap-4">
            {ev.requiredImprovements.length > 0 && (
              <Card className="p-5">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  <Icon name="alert" className="w-5 h-5 text-amber-500" />
                  Mejoras obligatorias
                </h3>
                <ul className="space-y-2">
                  {ev.requiredImprovements.map((m, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {ev.optionalImprovements.length > 0 && (
              <Card className="p-5">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  <Icon name="sparkles" className="w-5 h-5 text-brand-500" />
                  Mejoras opcionales
                </h3>
                <ul className="space-y-2">
                  {ev.optionalImprovements.map((m, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>

        {/* ---- Sidebar evaluación ---- */}
        <div className="space-y-5 lg:sticky lg:top-8">

          {/* Nota total + feedback */}
          <Card className="p-6 text-center">
            <img
              src={mascotSrc}
              alt={aprobado ? 'Aprobado' : 'Trabajando'}
              className="w-28 h-28 object-contain mx-auto mb-4"
            />
            <div className={cx('text-6xl font-extrabold tracking-tight tabular-nums', gradeText(ev.totalScore))}>
              {ev.totalScore.toFixed(1)}
            </div>
            <p className="text-sm text-slate-400 mb-3">nota total / 10</p>
            <EvalStatusBadge status={ev.status} />
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed text-left">
              {ev.mentorFeedback}
            </p>
          </Card>

          {/* Nivel estimado */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Nivel estimado
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              {ESTIMATED_LEVEL_LABEL[ev.estimatedLevel]}
            </p>
            <div className="flex items-center gap-1">
              {(Object.keys(ESTIMATED_LEVEL_LABEL) as Array<keyof typeof ESTIMATED_LEVEL_LABEL>).map(
                (lvl, i, arr) => (
                  <div key={lvl} className="flex-1 relative" title={ESTIMATED_LEVEL_LABEL[lvl]}>
                    <div
                      className={cx(
                        'h-1.5 rounded-full',
                        i <= arr.indexOf(ev.estimatedLevel as keyof typeof ESTIMATED_LEVEL_LABEL)
                          ? 'bg-brand-500'
                          : 'bg-slate-200 dark:bg-slate-700',
                      )}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>Principiante</span>
              <span>Profesional</span>
            </div>
          </Card>

          {/* CTA reintentar / continuar */}
          {!aprobado && (
            <Card className="p-5 border-brand-200 dark:border-brand-500/40 bg-brand-50/40 dark:bg-brand-500/5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Aplica las mejoras obligatorias y vuelve a entregar. Estás cerca del dominio.
              </p>
              <Button
                className="w-full"
                icon="upload"
                onClick={() => navigate(`/challenge/${s.challengeId}/submit`)}
              >
                Reintentar el reto
              </Button>
            </Card>
          )}

          {aprobado && (
            <Card className="p-5 border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-500/5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                ¡Dominio demostrado! Has desbloqueado la siguiente lección.
              </p>
              <Link to="/dashboard">
                <Button className="w-full" iconRight="arrowRight">
                  Continuar
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
