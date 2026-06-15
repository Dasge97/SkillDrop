import { type PhaseSeed } from '../content-types.js';

export const conceptP03: PhaseSeed = {
  code: 'FASE 3',
  title: 'Endpoints, verbos/CRUD y el servidor mínimo',
  objective:
    'Una API son rutas + verbos (CRUD); ver el servidor más pequeño que responde.',
  unlockedSkills: ['api-rest'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: '¿Qué verbo usas para CREAR?',
      objective:
        'Identificar POST como el verbo HTTP correcto para crear recursos nuevos.',
      theory:
        'Una API REST organiza su funcionalidad en torno a recursos: reseñas, usuarios, productos… Cada recurso vive en una URL fija llamada endpoint. Lo que varía no es la ruta, sino el verbo HTTP con el que se hace la petición.\n\nLos cuatro verbos fundamentales del CRUD son GET (leer), POST (crear), PUT/PATCH (actualizar) y DELETE (borrar). Elegir el verbo correcto no es solo una convención: los navegadores, cachés y proxies toman decisiones en función del verbo. GET es seguro e idempotente; POST no lo es, porque cada llamada puede crear un recurso diferente.\n\nCuando quieres crear una reseña nueva, envías un POST al endpoint /reviews con los datos en el cuerpo. El servidor procesa el cuerpo, crea el registro en la base de datos y responde normalmente con código 201 (Created) y el recurso recién creado.\n\nRespetar los verbos hace que la API sea predecible: quien lee POST /reviews entiende de inmediato que se va a crear algo, sin necesidad de documentación adicional.',
      concepts: ['POST', 'CRUD', 'endpoint', 'verbo HTTP', 'REST'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué verbo para crear una reseña?',
        brief: '¿Qué verbo usas para CREAR una reseña nueva?',
        difficulty: 1,
        timeLimitMinutes: 5,
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
          prompt:
            'Quieres crear una reseña nueva en la plataforma. ¿Qué verbo HTTP utilizas?',
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
              'POST es el verbo reservado para crear recursos nuevos en REST. GET lee (sin efectos secundarios), PUT/PATCH actualiza y DELETE borra. Usar POST para crear hace que la API sea predecible para cualquier cliente y herramienta.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: '¿Qué verbo usas para BORRAR?',
      objective:
        'Identificar DELETE como el verbo HTTP correcto para eliminar recursos.',
      theory:
        'Dentro del CRUD, la operación de borrado se expresa con el verbo DELETE. La URL incluye el identificador del recurso que se quiere eliminar, por ejemplo DELETE /reviews/42 borra la reseña con id 42. El cuerpo de la petición suele ir vacío porque toda la información necesaria está en la ruta.\n\nEl código de respuesta habitual tras un borrado exitoso es 204 (No Content): el servidor confirma que la operación se realizó, pero no hay cuerpo que devolver. Algunos diseños prefieren 200 con un mensaje de confirmación, pero 204 es la convención más extendida.\n\nEs importante no usar GET para borrar aunque parezca más sencillo. Los bots de indexación, los pre-fetchers del navegador y los proxies pueden disparar peticiones GET de forma automática; si GET borrase datos, esas herramientas podrían destruir información sin querer.\n\nLa regla de oro es que GET, HEAD y OPTIONS sean operaciones seguras (sin efectos secundarios). Borrar, crear y modificar siempre usan verbos no seguros: POST, PUT, PATCH o DELETE.',
      concepts: ['DELETE', 'CRUD', '204 No Content', 'idempotencia', 'REST'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué verbo para borrar una reseña?',
        brief: '¿Qué verbo usas para BORRAR una reseña?',
        difficulty: 1,
        timeLimitMinutes: 5,
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
          prompt:
            'Quieres eliminar la reseña con id 42. ¿Qué verbo HTTP utilizas?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'get', text: 'GET' },
              { id: 'post', text: 'POST' },
              { id: 'put', text: 'PUT' },
              { id: 'delete', text: 'DELETE' },
            ],
            correctIds: ['delete'],
            multiple: false,
            explanation:
              'DELETE es el verbo reservado para eliminar recursos. GET es de lectura (no debe tener efectos secundarios); POST crea; PUT/PATCH modifica. Usar DELETE para borrar garantiza que bots y proxies no borren datos sin querer al hacer peticiones automáticas.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'El servidor mínimo: un handler que responde',
      objective:
        'Escribir el handler más pequeño posible con route() y ver cómo el runner lo ejecuta.',
      theory:
        'Un servidor web no es más que un programa que escucha peticiones y devuelve respuestas. En el modelo del curso, basta con registrar un handler con route(fn): el runner pasa la petición por cualquier middleware registrado con use() y, si llegan al final, llama al handler.\n\nEl handler recibe dos objetos: req (la petición) y res (la respuesta). Para responder usas res.status(code) para fijar el código HTTP y res.json(obj) para enviar un objeto como JSON. Los dos métodos son encadenables: res.status(200).json({ mensaje: \'Hola\' }).\n\nEste patrón —registrar middlewares opcionales con use() y un handler final con route()— es exactamente el que usan frameworks de producción como Express, Fastify o Hono. La diferencia es que en producción el servidor escucha en un puerto real; aquí el runner simula la petición y muestra el recorrido y la respuesta paso a paso.\n\nEl servidor más pequeño posible es solo un route() sin ningún use(). La petición llega, el handler la procesa y responde. Sin más.',
      concepts: ['route()', 'handler', 'req', 'res', 'res.status', 'res.json'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El handler más pequeño',
        brief:
          'Completa el handler para que responda 200 con JSON { mensaje: "Hola desde el servidor" }.',
        difficulty: 1,
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
          prompt:
            'Completa el handler para que el servidor responda con código de estado 200 y el JSON { "mensaje": "Hola desde el servidor" }.',
          runner: 'server',
          sample: {
            method: 'GET',
            path: '/',
            headers: {},
            query: {},
            body: null,
          },
          starterCode: 'route((req, res) => {\n  // TODO\n});',
          solution:
            "route((req, res) => {\n  res.status(200).json({ mensaje: 'Hola desde el servidor' });\n});",
        },
      },
    },
  ],
};
