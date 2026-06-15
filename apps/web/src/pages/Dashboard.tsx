import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import type { DashboardDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/icons';
import {
  Badge, Button, Card, EvalStatusBadge, gradeText, PageLoader, ProgressBar, SectionTitle,
} from '@/components/ui';
import { cx } from '@/components/ui';

const GUIDING_PHRASE = 'No avances por completar lecciones. Avanza porque puedes demostrar dominio.';

type Tone = 'brand' | 'emerald' | 'amber' | 'violet';
function StatCard({ icon, label, value, suffix, tone = 'brand' }: { icon: string; label: string; value: React.ReactNode; suffix?: string; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    brand: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
    violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15',
  };
  return (
    <Card className="p-5">
      <div className={cx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', tones[tone])}><Icon name={icon} className="w-5 h-5" /></div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}{suffix && <span className="text-base font-medium text-slate-400 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </Card>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get<DashboardDTO>('/me/dashboard') });

  if (isLoading || !data) return <PageLoader />;

  const firstName = (user?.name ?? '').split(' ')[0];
  const ev = data.lastEvaluation;
  const goContinue = () => navigate(data.nextChallenge ? `/challenge/${data.nextChallenge.id}` : `/course/${data.course.id}`);

  return (
    <div>
      {/* Banner de bienvenida */}
      <Card className="overflow-hidden mb-7">
        <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 p-6">
          <img src="/mascot/guide.png" alt="" className="w-24 h-24 object-contain hidden sm:block" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">¡Hola de nuevo, {firstName}! 👋</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">{data.course.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">“{GUIDING_PHRASE}”</p>
          </div>
          <Button size="lg" iconRight="arrowRight" onClick={goContinue}>Continuar</Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon="progress" label="Progreso del curso" value={data.progressPercent} suffix="%" tone="brand" />
        <StatCard icon="checkCircle" label="Nota media" value={data.averageScore != null ? data.averageScore.toFixed(1) : '—'} tone="emerald" />
        <StatCard icon="bolt" label="XP total" value={data.totalXp.toLocaleString('es')} tone="violet" />
        <StatCard icon="flame" label="Racha" value={data.streakDays} suffix=" días" tone="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Posición actual */}
        <Card className="p-6">
          <SectionTitle icon="target" title="Tu posición actual" />
          {data.currentPhase ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Badge tone="primary">{data.currentPhase.code}</Badge>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{data.currentPhase.title}</span>
              </div>
              {data.currentLesson && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Lección actual: <span className="font-medium text-slate-700 dark:text-slate-300">{data.currentLesson.title}</span>
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Progreso del curso</span><span className="font-medium">{data.progressPercent}%</span>
              </div>
              <ProgressBar value={data.progressPercent} className="mb-5" />
              {data.nextChallenge ? (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Próximo reto</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{data.nextChallenge.title}</p>
                  <Button size="sm" variant="soft" iconRight="arrowRight" onClick={() => navigate(`/challenge/${data.nextChallenge!.id}`)}>Ir al reto</Button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">¡Estás al día! Revisa el roadmap para lo siguiente.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Empieza por el roadmap para activar tu primera fase.</p>
          )}
        </Card>

        {/* Última evaluación */}
        <Card className="p-6">
          <SectionTitle
            icon="review"
            title="Última evaluación"
            action={ev && <Link to={`/submission/${ev.submissionId}`} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">Ver detalle</Link>}
          />
          {ev ? (
            <>
              <div className="flex items-center gap-5">
                <div className="text-center shrink-0">
                  <div className={cx('text-5xl font-extrabold tracking-tight tabular-nums', gradeText(ev.totalScore))}>{ev.totalScore.toFixed(1)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">/ 10</div>
                </div>
                <div className="min-w-0">
                  <EvalStatusBadge status={ev.status} />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{ev.mentorFeedback}</p>
                </div>
              </div>
              {ev.status !== 'APROBADO' && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img src="/mascot/working.png" alt="" className="w-16 h-16 object-contain shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">Aplica las mejoras obligatorias y reintenta. Estás cerca del dominio.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <img src="/mascot/idea.png" alt="" className="w-16 h-16 object-contain shrink-0" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Aún no tienes evaluaciones. ¡Entrega tu primer reto!</p>
            </div>
          )}
        </Card>

        {/* Puntos fuertes */}
        <Card className="p-6">
          <SectionTitle icon="sparkles" title="Tus puntos fuertes" />
          {data.strengths.length ? (
            <div className="flex flex-wrap gap-2">{data.strengths.map((t) => <Badge key={t} tone="success" icon="check">{t}</Badge>)}</div>
          ) : <p className="text-sm text-slate-500 dark:text-slate-400">Se revelarán con tus primeras entregas.</p>}
        </Card>

        {/* A mejorar */}
        <Card className="p-6">
          <SectionTitle icon="flag" title="A mejorar" />
          {data.weaknesses.length ? (
            <div className="flex flex-wrap gap-2">{data.weaknesses.map((t) => <Badge key={t} tone="warning" icon="alert">{t}</Badge>)}</div>
          ) : <p className="text-sm text-slate-500 dark:text-slate-400">Sin debilidades destacadas todavía.</p>}
        </Card>
      </div>
    </div>
  );
}
