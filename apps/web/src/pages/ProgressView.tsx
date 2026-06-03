import { useQuery } from '@tanstack/react-query';
import type { SkillProgressDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Mascot } from '@/components/Mascot';
import { Badge, Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import { cn, scoreColor } from '@/lib/utils';

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={cn('h-2 w-2 rounded-full', n <= level ? 'bg-primary' : 'bg-muted')}
        />
      ))}
    </div>
  );
}

export function ProgressView() {
  const { user } = useAuth();
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get<SkillProgressDTO[]>('/me/skills'),
  });

  if (isLoading || !skills) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const categories = [...new Set(skills.map((s) => s.category))];
  const unlocked = skills.filter((s) => s.level >= 1).length;
  const medals = skills.filter((s) => s.level >= 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot variant="medal" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tu progreso</h1>
          <p className="text-sm text-muted-foreground">Habilidades desbloqueadas y nivel de diseñador.</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">XP total</p><p className="text-2xl font-bold">{user?.totalXp ?? 0}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Habilidades activas</p><p className="text-2xl font-bold">{unlocked}/{skills.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Racha</p><p className="text-2xl font-bold">{user?.streakDays ?? 0} días</p></CardContent></Card>
      </div>

      {/* Medallas */}
      {medals.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">🏅 Medallas (nivel ≥ 4)</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {medals.map((m) => <Badge key={m.skillId} tone="success">🏅 {m.name}</Badge>)}
          </CardContent>
        </Card>
      )}

      {/* Skill tree por categoría */}
      {categories.map((cat) => (
        <Card key={cat}>
          <CardHeader><CardTitle className="text-base">{cat}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.filter((s) => s.category === cat).map((s) => (
                <div
                  key={s.skillId}
                  className={cn(
                    'flex items-center justify-between rounded-lg border border-border p-3',
                    s.level === 0 && 'opacity-60',
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <LevelDots level={s.level} />
                      <span className="text-xs text-muted-foreground">nivel {s.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-semibold', scoreColor(s.averageScore))}>
                      {s.averageScore ?? '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.completedExercises} retos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
