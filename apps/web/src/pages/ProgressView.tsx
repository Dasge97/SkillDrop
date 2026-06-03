import { useQuery } from '@tanstack/react-query';
import type { SkillProgressDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/icons';
import {
  Badge,
  Card,
  LevelDots,
  PageLoader,
  SectionTitle,
  cx,
  gradeText,
} from '@/components/ui';
import { PageHeader } from '@/components/Layout';

/* ----------------------------- Stat card local ---------------------------- */
type Tone = 'brand' | 'amber' | 'violet';
const TONE_CLS: Record<Tone, string> = {
  brand: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
  violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15',
};

function StatCard({
  icon,
  label,
  value,
  suffix,
  tone = 'brand',
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  suffix?: string;
  tone?: Tone;
}) {
  return (
    <Card className="p-5">
      <div className={cx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', TONE_CLS[tone])}>
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
        {suffix && (
          <span className="text-base font-medium text-slate-400 ml-0.5">{suffix}</span>
        )}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </Card>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export function ProgressView() {
  const { user } = useAuth();
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get<SkillProgressDTO[]>('/me/skills'),
  });

  if (isLoading || !skills) return <PageLoader />;

  const unlocked = skills.filter((s) => s.level >= 1).length;
  const medals = skills.filter((s) => s.level >= 4);
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center gap-4 mb-7">
        <img
          src="/mascot/medal.png"
          alt=""
          className="w-20 h-20 object-contain hidden sm:block"
        />
        <PageHeader
          eyebrow="SkillDrop"
          title="Tu progreso"
          subtitle="Tu dominio crece reto a reto. Aquí ves todo lo que has demostrado."
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard
          icon="bolt"
          label="XP total"
          value={(user?.totalXp ?? 0).toLocaleString('es')}
          tone="violet"
        />
        <StatCard
          icon="layers"
          label="Habilidades activas"
          value={unlocked}
          suffix={`/${skills.length}`}
          tone="brand"
        />
        <StatCard
          icon="flame"
          label="Racha"
          value={user?.streakDays ?? 0}
          suffix=" días"
          tone="amber"
        />
      </div>

      {/* Medallas */}
      <Card className="p-6 mb-7">
        <SectionTitle
          icon="trophy"
          title="Medallas"
          action={
            <span className="text-sm text-slate-400">
              {medals.length} de {skills.length}
            </span>
          }
        />
        {medals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {medals.map((m) => (
              <div
                key={m.skillId}
                className="flex flex-col items-center text-center rounded-xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10 p-4 transition"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2 bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                  <Icon name="award" className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">
                  {m.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aún no tienes medallas. Lleva una habilidad al nivel 4 para conseguir la primera.
          </p>
        )}
      </Card>

      {/* Árbol de habilidades */}
      <SectionTitle icon="layers" title="Árbol de habilidades" />
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              {cat}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <Card
                    key={s.skillId}
                    className={cx('p-4 transition', s.level === 0 && 'opacity-55')}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                      <span
                        className={cx(
                          'text-sm font-bold tabular-nums',
                          gradeText(s.averageScore),
                        )}
                      >
                        {s.averageScore != null ? s.averageScore.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LevelDots value={s.level} max={5} />
                        <span className="text-xs text-slate-400">nivel {s.level}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {s.completedExercises}{' '}
                        {s.completedExercises === 1 ? 'reto' : 'retos'}
                      </span>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
