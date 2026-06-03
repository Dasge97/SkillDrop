import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChallengeDTO, CourseDTO, LessonDTO, PhaseDTO } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { Icon } from '@/components/icons';
import {
  Badge, Button, Card, cx, Field, Input, PageLoader, Textarea,
} from '@/components/ui';

// ---- helpers array <-> textarea ----
const toLines = (a: string[]) => a.join('\n');
const fromLines = (s: string) => s.split('\n').map((t) => t.trim()).filter(Boolean);

function ArrayField({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <Field label={label} hint={hint ?? 'Un elemento por línea.'}>
      <Textarea value={toLines(value)} onChange={(e) => onChange(fromLines(e.target.value))} />
    </Field>
  );
}

function useInvalidate(courseId?: string) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['admin-courses-list'] });
    if (courseId) qc.invalidateQueries({ queryKey: ['admin-course', courseId] });
    qc.invalidateQueries({ queryKey: ['admin-overview'] });
  };
}

/* ============================================================
   CourseForm
   ============================================================ */
function CourseForm({ course, onSaved, onDeleted }: {
  course: CourseDTO | null;
  onSaved: (id: string) => void;
  onDeleted: () => void;
}) {
  const invalidate = useInvalidate(course?.id);
  const [form, setForm] = useState({
    slug:        course?.slug        ?? '',
    title:       course?.title       ?? '',
    subtitle:    course?.subtitle    ?? '',
    description: course?.description ?? '',
    promise:     course?.promise     ?? '',
    level:       course?.level       ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () =>
      course
        ? api.patch<{ id: string }>(`/admin/courses/${course.id}`, form)
        : api.post<{ id: string }>('/admin/courses', form),
    onSuccess: (c) => { invalidate(); onSaved(c.id); },
    onError: (e) => setError(e instanceof ApiError ? e.message : 'Error al guardar'),
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/courses/${course!.id}`),
    onSuccess: () => { invalidate(); onDeleted(); },
  });

  return (
    <Card className="p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <Icon name="grid" className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        {course ? 'Editar curso' : 'Nuevo curso'}
      </h3>
      <Field label="Slug" hint="minúsculas-con-guiones">
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      </Field>
      <Field label="Título">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Subtítulo">
        <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </Field>
      <Field label="Descripción">
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="Promesa">
        <Input value={form.promise} onChange={(e) => setForm({ ...form, promise: e.target.value })} />
      </Field>
      <Field label="Nivel">
        <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
      </Field>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex justify-between pt-1">
        {course && (
          <Button
            variant="danger" size="sm" loading={del.isPending}
            onClick={() => { if (confirm('¿Borrar el curso y todo su contenido?')) del.mutate(); }}
          >
            Borrar curso
          </Button>
        )}
        <Button
          size="sm" className="ml-auto" loading={save.isPending}
          onClick={() => { setError(null); save.mutate(); }}
          icon="check"
        >
          Guardar
        </Button>
      </div>
    </Card>
  );
}

/* ============================================================
   PhaseForm
   ============================================================ */
function PhaseForm({ courseId, phase, onSaved, onDeleted }: {
  courseId: string; phase: PhaseDTO | null; onSaved: () => void; onDeleted: () => void;
}) {
  const invalidate = useInvalidate(courseId);
  const [form, setForm] = useState({
    code:           phase?.code           ?? '',
    title:          phase?.title          ?? '',
    objective:      phase?.objective      ?? '',
    requiredScore:  phase?.requiredScore  ?? 8,
    unlockedSkills: phase?.unlockedSkills ?? [] as string[],
  });
  const save = useMutation({
    mutationFn: () =>
      phase
        ? api.patch(`/admin/phases/${phase.id}`, form)
        : api.post('/admin/phases', { courseId, ...form }),
    onSuccess: () => { invalidate(); onSaved(); },
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/phases/${phase!.id}`),
    onSuccess: () => { invalidate(); onDeleted(); },
  });

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Badge tone="primary">{phase ? 'Editar fase' : 'Nueva fase'}</Badge>
      </div>
      <Field label="Código" hint="p.ej. FASE 0">
        <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
      </Field>
      <Field label="Título">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Objetivo">
        <Textarea rows={2} value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
      </Field>
      <Field label="Nota mínima para avanzar">
        <Input
          type="number" min={1} max={10}
          value={form.requiredScore}
          onChange={(e) => setForm({ ...form, requiredScore: Number(e.target.value) })}
        />
      </Field>
      <ArrayField
        label="Habilidades que desbloquea (slugs)"
        value={form.unlockedSkills}
        onChange={(v) => setForm({ ...form, unlockedSkills: v })}
      />
      <div className="flex justify-between pt-1">
        {phase && (
          <Button
            variant="danger" size="sm" loading={del.isPending}
            onClick={() => { if (confirm('¿Borrar la fase y sus lecciones?')) del.mutate(); }}
          >
            Borrar fase
          </Button>
        )}
        <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()} icon="check">
          Guardar fase
        </Button>
      </div>
    </Card>
  );
}

