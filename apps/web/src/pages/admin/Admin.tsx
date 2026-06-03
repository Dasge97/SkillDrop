import { useState } from 'react';
import { Mascot } from '@/components/Mascot';
import { cn } from '@/lib/utils';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminCourses } from './AdminCourses';

type Tab = 'overview' | 'users' | 'courses';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Resumen', icon: '📊' },
  { key: 'users', label: 'Usuarios', icon: '👥' },
  { key: 'courses', label: 'Cursos', icon: '🧩' },
];

export function Admin() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot variant="guide" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Panel de administración</h1>
          <p className="text-sm text-muted-foreground">Métricas, usuarios y edición de cursos.</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              tab === t.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <AdminOverview />}
      {tab === 'users' && <AdminUsers />}
      {tab === 'courses' && <AdminCourses />}
    </div>
  );
}
