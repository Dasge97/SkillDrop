import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { LessonDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Spinner, Textarea } from '@/components/ui';

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
    <Card>
      <CardHeader><CardTitle className="text-base">📝 Tus notas</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Apunta lo que no quieras olvidar de esta lección…"
        />
        <div className="flex items-center justify-end gap-2">
          {saved && <span className="text-xs text-success">Guardado ✓</span>}
          <Button size="sm" variant="outline" onClick={save}>Guardar notas</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => api.get<LessonDTO>(`/lessons/${id}`),
    enabled: !!id,
  });

  if (isLoading || !lesson) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const paragraphs = lesson.theory.split('\n\n');

  return (
    <div className="space-y-6">
      <Link to={`/phase/${lesson.phaseId}`} className="text-sm text-muted-foreground hover:text-foreground">← Volver a la fase</Link>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{lesson.title}</h1>
        <p className="mt-1 text-muted-foreground">{lesson.objective}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Teoría */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mascot variant="idea" className="h-12 w-12" />
                <CardTitle>Mini teoría</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-[15px] leading-relaxed">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              {lesson.example && (
                <div className="mt-2 rounded-lg border-l-4 border-primary bg-accent/40 p-3 text-sm">
                  <span className="font-semibold">Ejemplo: </span>{lesson.example}
                </div>
              )}
            </CardContent>
          </Card>

          <Notes lessonId={lesson.id} />
        </div>

        <div className="space-y-6">
          {lesson.concepts.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Conceptos clave</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {lesson.concepts.map((c) => <Badge key={c}>{c}</Badge>)}
              </CardContent>
            </Card>
          )}
          {lesson.tools.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Herramientas de Figma</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {lesson.tools.map((t) => <Badge key={t} tone="muted">{t}</Badge>)}
              </CardContent>
            </Card>
          )}
          {lesson.challenge && (
            <Card className="border-primary/40 bg-accent/30">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center gap-3">
                  <Mascot variant="working" className="h-12 w-12" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">Reto práctico</p>
                    <p className="font-semibold">{lesson.challenge.title}</p>
                  </div>
                </div>
                <Link to={`/challenge/${lesson.challenge.id}`} className="block">
                  <Button className="w-full">Ver el reto →</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
