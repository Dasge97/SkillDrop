import { type PhaseSeed } from '../content-types.js';

export const conceptP05: PhaseSeed = {
  code: 'FASE 5',
  title: 'Middleware: el portero',
  objective:
    'Código que se ejecuta ANTES del handler y puede dejar pasar (next) o cortar.',
  unlockedSkills: ['api-rest', 'seguridad-web'],
  projects: [],
  lessons: [
    {
      title: '¿Qué es un middleware y qué hace next()?',
      objective:
        'Comprender el rol de un middleware en la cadena de procesamiento de una petición HTTP y qué ocurre si no llama a next().',
      theory:
        'Un middleware es una función con la firma (req, res, next) que el servidor ejecuta en orden antes de que la petición llegue al handler final. Cuando el middleware termina su trabajo y quiere que la petición continúe, llama a next(): eso le dice al servidor que pase al siguiente middleware o al handler. Si el middleware no llama a next(), la cadena se interrumpe exactamente ahí.\n\nEsta mecánica de "pasar o cortar" es lo que hace tan potente al middleware. Puedes colocar antes del handler toda la lógica que no tiene que ver con el negocio: logging, autenticación, validación de datos de entrada, control de acceso… Cada preocupación en su propio middleware, sin mezclar código.\n\nCuando un middleware "corta", normalmente responde él mismo al cliente (por ejemplo con un 401 o un 400) y no llama a next(). El handler nunca se ejecuta. Cuando "deja pasar", llama a next() y se desentiende: el siguiente eslabón de la cadena toma el relevo.\n\nEntender este flujo es fundamental para leer y escribir cualquier servidor HTTP moderno, porque frameworks como Express, Fastify o Hono están construidos exactamente sobre esta idea.',
      concepts: ['middleware', 'next()', 'cadena de middlewares', 'handler', 'logging'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué ocurre si un middleware no llama a next()?',
        brief:
          'Pon a prueba tu comprensión de la cadena de middlewares: ¿qué pasa exactamente cuando next() no se invoca?',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['api-rest'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'quiz',
          prompt: '¿Qué ocurre si un middleware NO llama a next()?',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'La cadena se corta y la petición no llega al handler',
              },
              {
                id: 'b',
                text: 'La petición sigue hacia el handler igualmente',
              },
              {
                id: 'c',
                text: 'El servidor lanza un error automáticamente',
              },
              {
                id: 'd',
                text: 'El middleware se vuelve a ejecutar en bucle',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Si un middleware no invoca next(), la cadena se interrumpe ahí. El handler final nunca se ejecuta. El middleware es responsable de responder al cliente (por ejemplo con res.json() o res.status()), de lo contrario la petición quedará colgada sin respuesta.',
          },
        },
      },
    },
    {
      title: 'Escribe un middleware de logging',
      objective:
        'Implementar un middleware que registra el método y la ruta de cada petición antes de dejarla pasar.',
      theory:
        'El logging es probablemente el caso de uso más sencillo de un middleware: antes de que la petición llegue al handler, queremos apuntar qué está pasando. Método HTTP, ruta, timestamp… cualquier información útil para depurar o monitorizar el sistema.\n\nUn middleware de logging siempre llama a next() porque su trabajo es observar, no bloquear. No toma ninguna decisión sobre si la petición debe continuar; simplemente toma nota y cede el paso.\n\nEscribir este tipo de middleware es también la mejor forma de entender el orden de ejecución: el console.log aparece en la consola del servidor antes de que el handler envíe la respuesta, lo que confirma que el middleware se ejecutó primero.',
      concepts: ['middleware de logging', 'req.method', 'req.path', 'next()', 'orden de ejecución'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Middleware que loguea método y ruta',
        brief:
          'Escribe un middleware con use() que haga console.log del método y la ruta de la petición y luego llame a next().',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['api-rest'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'code',
          runner: 'server',
          prompt:
            'Escribe un middleware con use() que haga console.log del método y la ruta (req.method y req.path) y luego llame a next(). El handler ya responde.',
          starterCode: `route((req, res) => {
  res.status(200).json([{ titulo: 'Inception' }]);
});

// TODO: use(...) que loguea req.method y req.path, y luego llama a next()`,
          solution: `use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

route((req, res) => {
  res.status(200).json([{ titulo: 'Inception' }]);
});`,
          sample: {
            method: 'GET',
            path: '/reviews',
            headers: {},
            query: {},
            body: null,
          },
        },
      },
    },
    {
      title: 'Middleware que corta: autenticación',
      objective:
        'Implementar un middleware de autenticación que bloquea la petición con 401 si falta la cabecera Authorization.',
      theory:
        'Un middleware de autenticación toma una decisión binaria: ¿tiene esta petición las credenciales necesarias para continuar? Si la respuesta es sí, llama a next() y deja pasar. Si la respuesta es no, responde directamente con un código de error y no llama a next().\n\nLa cabecera HTTP Authorization es el lugar estándar donde el cliente envía su credencial (un token, por ejemplo). Si un middleware comprueba esa cabecera y no la encuentra, sabe que la petición no está autenticada y puede responder con el código 401 Unauthorized antes de que el handler procese nada.\n\nEste patrón es muy seguro porque el handler de negocio nunca llega a ejecutarse si el usuario no está autenticado. No hace falta añadir comprobaciones de seguridad dentro de cada handler; el middleware las centraliza y se aplica a todas las rutas que lo usen.',
      concepts: [
        'middleware de autenticación',
        'cabecera Authorization',
        'código de estado 401',
        'cortar la cadena',
      ],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Middleware de autenticación: 401 si no hay token',
        brief:
          'Escribe un middleware que corte con 401 si falta la cabecera Authorization, y deje pasar si está presente.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['api-rest', 'seguridad-web'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'code',
          runner: 'server',
          prompt:
            "Escribe un middleware que, si NO hay req.headers.authorization, responda 401 con res.status(401).json({ error: 'No autorizado' }) y NO llame a next(); si la hay, llame a next().",
          starterCode: `route((req, res) => {
  res.status(200).json([{ titulo: 'Inception' }]);
});

// TODO: use(...) que comprueba req.headers.authorization
// - Si NO existe → res.status(401).json({ error: 'No autorizado' })
// - Si SÍ existe → next()`,
          solution: `use((req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  next();
});

route((req, res) => {
  res.status(200).json([{ titulo: 'Inception' }]);
});`,
          sample: {
            method: 'GET',
            path: '/reviews',
            headers: {},
            query: {},
            body: null,
          },
        },
      },
    },
  ],
};