/* ============================================================
   LessonForm
   ============================================================ */
function LessonForm({ phaseId, lesson, onSaved, onDeleted }: {
  phaseId: string; lesson: LessonDTO | null; onSaved: () => void; onDeleted: () => void;
}) {
  const [form, setForm] = useState({
    title:                lesson?.title                ?? '',
    objective:            lesson?.objective            ?? '',
    theory:               lesson?.theory               ?? '',
    example:              lesson?.example              ?? '',
    concepts:             lesson?.concepts             ?? [] as string[],
    tools:                lesson?.tools                ?? [] as string[],
    estimatedTimeMinutes: lesson?.estimatedTimeMinutes ?? 30,
  });
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: ['admin-course'] });
  const save = useMutation({
    mutationFn: () =>
      lesson
        ? api.patch(`/admin/lessons/${lesson.id}`, form)
        : api.post('/admin/lessons', { phaseId, ...form }),
    onSuccess: () => { done(); onSaved(); },
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/lessons/${lesson!.id}`),
    onSuccess: () => { done(); onDeleted(); },
  });

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Badge tone="default">{lesson ? 'Editar lección' : 'Nueva lección'}</Badge>
      </div>
      <Field label="Título">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Objetivo">
        <Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
      </Field>
      <Field label="Teoría" hint="Separa párrafos con una línea en blanco.">
        <Textarea className="min-h-[140px]" value={form.theory} onChange={(e) => setForm({ ...form, theory: e.target.value })} />
      </Field>
      <Field label="Ejemplo">
        <Input value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} />
      </Field>
      <ArrayField label="Conceptos clave"  value={form.concepts} onChange={(v) => setForm({ ...form, concepts: v })} />
      <ArrayField label="Herramientas"     value={form.tools}    onChange={(v) => setForm({ ...form, tools: v })} />
      <Field label="Tiempo estimado (min)">
        <Input
          type="number"
          value={form.estimatedTimeMinutes}
          onChange={(e) => setForm({ ...form, estimatedTimeMinutes: Number(e.target.value) })}
        />
      </Field>
      <div className="flex justify-between pt-1">
        {lesson && (
          <Button
            variant="danger" size="sm" loading={del.isPending}
            onClick={() => { if (confirm('¿Borrar la lección y su reto?')) del.mutate(); }}
          >
            Borrar lección
          </Button>
        )}
        <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()} icon="check">
          Guardar lección
        </Button>
      </div>
    </Card>
  );
}

/* ============================================================
   ChallengeForm (reto + rúbrica)
   ============================================================ */
type Crit = { name: string; description: string; weight: number; isCritical: boolean };

function ChallengeForm({ lessonId, challenge }: { lessonId: string; challenge: ChallengeDTO | null }) {
  const [form, setForm] = useState({
    title:            challenge?.title            ?? '',
    brief:            challenge?.brief            ?? '',
    context:          challenge?.context          ?? '',
    objective:        challenge?.objective        ?? '',
    targetUser:       challenge?.targetUser       ?? '',
    restrictions:     challenge?.restrictions     ?? [] as string[],
    deliverables:     challenge?.deliverables     ?? [] as string[],
    checklist:        challenge?.checklist        ?? [] as string[],
    commonMistakes:   challenge?.commonMistakes   ?? [] as string[],
    difficulty:       challenge?.difficulty       ?? 1,
    timeLimitMinutes: challenge?.timeLimitMinutes ?? 45,
    skills:           challenge?.skills           ?? [] as string[],
  });
  const [rubric, setRubric] = useState<Crit[]>(
    challenge?.rubric?.criteria.map((c) => ({
      name: c.name, description: c.description, weight: c.weight, isCritical: c.isCritical,
    })) ?? [],
  );
  const [msg, setMsg] = useState<string | null>(null);
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: () => {
      const body = { ...form, rubric };
      return challenge
        ? api.patch(`/admin/challenges/${challenge.id}`, body)
        : api.post('/admin/challenges', { lessonId, ...body });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-course'] });
      setMsg('Guardado ✓');
      setTimeout(() => setMsg(null), 1500);
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Error'),
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/challenges/${challenge!.id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-course'] }),
  });

  return (
    <Card className="p-5 border-brand-200 dark:border-brand-700/40 space-y-4">
      <div className="flex items-center gap-2">
        <Badge tone="primary" icon="target">Reto + rúbrica</Badge>
      </div>

      <Field label="Título del reto">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Brief">
        <Textarea value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contexto">
          <Textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} />
        </Field>
        <Field label="Objetivo">
          <Textarea value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
        </Field>
      </div>
      <Field label="Usuario objetivo">
        <Input value={form.targetUser} onChange={(e) => setForm({ ...form, targetUser: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <ArrayField label="Restricciones"   value={form.restrictions}   onChange={(v) => setForm({ ...form, restrictions: v })} />
        <ArrayField label="Entregables"     value={form.deliverables}   onChange={(v) => setForm({ ...form, deliverables: v })} />
        <ArrayField label="Checklist"       value={form.checklist}      onChange={(v) => setForm({ ...form, checklist: v })} />
        <ArrayField label="Errores comunes" value={form.commonMistakes} onChange={(v) => setForm({ ...form, commonMistakes: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Dificultad (1–5)">
          <Input type="number" min={1} max={5} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })} />
        </Field>
        <Field label="Tiempo (min)">
          <Input type="number" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} />
        </Field>
      </div>
      <ArrayField label="Skills evaluadas (slugs)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />

      {/* Rúbrica */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Criterios de la rúbrica</span>
          <button
            onClick={() => setRubric([...rubric, { name: '', description: '', weight: 1, isCritical: false }])}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            <Icon name="plus" className="w-4 h-4" />Añadir criterio
          </button>
        </div>
        <div className="space-y-2">
          {rubric.map((c, i) => (
            <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  className="!py-2 !text-sm"
                  value={c.name}
                  placeholder="Nombre del criterio"
                  onChange={(e) => setRubric(rubric.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                />
                <button
                  onClick={() => setRubric(rubric.map((x, j) => j === i ? { ...x, isCritical: !x.isCritical } : x))}
                  className={cx(
                    'shrink-0 px-3 rounded-lg text-xs font-medium border transition-colors',
                    c.isCritical
                      ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400',
                  )}
                >
                  crítico
                </button>
                <Button
                  variant="ghost"
                  className="!px-2.5"
                  onClick={() => setRubric(rubric.filter((_, j) => j !== i))}
                >
                  <Icon name="x" className="w-4 h-4" />
                </Button>
              </div>
              <Input
                className="!py-2 !text-sm"
                value={c.description}
                placeholder="Descripción de qué se evalúa"
                onChange={(e) => setRubric(rubric.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
              />
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <p className={cx('text-sm', msg.includes('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
          {msg}
        </p>
      )}

      <div className="flex justify-between pt-1">
        {challenge && (
          <Button
            variant="danger" size="sm" loading={del.isPending}
            onClick={() => { if (confirm('¿Borrar el reto?')) del.mutate(); }}
          >
            Borrar reto
          </Button>
        )}
        <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()} icon="check">
          Guardar reto
        </Button>
      </div>
    </Card>
  );
}

/* ============================================================
   AdminCourses — componente principal
   ============================================================ */
export function AdminCourses() {
  const [courseId,       setCourseId]       = useState<string | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [phaseId,        setPhaseId]        = useState<string | null>(null);
  const [creatingPhase,  setCreatingPhase]  = useState(false);
  const [lessonId,       setLessonId]       = useState<string | null>(null);
  const [creatingLesson, setCreatingLesson] = useState(false);

  const { data: list, isLoading } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: () => api.get<Array<{ id: string; title: string }>>('/courses'),
  });
  const { data: tree } = useQuery({
    queryKey: ['admin-course', courseId],
    queryFn: () => api.get<CourseDTO>(`/courses/${courseId}`),
    enabled: !!courseId,
  });

  const phase  = tree?.phases.find((p) => p.id === phaseId)              ?? null;
  const lesson = phase?.lessons.find((l) => l.id === lessonId)           ?? null;

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      {/* Selector de curso */}
      <div className="flex flex-wrap items-center gap-2">
        {(list ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => { setCourseId(c.id); setCreatingCourse(false); setPhaseId(null); setLessonId(null); }}
            className={cx(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              courseId === c.id
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
            )}
          >
            {c.title}
          </button>
        ))}
        <Button
          size="sm" variant="outline" icon="plus"
          onClick={() => { setCreatingCourse(true); setCourseId(null); setPhaseId(null); setLessonId(null); }}
        >
          Nuevo curso
        </Button>
      </div>

      {creatingCourse && (
        <CourseForm
          course={null}
          onSaved={(id) => { setCreatingCourse(false); setCourseId(id); }}
          onDeleted={() => setCreatingCourse(false)}
        />
      )}

      {tree && (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Columna: Fases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Icon name="layers" className="w-4 h-4 text-brand-600 dark:text-brand-400" />Fases
              </h3>
              <Button
                size="sm" variant="outline" icon="plus"
                onClick={() => { setCreatingPhase(true); setPhaseId(null); setLessonId(null); }}
              >
                Fase
              </Button>
            </div>
            {tree.phases.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPhaseId(p.id); setCreatingPhase(false); setLessonId(null); }}
                className={cx(
                  'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  phaseId === p.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs text-slate-400 shrink-0">{p.code}</span>
                  <span className="truncate">{p.title}</span>
                </span>
                <Badge tone="default">{p.lessons.length}</Badge>
              </button>
            ))}
          </div>

          {/* Columna: Lecciones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Icon name="book" className="w-4 h-4 text-brand-600 dark:text-brand-400" />Lecciones
              </h3>
              {phase && (
                <Button
                  size="sm" variant="outline" icon="plus"
                  onClick={() => { setCreatingLesson(true); setLessonId(null); }}
                >
                  Lección
                </Button>
              )}
            </div>
            {phase?.lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLessonId(l.id); setCreatingLesson(false); }}
                className={cx(
                  'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  lessonId === l.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                )}
              >
                <span className="truncate">{l.title}</span>
                {l.challenge && <Badge tone="primary">reto</Badge>}
              </button>
            ))}
            {!phase && (
              <p className="text-sm text-slate-400 dark:text-slate-500 px-1">Selecciona una fase.</p>
            )}
          </div>

          {/* Columna: Curso (editar meta) */}
          <div>
            <CourseForm
              key={tree.id}
              course={tree}
              onSaved={() => {}}
              onDeleted={() => { setCourseId(null); setPhaseId(null); }}
            />
          </div>

          {/* Editores a ancho completo */}
          <div className="space-y-5 lg:col-span-3">
            {creatingPhase && (
              <PhaseForm
                courseId={tree.id} phase={null}
                onSaved={() => setCreatingPhase(false)}
                onDeleted={() => setCreatingPhase(false)}
              />
            )}
            {phase && !creatingPhase && (
              <PhaseForm
                key={phase.id} courseId={tree.id} phase={phase}
                onSaved={() => {}}
                onDeleted={() => setPhaseId(null)}
              />
            )}
            {creatingLesson && phase && (
              <LessonForm
                key="new-lesson" phaseId={phase.id} lesson={null}
                onSaved={() => setCreatingLesson(false)}
                onDeleted={() => setCreatingLesson(false)}
              />
            )}
            {lesson && !creatingLesson && (
              <>
                <LessonForm
                  key={lesson.id} phaseId={phase!.id} lesson={lesson}
                  onSaved={() => {}}
                  onDeleted={() => setLessonId(null)}
                />
                <ChallengeForm key={lesson.id + '-ch'} lessonId={lesson.id} challenge={lesson.challenge} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
