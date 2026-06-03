import { useState } from 'react';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/Layout';
import { cx } from '@/components/ui';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminCourses } from './AdminCourses';

type Tab = 'overview' | 'users' | 'courses';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Resumen', icon: 'grid' },
  { key: 'users',    label: 'Usuarios', icon: 'users' },
  { key: 'courses',  label: 'Cursos',   icon: 'layers' },
];

export function Admin() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center gap-5 mb-7">
        <img src="/mascot/guide.png" alt="" className="w-20 h-20 object-contain hidden sm:block" />
        <PageHeader
          eyebrow="Admin"
          title="Panel de administración"
          subtitle="Gestiona usuarios, contenido y evaluaciones de SkillDrop."
        />
      </div>

      {/* Pestañas */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.key
                ? 'border-brand-500 text-brand-700 dark:text-brand-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <AdminOverview />}
      {tab === 'users'    && <AdminUsers />}
      {tab === 'courses'  && <AdminCourses />}
    </div>
  );
}
