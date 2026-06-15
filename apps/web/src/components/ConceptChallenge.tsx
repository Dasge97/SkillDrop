import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { ChallengeDTO, SubmissionDTO } from '@skilldrop/shared';
import { api, ApiError } from '@/lib/api';
import { runCode, type RunResult } from '@/lib/runner';
import { Icon } from './icons';
import { Button, Card, cx, SectionTitle } from './ui';
import { RequestVisualizer } from './RequestVisualizer';

export function ConceptChallenge({ challenge }: { challenge: ChallengeDTO }) {
  const concept = challenge.concept!;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [selected, setSelected] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState(concept.starterCode || '');
  const [run, setRun] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { challengeId: challenge.id, submit: true };
      if (concept.kind === 'quiz') payload.answer = JSON.stringify(selected);
      else if (concept.kind === 'short') payload.answer = answer;
      else payload.code = code;
      const sub = await api.post<SubmissionDTO>('/submissions', payload);
      await api.post(`/submissions/${sub.id}/evaluate`);
      return sub.id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/submission/${id}`);
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : 'No se pudo enviar.'),
  });

  async function onRun() {
    setRunning(true);
    setRun(null);
    const res = await runCode(concept.runner === 'server' ? 'server' : 'js', code, concept.sample ?? undefined);
    setRun(res);
    setRunning(false);
  }

  function toggleOption(id: string) {
    if (concept.quiz?.multiple) {
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    } else {
      setSelected([id]);
    }
  }

  const canSubmit =
    concept.kind === 'quiz'
      ? selected.length > 0
      : concept.kind === 'short'
        ? answer.trim().length > 0
        : code.trim().length > 0;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* Interacción principal */}
      <div className="space-y-5">
        <Card className="p-6">
          <SectionTitle icon="idea" title="Reto" />
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line">
            {concept.prompt}
          </p>
        </Card>

        {/* QUIZ */}
        {concept.kind === 'quiz' && concept.quiz && (
          <Card className="p-6 space-y-3">
            {concept.quiz.options.map((o) => {
              const on = selected.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggleOption(o.id)}
                  className={cx(
                    'w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                    on
                      ? 'border-brand-400 bg-brand-50/70 dark:border-brand-500/50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  )}
                >
                  <span
                    className={cx(
                      'w-5 h-5 rounded-full border flex items-center justify-center shrink-0',
                      on ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 dark:border-slate-600',
                    )}
                  >
                    {on && <Icon name="check" className="w-3 h-3" />}
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">{o.text}</span>
                </button>
              );
            })}
            {concept.quiz.multiple && (
              <p className="text-xs text-slate-400">Puede haber varias respuestas correctas.</p>
            )}
          </Card>
        )}

        {/* SHORT */}
        {concept.kind === 'short' && (
          <Card className="p-6">
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta con tus palabras…"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </Card>
        )}

        {/* CODE */}
        {concept.kind === 'code' && (
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Editor</span>
              {concept.runner !== 'none' && (
                <Button size="sm" variant="outline" icon="bolt" loading={running} onClick={onRun}>
                  Ejecutar
                </Button>
              )}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={Math.max(8, code.split('\n').length + 1)}
              className="w-full bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-[13px] leading-relaxed px-4 py-3 focus:outline-none resize-y"
            />
          </Card>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex items-center gap-3">
          <Button
            size="lg"
            icon={concept.kind === 'quiz' ? 'check' : 'sparkles'}
            disabled={!canSubmit}
            loading={submit.isPending}
            onClick={() => {
              setError(null);
              submit.mutate();
            }}
          >
            {concept.kind === 'quiz' ? 'Comprobar' : 'Enviar y evaluar'}
          </Button>
          <span className="text-xs text-slate-400">
            {concept.kind === 'quiz'
              ? 'Corrección al instante.'
              : 'Te evalúa la IA con feedback inmediato.'}
          </span>
        </div>
      </div>

      {/* Panel lateral: salida del runner */}
      <div className="space-y-5 lg:sticky lg:top-8">
        {concept.kind === 'code' && concept.runner === 'server' && (
          <Card className="p-5">
            <SectionTitle icon="upload" title="Petición de ejemplo" />
            <pre className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-pre-wrap break-all">
              {JSON.stringify(concept.sample ?? { method: 'GET', path: '/' }, null, 2)}
            </pre>
          </Card>
        )}

        {run && (
          <Card className="p-5 space-y-4">
            <SectionTitle icon="bolt" title="Resultado" />
            {!run.ok && (
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">{run.error}</p>
            )}
            {run.logs && run.logs.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Consola</p>
                <pre className="rounded-lg bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-xs p-3 whitespace-pre-wrap break-all max-h-48 overflow-auto">
                  {run.logs.join('\n')}
                </pre>
              </div>
            )}
            {run.trace && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">El viaje de la petición</p>
                <RequestVisualizer trace={run.trace} />
              </div>
            )}
          </Card>
        )}

        {!run && concept.kind === 'code' && concept.runner !== 'none' && (
          <Card className="p-5 text-center">
            <img src="/mascot/idea.png" alt="" className="w-20 h-20 object-contain mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pulsa <span className="font-medium">Ejecutar</span> para ver qué hace tu código sin salir de aquí.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
