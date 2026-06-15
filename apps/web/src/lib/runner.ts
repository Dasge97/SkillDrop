// Ejecuta el código del alumno en un Web Worker aislado (sin acceso al DOM).
// Modo 'js': ejecuta JS y captura console.log.
// Modo 'server': inyecta un mini-servidor (use/route + req/res), pasa una
// petición de ejemplo por la cadena y devuelve el recorrido (trace) + respuesta.

export interface TraceStep {
  step: 'request' | 'middleware' | 'handler' | 'response';
  name?: string;
  method?: string;
  path?: string;
  status?: number;
  body?: unknown;
  reached?: boolean;
}

export interface RunResult {
  ok: boolean;
  error?: string;
  logs: string[];
  trace?: TraceStep[];
  response?: { status: number; body: unknown };
}

export type RunMode = 'js' | 'server';

// Cuerpo del worker. Se serializa con toString() (no se ejecuta en el hilo principal).
function workerBody(): void {
  const ctx: any = self;
  const fmt = (x: any) => {
    if (typeof x === 'string') return x;
    try {
      return JSON.stringify(x);
    } catch {
      return String(x);
    }
  };
  ctx.onmessage = (e: any) => {
    const { mode, code, sample } = e.data;
    const logs: string[] = [];
    const con = { log: (...a: any[]) => logs.push(a.map(fmt).join(' ')) };
    (con as any).error = con.log;
    (con as any).warn = con.log;
    (con as any).info = con.log;
    try {
      if (mode === 'server') {
        const mws: any[] = [];
        let handler: any = null;
        const use = (fn: any) => mws.push(fn);
        const route = (fn: any) => {
          handler = fn;
        };
        // eslint-disable-next-line no-new-func
        new Function('use', 'route', 'console', code)(use, route, con);

        const req = Object.assign(
          { method: 'GET', path: '/', headers: {}, query: {}, body: null },
          sample || {},
        );
        const trace: any[] = [
          { step: 'request', method: req.method, path: req.path },
        ];
        let ended = false;
        let reachedHandler = false;
        const res: any = {
          statusCode: 200,
          _body: undefined,
          status(c: number) {
            this.statusCode = c;
            return this;
          },
          setHeader() {
            return this;
          },
          json(o: any) {
            this._body = o;
            ended = true;
          },
          send(t: any) {
            this._body = t;
            ended = true;
          },
          end() {
            ended = true;
          },
        };
        let i = 0;
        const next = () => {
          if (ended) return;
          if (i < mws.length) {
            const mw = mws[i++];
            trace.push({ step: 'middleware', name: mw.name || 'middleware ' + i });
            mw(req, res, next);
          } else if (handler) {
            reachedHandler = true;
            trace.push({ step: 'handler' });
            handler(req, res);
          }
        };
        next();
        trace.push({
          step: 'response',
          status: res.statusCode,
          body: res._body,
          reached: reachedHandler,
        });
        ctx.postMessage({
          ok: true,
          logs,
          trace,
          response: { status: res.statusCode, body: res._body },
        });
      } else {
        // eslint-disable-next-line no-new-func
        new Function('console', code)(con);
        ctx.postMessage({ ok: true, logs });
      }
    } catch (err: any) {
      ctx.postMessage({ ok: false, error: String((err && err.message) || err), logs });
    }
  };
}

const WORKER_SRC = '(' + workerBody.toString() + ')()';

export function runCode(
  mode: RunMode,
  code: string,
  sample?: unknown,
  timeoutMs = 2000,
): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    let url: string;
    try {
      const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
    } catch (e) {
      resolve({ ok: false, error: 'No se pudo iniciar el runner.', logs: [] });
      return;
    }
    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve({
        ok: false,
        error: 'Tiempo de ejecución agotado (¿un bucle infinito?).',
        logs: [],
      });
    }, timeoutMs);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      cleanup();
      resolve(e.data as RunResult);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      cleanup();
      resolve({ ok: false, error: e.message || 'Error en la ejecución', logs: [] });
    };
    worker.postMessage({ mode, code, sample });
  });
}
