import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChallengeDTO, CourseDTO, LessonDTO, PhaseDTO } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import {
  Badge, Button, Card, CardContent, CardHeader, CardTitle, Field, Input, Spinner, Textarea,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// ---- helpers array <-> textarea ----
const toLines = (a: string[]) => a.join('\n');
const fromLines = (s: string) => s.split('\n').map((t) => t.trim()).filter(Boolean);

function ArrayField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
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

// ============ Course meta form ============
function CourseForm({ course, onSaved, onDeleted }: { course: CourseDTO | null; onSaved: (id: string) => void; onDeleted: () => void }) {
  const invalidate = useInvalidate(course?.id);
  const [form, setForm] = useState({
    slug: course?.slug ?? '',
    title: course?.title ?? '',
    subtitle: course?.subtitle ?? '',
    description: course?.description ?? '',
    promise: course?.promise ?? '',
    level: course?.level ?? '',
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
    <Card>
      <CardHeader><CardTitle className="text-base">{course ? 'Editar curso' : 'Nuevo curso'}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Field label="Slug" hint="minúsculas-con-guiones"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Subtítulo"><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
        <Field label="Descripción"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <Field label="Promesa"><Input value={form.promise} onChange={(e) => setForm({ ...form, promise: e.target.value })} /></Field>
        <Field label="Nivel"><Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} /></Field>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-between">
          {course && <Button variant="danger" size="sm" loading={del.isPending} onClick={() => confirm('¿Borrar el curso y todo su contenido?') && del.mutate()}>Borrar curso</Button>}
          <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => { setError(null); save.mutate(); }}>Guardar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Phase form ============
function PhaseForm({ courseId, phase, onSaved, onDeleted }: { courseId: string; phase: PhaseDTO | null; onSaved: () => void; onDeleted: () => void }) {
  const invalidate = useInvalidate(courseId);
  const [form, setForm] = useState({
    code: phase?.code ?? '', title: phase?.title ?? '', objective: phase?.objective ?? '',
    requiredScore: phase?.requiredScore ?? 8,
    unlockedSkills: phase?.unlockedSkills ?? [],
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
    <Card>
      <CardHeader><CardTitle className="text-base">{phase ? 'Editar fase' : 'Nueva fase'}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Field label="Código" hint="p.ej. FASE 0"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
        <Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Objetivo"><Textarea value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field>
        <Field label="Nota mínima para avanzar"><Input type="number" min={1} max={10} value={form.requiredScore} onChange={(e) => setForm({ ...form, requiredScore: Number(e.target.value) })} /></Field>
        <ArrayField label="Habilidades que desbloquea (slugs)" value={form.unlockedSkills} onChange={(v) => setForm({ ...form, unlockedSkills: v })} />
        <div className="flex justify-between">
          {phase && <Button variant="danger" size="sm" loading={del.isPending} onClick={() => confirm('¿Borrar la fase y sus lecciones?') && del.mutate()}>Borrar fase</Button>}
          <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()}>Guardar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Lesson form ============
function LessonForm({ phaseId, lesson, onSaved, onDeleted }: { phaseId: string; lesson: LessonDTO | null; onSaved: () => void; onDeleted: () => void }) {
  const [form, setForm] = useState({
    title: lesson?.title ?? '', objective: lesson?.objective ?? '', theory: lesson?.theory ?? '',
    example: lesson?.example ?? '', concepts: lesson?.concepts ?? [], tools: lesson?.tools ?? [],
    estimatedTimeMinutes: lesson?.estimatedTimeMinutes ?? 30,
  });
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: ['admin-course'] });
  const save = useMutation({
    mutationFn: () =>
      lesson ? api.patch(`/admin/lessons/${lesson.id}`, form) : api.post('/admin/lessons', { phaseId, ...form }),
    onSuccess: () => { done(); onSaved(); },
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/lessons/${lesson!.id}`),
    onSuccess: () => { done(); onDeleted(); },
  });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{lesson ? 'Editar lección' : 'Nueva lección'}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Objetivo"><Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field>
        <Field label="Teoría" hint="Separa párrafos con una línea en blanco."><Textarea className="min-h-[140px]" value={form.theory} onChange={(e) => setForm({ ...form, theory: e.target.value })} /></Field>
        <Field label="Ejemplo"><Input value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} /></Field>
        <ArrayField label="Conceptos clave" value={form.concepts} onChange={(v) => setForm({ ...form, concepts: v })} />
        <ArrayField label="Herramientas" value={form.tools} onChange={(v) => setForm({ ...form, tools: v })} />
        <Field label="Tiempo estimado (min)"><Input type="number" value={form.estimatedTimeMinutes} onChange={(e) => setForm({ ...form, estimatedTimeMinutes: Number(e.target.value) })} /></Field>
        <div className="flex justify-between">
          {lesson && <Button variant="danger" size="sm" loading={del.isPending} onClick={() => confirm('¿Borrar la lección y su reto?') && del.mutate()}>Borrar lección</Button>}
          <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()}>Guardar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Challenge + rubric form ============
type Crit = { name: string; description: string; weight: number; isCritical: boolean };
function ChallengeForm({ lessonId, challenge }: { lessonId: string; challenge: ChallengeDTO | null }) {
  const [form, setForm] = useState({
    title: challenge?.title ?? '', brief: challenge?.brief ?? '', context: challenge?.context ?? '',
    objective: challenge?.objective ?? '', targetUser: challenge?.targetUser ?? '',
    restrictions: challenge?.restrictions ?? [], deliverables: challenge?.deliverables ?? [],
    checklist: challenge?.checklist ?? [], commonMistakes: challenge?.commonMistakes ?? [],
    difficulty: challenge?.difficulty ?? 1, timeLimitMinutes: challenge?.timeLimitMinutes ?? 45,
    skills: challenge?.skills ?? [],
  });
  const [rubric, setRubric] = useState<Crit[]>(
    challenge?.rubric?.criteria.map((c) => ({ name: c.name, description: c.description, weight: c.weight, isCritical: c.isCritical })) ?? [],
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-course'] }); setMsg('Guardado ✓'); setTimeout(() => setMsg(null), 1500); },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Error'),
  });
  const del = useMutation({
    mutationFn: () => api.del(`/admin/challenges/${challenge!.id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-course'] }),
  });

  return (
    <Card className="border-primary/40">
      <CardHeader><CardTitle className="text-base">{challenge ? 'Editar reto' : 'Crear reto'}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Brief"><Textarea value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Contexto"><Textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} /></Field>
          <Field label="Objetivo"><Textarea value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field>
        </div>
        <Field label="Usuario objetivo"><Input value={form.targetUser} onChange={(e) => setForm({ ...form, targetUser: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <ArrayField label="Restricciones" value={form.restrictions} onChange={(v) => setForm({ ...form, restrictions: v })} />
          <ArrayField label="Entregables" value={form.deliverables} onChange={(v) => setForm({ ...form, deliverables: v })} />
          <ArrayField label="Checklist" value={form.checklist} onChange={(v) => setForm({ ...form, checklist: v })} />
          <ArrayField label="Errores comunes" value={form.commonMistakes} onChange={(v) => setForm({ ...form, commonMistakes: v })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Dificultad (1-5)"><Input type="number" min={1} max={5} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })} /></Field>
          <Field label="Tiempo (min)"><Input type="number" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} /></Field>
        </div>
        <ArrayField label="Skills evaluadas (slugs)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />

        {/* Rúbrica */}
        <div className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Rúbrica</span>
            <Button size="sm" variant="outline" onClick={() => setRubric([...rubric, { name: '', description: '', weight: 1, isCritical: false }])}>+ Criterio</Button>
          </div>
          {rubric.map((c, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-2">
              <Input className="h-8 flex-1" placeholder="Nombre" value={c.name} onChange={(e) => setRubric(rubric.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <Input className="h-8 flex-[2]" placeholder="Descripción" value={c.description} onChange={(e) => setRubric(rubric.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={c.isCritical} onChange={(e) => setRubric(rubric.map((x, j) => j === i ? { ...x, isCritical: e.target.checked } : x))} />
                crítico
              </label>
              <Button size="sm" variant="ghost" onClick={() => setRubric(rubric.filter((_, j) => j !== i))}>✕</Button>
            </div>
          ))}
        </div>

        {msg && <p className={cn('text-sm', msg.includes('✓') ? 'text-success' : 'text-danger')}>{msg}</p>}
        <div className="flex justify-between">
          {challenge && <Button variant="danger" size="sm" loading={del.isPending} onClick={() => confirm('¿Borrar el reto?') && del.mutate()}>Borrar reto</Button>}
          <Button size="sm" className="ml-auto" loading={save.isPending} onClick={() => save.mutate()}>Guardar reto</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Main ============
export function AdminCourses() {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [creatingPhase, setCreatingPhase] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(null);
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

  const phase = tree?.phases.find((p) => p.id === phaseId) ?? null;
  const lesson = phase?.lessons.find((l) => l.id === lessonId) ?? null;

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;

  return (
    <div className="space-y-4">
      {/* selector de curso */}
      <div className="flex flex-wrap items-center gap-2">
        {(list ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => { setCourseId(c.id); setCreatingCourse(false); setPhaseId(null); setLessonId(null); }}
            className={cn('rounded-full border px-3 py-1.5 text-sm', courseId === c.id ? 'border-primary bg-accent text-accent-foreground' : 'border-border hover:bg-muted')}
          >
            {c.title}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={() => { setCreatingCourse(true); setCourseId(null); setPhaseId(null); setLessonId(null); }}>+ Nuevo curso</Button>
      </div>

      {creatingCourse && <CourseForm course={null} onSaved={(id) => { setCreatingCourse(false); setCourseId(id); }} onDeleted={() => setCreatingCourse(false)} />}

      {tree && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Fases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Fases</h3>
              <Button size="sm" variant="outline" onClick={() => { setCreatingPhase(true); setPhaseId(null); setLessonId(null); }}>+ Fase</Button>
            </div>
            {tree.phases.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPhaseId(p.id); setCreatingPhase(false); setLessonId(null); }}
                className={cn('flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm', phaseId === p.id ? 'border-primary bg-accent' : 'border-border hover:bg-muted')}
              >
                <span><span className="text-xs text-muted-foreground">{p.code}</span> · {p.title}</span>
                <Badge tone="muted">{p.lessons.length}</Badge>
              </button>
            ))}
          </div>

          {/* Lecciones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Lecciones</h3>
              {phase && <Button size="sm" variant="outline" onClick={() => { setCreatingLesson(true); setLessonId(null); }}>+ Lección</Button>}
            </div>
            {phase?.lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLessonId(l.id); setCreatingLesson(false); }}
                className={cn('flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm', lessonId === l.id ? 'border-primary bg-accent' : 'border-border hover:bg-muted')}
              >
                <span>{l.title}</span>
                {l.challenge && <Badge tone="primary">reto</Badge>}
              </button>
            ))}
            {!phase && <p className="text-sm text-muted-foreground">Selecciona una fase.</p>}
          </div>

          {/* Detalle */}
          <div className="lg:col-span-1">
            <CourseForm key={tree.id} course={tree} onSaved={() => {}} onDeleted={() => { setCourseId(null); setPhaseId(null); }} />
          </div>

          {/* Editores a ancho completo */}
          <div className="space-y-4 lg:col-span-3">
            {creatingPhase && <PhaseForm courseId={tree.id} phase={null} onSaved={() => setCreatingPhase(false)} onDeleted={() => setCreatingPhase(false)} />}
            {phase && !creatingPhase && (
              <PhaseForm key={phase.id} courseId={tree.id} phase={phase} onSaved={() => {}} onDeleted={() => setPhaseId(null)} />
            )}
            {creatingLesson && phase && <LessonForm key="new-lesson" phaseId={phase.id} lesson={null} onSaved={() => setCreatingLesson(false)} onDeleted={() => setCreatingLesson(false)} />}
            {lesson && !creatingLesson && (
              <>
                <LessonForm key={lesson.id} phaseId={phase!.id} lesson={lesson} onSaved={() => {}} onDeleted={() => setLessonId(null)} />
                <ChallengeForm key={lesson.id + '-ch'} lessonId={lesson.id} challenge={lesson.challenge} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
