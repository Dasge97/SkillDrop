import { type PhaseSeed } from '../content-types.js';

export const conceptP05: PhaseSeed = {
  code: 'FASE 5',
  title: 'CORS, errores y todo junto',
  objective:
    'Entender por qué el navegador bloquea peticiones (CORS), elegir buenos códigos de estado y juntar todo en un flujo mínimo.',
  unlockedSkills: ['http'],
  projects: [],
  lessons: [
    {
      title: 'CORS y códigos de estado',
      objective:
        'Comprender por qué existe CORS y qué código de estado usar según la situación.',
      theory:
        'El navegador aplica la política de mismo origen (Same-Origin Policy): si tu página está en origen A, no puede pedir datos a origen B salvo que el servidor B lo autorice. Esa autorización llega con cabeceras CORS como Access-Control-Allow-Origin. Sin ellas, el navegador corta la respuesta antes de que tu código la vea.\n\nEl servidor puede permitir un origen concreto o usar * para permitir cualquiera. En peticiones que modifican datos (POST, PUT, DELETE) el navegador primero lanza una petición OPTIONS de "preflight" para preguntar si está permitido; solo si el servidor responde afirmativamente envía la petición real.\n\nCada respuesta HTTP lleva un código de tres dígitos que resume qué pasó. Los más habituales son: 200 (OK, todo bien), 201 (Created, recurso creado), 400 (Bad Request, la petición tiene datos inválidos), 401 (Unauthorized, falta o es inválido el token), 404 (Not Found, el recurso no existe) y 500 (Internal Server Error, algo falló en el servidor).\n\nElegir el código correcto no es cosmético: el cliente —y cualquier proxy o caché intermedio— toma decisiones distintas según ese número. Un 404 dice "no lo busques más aquí"; un 500 dice "reintenta o avisa al equipo".',
      concepts: ['cors', 'same-origin-policy', 'preflight', 'status-codes'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Qué código de estado devuelves?',
        brief:
          'El usuario pide un recurso que NO existe. ¿Qué código de estado devuelves?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http', 'seguridad-web'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'quiz',
          prompt:
            'El usuario pide un recurso que NO existe. ¿Qué código de estado devuelves?',
          quiz: {
            options: [
              { id: '200', text: '200 — OK' },
              { id: '400', text: '400 — Bad Request' },
              { id: '404', text: '404 — Not Found' },
              { id: '500', text: '500 — Internal Server Error' },
            ],
            correctIds: ['404'],
            multiple: false,
            explanation:
              '404 significa que el servidor entendió la petición pero el recurso pedido no existe. 200 implicaría éxito (incorrecto), 400 implicaría un error en los datos enviados (no es el caso) y 500 implicaría un fallo interno del servidor (tampoco corresponde).',
          },
        },
      },
    },
    {
      title: 'Todo junto (mínimo)',
      objective:
        'Unir middleware de autenticación y handler final en un flujo completo usando use() y route().',
      theory:
        'Cuando conectamos todo lo aprendido, el ciclo queda así: el cliente manda una petición HTTP con un token en la cabecera Authorization, el servidor la recibe y la hace pasar por una cadena de middlewares antes de llegar al handler final.\n\nEl primer middleware comprueba que el token existe y es válido. Si no lo es, responde inmediatamente con 401 y no llama a next(), cortando el flujo. Si el token está bien, llama a next() y la petición avanza al siguiente eslabón.\n\nEl handler final (route) asume que si llegó hasta aquí es porque los middlewares dieron el visto bueno. Solo tiene que hacer su trabajo: obtener los datos, y responder con el código adecuado (200) y el cuerpo en JSON.\n\nEste patrón —cadena de middlewares + handler final— es la base de cualquier API REST real, independientemente del framework que uses.',
      concepts: [
        'middleware',
        'autenticacion-token',
        'handler',
        'cadena-middlewares',
      ],
      tools: [],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'Flujo mínimo: middleware de auth + handler de datos',
        brief:
          'Monta el flujo mínimo: un middleware con use() que exija req.headers.authorization (si falta, 401 y no llama next()), y un route() que responda 200 con res.json de una lista de reseñas.',
        difficulty: 3,
        timeLimitMinutes: 15,
        skills: ['api-rest', 'auth-sesiones'],
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
            'Monta el flujo mínimo: un middleware con use() que exija req.headers.authorization (si falta, responde 401 con res.status(401).send("No autorizado") y NO llames a next()), y un route() que responda 200 con res.json de una lista de reseñas. Usa la petición de ejemplo que SÍ trae token.',
          starterCode: `// Middleware de autenticación
use((req, res, next) => {
  // TODO: comprueba req.headers.authorization
  // Si NO existe → res.status(401).send('No autorizado') y para aquí
  // Si existe → llama a next()
});

// Handler final
route((req, res) => {
  // TODO: responde con status 200 y res.json con un array de reseñas
  // Ejemplo: [{ id: 1, text: 'Muy buen curso' }, { id: 2, text: 'Lo recomiendo' }]
});
`,
          solution: `use((req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send('No autorizado');
    return;
  }
  next();
});

route((req, res) => {
  res.status(200).json([
    { id: 1, text: 'Muy buen curso' },
    { id: 2, text: 'Lo recomiendo' },
  ]);
});
`,
          sample: {
            method: 'GET',
            path: '/reviews',
            headers: { authorization: 'Bearer demo-token' },
            query: {},
            body: null,
          },
        },
      },
    },
  ],
};
