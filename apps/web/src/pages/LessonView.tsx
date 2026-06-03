import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { LessonDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/Layout';
import {
  Badge,
  Button,
  Card,
  cx,
  PageLoader,
  SectionTitle,
  Stars,
  Textarea,
} from '@/components/ui';

/* -------------------------------------------------------------------------- */
/*  Notas personales en localStorage                                           */
/* -------------------------------------------------------------------------- */
function Notes({ lessonId }: { lessonId: string }) {
  const key = `skilldrop_notes_${lessonId}`;
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(localStorage.getItem(key) ?? '');
  }, [key]);

  function save() {
    localStorage.setItem(key, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Card className="p-6">
      <SectionTitle
        icon="pencil"
        title="Tus notas"
        action={
          saved ? (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Icon name="check" className="w-4 h-4" />
              Guardado
            </span>
          ) : undefined
        }
      />
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Apunta lo que no quieres olvidar de esta lección…"
      />
      <div className="mt-3 flex justify-end">
        <Button variant="outline" size="sm" icon="check" onClick={save}>
          Guardar notas
        </Button>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Vista principal de la lección                                              */
/* -------------------------------------------------------------------------- */
export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => api.get<LessonDTO>(`/lessons/${id}`),
    enabled: !!id,
  });

  if (isLoading || !lesson) return <PageLoader />;

  const paragraphs = lesson.theory.split('\n\n');

  return (
    <div>
      <PageHeader
        back={{ to: `/phase/${lesson.phaseId}`, label: 'Volver a la fase' }}
        eyebrow={`Lección · Fase ${lesson.phaseId}`}
        title={lesson.title}
        subtitle={lesson.objective}
        actions={
          <div className="flex items-center gap-3">
            {lesson.challenge && (
              <Stars value={lesson.challenge.difficulty} className="w-4 h-4" />
            )}
            <Badge tone="default" icon="clock">{lesson.estimatedTimeMinutes} min</Badge>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Columna principal */}
        <div className="space-y-6">
          {/* Mini teoría */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/mascot/idea.png"
                alt=""
                className="w-14 h-14 object-contain shrink-0"
              />
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Mini teoría</h2>
                <p className="text-xs text-slate-400">
                  Lee, entiende y pasa al reto. La práctica enseña el resto.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            {lesson.example && (
              <div className="mt-5 rounded-lg border-l-4 border-brand-400 bg-brand-50/60 dark:bg-brand-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300 mb-1 flex items-center gap-1.5">
                  <Icon name="sparkles" className="w-3.5 h-3.5" />
                  Ejemplo
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lesson.example}
                </p>
              </div>
            )}
          </Card>

          {/* Notas */}
          <Notes lessonId={lesson.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-8">
          {lesson.concepts.length > 0 && (
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Conceptos clave
              </p>
              <div className="flex flex-wrap gap-2">
                {lesson.concepts.map((c) => (
                  <Badge key={c} tone="default">{c}</Badge>
                ))}
              </div>
            </Card>
          )}

          {lesson.tools.length > 0 && (
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Herramientas de Figma
              </p>
              <div className="flex flex-wrap gap-2">
                {lesson.tools.map((t) => (
                  <Badge key={t} tone="primary" icon="tool">{t}</Badge>
                ))}
              </div>
            </Card>
          )}

          {lesson.challenge && (
            <Card className={cx(
              'p-5 border-brand-200 dark:border-brand-500/40 bg-brand-50/40 dark:bg-brand-500/5',
            )}>
              <img
                src="/mascot/working.png"
                alt=""
                className="w-full aspect-[4/3] object-contain mb-4"
              />
              <Badge tone="primary" icon="target" className="mb-2">Reto práctico</Badge>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {lesson.challenge.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Demuestra que dominas lo aprendido. Aquí es donde de verdad avanzas.
              </p>
              <Link to={`/challenge/${lesson.challenge.id}`} className="block mt-4">
                <Button className="w-full" iconRight="arrowRight">Ver el reto</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
