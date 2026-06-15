import { type PhaseSeed } from '../content-types.js';

export const conceptP02: PhaseSeed = {
  code: 'FASE 2',
  title: 'Endpoints, verbos y un servidor mínimo',
  objective:
    'Entender que una API son rutas + verbos, y ver el servidor más pequeño que responde.',
  unlockedSkills: ['api-rest'],
  projects: [],
  lessons: [
    {
      title: 'Endpoints y verbos REST',
      objective:
        'Comprender que cada recurso tiene rutas y que los verbos HTTP definen la operación sobre ese recurso.',
      theory:
        'Una API REST organiza su funcionalidad en torno a **recursos**: usuarios, productos, reseñas… Cada recurso vive en una URL fija llamada **endpoint**. Lo que varía no es la ruta, sino el **verbo HTTP** con el que se hace la petición.\n\nLos cuatro verbos fundamentales son GET (leer), POST (crear), PUT/PATCH (actualizar) y DELETE (borrar). Juntos forman el acrónimo CRUD. Elegir el verbo correcto no es solo una convención: muchas herramientas, cachés y proxies toman decisiones en función del verbo.\n\nPor ejemplo, el endpoint `/reseñas` puede recibir un GET para listar todas las reseñas, o un POST para crear una nueva. La URL no cambia; cambia el verbo. Eso hace que la API sea predecible y fácil de explorar.\n\nRespetar los verbos también comunica intención a otros desarrolladores: quien lee `DELETE /usuarios/42` entiende de inmediato que borra al usuario 42, sin necesidad de documentación adicional.',
      concepts: ['endpoint', 'verbo HTTP', 'REST', 'CRUD'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué verbo para crear una reseña?',
        brief:
          'Selecciona el verbo HTTP correcto para la operación de crear un recurso nuevo.',
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
          prompt: '¿Qué verbo usarías para CREAR una reseña nueva?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'get', text: 'GET' },
              { id: 'post', text: 'POST' },
              { id: 'put', text: 'PUT' },
              { id: 'delete', text: 'DELETE' },
            ],
            correctIds: ['post'],
            multiple: false,
            explanation:
              'POST es el verbo reservado para crear recursos nuevos en REST. GET lee, PUT/PATCH actualiza y DELETE borra. Usar POST para crear hace que la API sea predecible para cualquier cliente.',
          },
        },
      },
    },
    {
      title: 'El servidor mínimo',
      objective:
        'Entender cómo un servidor recibe una petición HTTP y devuelve una respuesta, usando el modelo use()/route() del simulador.',
      theory:
        'Un servidor web no es más que un programa que escucha peticiones y responde. Cuando llega una petición, el servidor la pasa por una cadena de **middlewares** antes de llegar al **handler** final que construye la respuesta.\n\nEn este simulador disponemos de dos globales: `use(fn)` registra un middleware con la firma `(req, res, next) => { … }`. Si el middleware llama a `next()`, la petición continúa hacia el siguiente paso; si no la llama, la cadena se detiene ahí. `route(fn)` registra el handler final con la firma `(req, res) => { … }`, que siempre debe enviar una respuesta.\n\nEl objeto `res` ofrece `res.status(code)` (encadenable), `res.json(obj)` para responder con JSON, `res.send(texto)` para texto plano y `res.setHeader(nombre, valor)` para añadir cabeceras. El objeto `req` expone `method`, `path`, `headers`, `query` y `body`.\n\nEsta cadena middleware → handler es exactamente el modelo que usan frameworks reales como Express o Fastify: middlewares para tareas transversales (logging, auth, CORS) y un handler final por ruta.',
      concepts: ['servidor', 'middleware', 'handler', 'req', 'res', 'next'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Responde con JSON desde el handler',
        brief:
          'Completa el handler para que el servidor responda con JSON `{ mensaje: "Hola desde el servidor" }` y código de estado 200.',
        difficulty: 2,
        timeLimitMinutes: 10,
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
            'Completa el handler para que responda con JSON `{ mensaje: "Hola desde el servidor" }` y estado 200.',
          starterCode:
            'route((req, res) => {\n  // TODO: responde con JSON y estado 200\n});',
          solution:
            'route((req, res) => {\n  res.status(200).json({ mensaje: \'Hola desde el servidor\' });\n});',
          sample: {
            method: 'GET',
            path: '/',
            headers: {},
            query: {},
            body: null,
          },
        },
      },
    },
  ],
};
