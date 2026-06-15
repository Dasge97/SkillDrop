import { type PhaseSeed } from '../content-types.js';

export const conceptP03: PhaseSeed = {
  code: 'FASE 3',
  title: 'Middleware: el portero',
  objective:
    'Entender qué es un middleware y por qué es tan útil: código que se ejecuta ANTES del handler y puede dejar pasar o cortar.',
  unlockedSkills: ['api-rest'],
  projects: [],
  lessons: [
    {
      title: '¿Qué es un middleware?',
      objective:
        'Comprender el rol de un middleware en la cadena de procesamiento de una petición HTTP.',
      theory:
        'Un middleware es una función con la firma (req, res, next) que se ejecuta en cadena antes de que la petición llegue al handler final. El servidor llama a cada middleware en orden: si el middleware llama a next(), la ejecución pasa al siguiente; si no lo hace, la cadena se corta ahí mismo y el handler nunca se ejecuta.\n\nEsta mecánica es enormemente útil porque permite separar responsabilidades: un middleware puede encargarse del logging, otro de la autenticación, otro de la validación de datos… sin mezclar esa lógica con el código de negocio del handler.\n\nLo más importante es entender la diferencia entre "dejar pasar" (llamar a next()) y "cortar" (responder directamente sin llamar a next()). Cuando un middleware corta, responde al cliente él mismo —por ejemplo con un 401— y la petición nunca llega al handler.',
      concepts: ['middleware', 'next()', 'cadena de middlewares', 'handler'],
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
              { id: 'a', text: 'La petición sigue al handler igualmente' },
              {
                id: 'b',
                text: 'La cadena se corta y la petición no llega al handler',
              },
              { id: 'c', text: 'El servidor lanza un error automáticamente' },
              {
                id: 'd',
                text: 'El middleware se vuelve a ejecutar en bucle',
              },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'Si un middleware no invoca next(), la cadena se interrumpe ahí. El handler final nunca se ejecuta. El middleware es responsable de responder al cliente (por ejemplo con res.json() o res.status()), de lo contrario la petición quedará colgada sin respuesta.',
          },
        },
      },
    },
    {
      title: 'Escribe un middleware portero',
      objective:
        'Implementar un middleware de autenticación básico que comprueba la cabecera Authorization y corta con 401 si falta.',
      theory:
        'Un middleware de autenticación sigue siempre el mismo patrón: revisa la petición entrante buscando una credencial (en este caso la cabecera Authorization) y toma una decisión binaria: dejar pasar o cortar.\n\nSi la cabecera Authorization está presente, el middleware llama a next() y la petición continúa hacia el handler. Si no está, el middleware responde directamente con res.status(401).json({ error: "No autorizado" }) y no llama a next(), de modo que el handler nunca llega a ejecutarse.',
      concepts: [
        'middleware de autenticación',
        'cabecera Authorization',
        'código de estado 401',
      ],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Middleware de autenticación con use()',
        brief:
          'Escribe un middleware con use() que proteja el endpoint: si falta la cabecera Authorization, responde 401; si está presente, deja pasar al handler.',
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
            'Escribe un middleware con use() que, si NO hay req.headers.authorization, responda 401 con res.status(401).json({ error: "No autorizado" }) y NO llame a next(); si la hay, llame a next(). El handler ya responde los datos.',
          starterCode: `// El handler ya está listo: responde los datos de la ruta /reviews.
route((req, res) => {
  res.json({ reviews: ['Muy buen curso', 'Aprendí muchísimo'] });
});

// TODO: añade aquí un middleware con use() que:
// - Si req.headers.authorization NO existe → res.status(401).json({ error: 'No autorizado' })
// - Si req.headers.authorization SÍ existe → llama a next()
`,
          solution: `use((req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  next();
});

route((req, res) => {
  res.json({ reviews: ['Muy buen curso', 'Aprendí muchísimo'] });
});
`,
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
