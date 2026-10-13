import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten';

// Ejecuta código JS del alumno en QuickJS (WebAssembly): aislado de Node, sin
// acceso a ficheros, red ni `process`, con límite de tiempo y de memoria.
// `console.log` se formatea igual que en el runner del navegador (lib/runner.ts).

const TIME_LIMIT_MS = 1000;
const MEMORY_LIMIT_BYTES = 32 * 1024 * 1024;
const MAX_LOG_LINES = 500;

const PRELUDE = `
globalThis.__logs = [];
const __fmt = (x) => {
  if (typeof x === 'string') return x;
  try { const s = JSON.stringify(x); return s === undefined ? String(x) : s; } catch { return String(x); }
};
const __log = (...a) => { if (__logs.length < ${MAX_LOG_LINES}) __logs.push(a.map(__fmt).join(' ')); };
globalThis.console = { log: __log, error: __log, warn: __log, info: __log };
// QuickJS no trae structuredClone: copia profunda de lo que usan los retos.
globalThis.structuredClone = function clone(v) {
  if (v === null || typeof v !== 'object') return v;
  if (v instanceof Date) return new Date(v.getTime());
  if (v instanceof Map) return new Map([...v].map(([k, x]) => [clone(k), clone(x)]));
  if (v instanceof Set) return new Set([...v].map(clone));
  if (Array.isArray(v)) return v.map(clone);
  const out = {};
  for (const k of Object.keys(v)) out[k] = clone(v[k]);
  return out;
};
`;

export interface CodeRun {
  ok: boolean;
  logs: string[];
  error?: string;
}

export async function runSandboxed(code: string): Promise<CodeRun> {
  const QuickJS = await getQuickJS();
  const runtime = QuickJS.newRuntime();
  runtime.setMemoryLimit(MEMORY_LIMIT_BYTES);
  runtime.setMaxStackSize(1024 * 1024);
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + TIME_LIMIT_MS));
  const vm = runtime.newContext();

  const readLogs = (): string[] => {
    const r = vm.evalCode('JSON.stringify(globalThis.__logs)');
    if (r.error) {
      r.error.dispose();
      return [];
    }
    const json = vm.getString(r.value);
    r.value.dispose();
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  try {
    const pre = vm.evalCode(PRELUDE);
    if (pre.error) {
      pre.error.dispose();
      return { ok: false, logs: [], error: 'No se pudo preparar el entorno de ejecución' };
    }
    pre.value.dispose();

    const res = vm.evalCode(code, 'alumno.js');
    if (res.error) {
      const err = vm.dump(res.error);
      res.error.dispose();
      const msg =
        err && typeof err === 'object'
          ? `${err.name ?? 'Error'}: ${err.message ?? ''}`
          : String(err);
      const interrupted = /interrupted/i.test(msg);
      return {
        ok: false,
        logs: readLogs(),
        error: interrupted
          ? `El código tardó más de ${TIME_LIMIT_MS / 1000} s (¿un bucle infinito?)`
          : msg,
      };
    }
    res.value.dispose();
    // Ejecuta las promesas pendientes (microtareas).
    const jobs = runtime.executePendingJobs();
    if (jobs.error) jobs.error.dispose();
    return { ok: true, logs: readLogs() };
  } finally {
    vm.dispose();
    runtime.dispose();
  }
}

// Salida comparable: sin espacios al final de cada línea ni líneas vacías al final.
export function normalizeOutput(logs: string[]): string[] {
  const lines = logs.join('\n').split('\n').map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export type CodeGrade =
  | { gradable: false; reason: string }
  | { gradable: true; correct: boolean; expected: string[]; got: string[]; error?: string };

// Compara la salida del alumno con la de la solución de referencia. Si la
// solución falla o no da siempre la misma salida (p. ej. usa Math.random), el
// reto no se puede corregir así y se devuelve `gradable: false`.
export async function gradeAgainstSolution(studentCode: string, solution: string): Promise<CodeGrade> {
  const ref1 = await runSandboxed(solution);
  if (!ref1.ok) return { gradable: false, reason: `La solución falla: ${ref1.error}` };
  const ref2 = await runSandboxed(solution);
  const expected = normalizeOutput(ref1.logs);
  if (JSON.stringify(expected) !== JSON.stringify(normalizeOutput(ref2.logs))) {
    return { gradable: false, reason: 'La salida de la solución no es siempre la misma' };
  }
  if (expected.length === 0) return { gradable: false, reason: 'La solución no imprime nada' };

  const run = await runSandboxed(studentCode);
  const got = normalizeOutput(run.logs);
  const correct = run.ok && JSON.stringify(got) === JSON.stringify(expected);
  return { gradable: true, correct, expected, got, error: run.error };
}
