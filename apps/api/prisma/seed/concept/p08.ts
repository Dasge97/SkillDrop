import { type PhaseSeed } from '../content-types.js';

export const conceptP08: PhaseSeed = {
  code: 'FASE 8',
  title: 'CORS, estados y todo junto',
  objective:
    'Entender por qué el navegador bloquea (CORS), elegir buenos códigos de estado y juntar todo lo aprendido en un flujo mínimo.',
  unlockedSkills: ['http', 'api-rest', 'auth-sesiones'],
  projects: [],
  lessons: [
    // ── L1 ──────────────────────────────────────────────────────────────────
    {
      title: '¿Por qué el navegador bloquea otra origen?',
      objective:
        'Comprender la política de mismo origen (Same-Origin Policy) y cómo CORS la relaja de forma controlada.',
      theory:
        'El navegador aplica por defecto la política de mismo origen (Same-Origin Policy): si tu página corre en origen A (protocolo + dominio + puerto), no puede leer la respuesta de una petición a origen B salvo autorización explícita. Esta regla protege al usuario de ataques en los que una web maliciosa lería datos privados de otra pestaña o de una API bancaria.\n\nCuando el servidor B quiere permitir el acceso desde A, lo indica con cabeceras HTTP especiales: Access-Control-Allow-Origin (qué orígenes pueden leer la respuesta) y, para peticiones que modifican datos, otras cabeceras como Access-Control-Allow-Methods o Access-Control-Allow-Headers. Sin esas cabeceras el navegador descarta la respuesta antes de que tu JavaScript la vea —aunque el servidor sí la envió.\n\nEn peticiones "no simples" (con métodos PUT/DELETE o cabeceras personalizadas como Authorization) el navegador lanza primero una petición OPTIONS llamada preflight. Solo si el servidor responde con las cabeceras CORS correctas se envía la petición real. Esto añade una ida y vuelta extra, pero garantiza que el servidor consiente el acceso.\n\nEn resumen, CORS no es una medida del servidor para protegerse a sí mismo, sino una norma que el navegador impone para proteger al usuario. Un servidor que responde con Access-Control-Allow-Origin: * acepta peticiones de cualquier origen; uno que lo omite deja la restricción activa.',
      concepts: [
        'cors',
        'same-origin-policy',
        'preflight',
        'access-control-allow-origin',
      ],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Por qué bloquea el navegador por defecto?',
        brief:
          '¿Por qué el navegador BLOQUEA por defecto una llamada a otro origen (otro dominio)?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http', 'api-rest', 'auth-sesiones'],
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
            '¿Por qué el navegador BLOQUEA por defecto una llamada a otro origen (otro dominio)?',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'Por seguridad: la política del mismo origen impide que una web lea datos de otro dominio sin permiso explícito del servidor.',
              },
              {
                id: 'b',
                text: 'Porque las peticiones a otro dominio son siempre más lentas y el navegador las cancela para ahorrar ancho de banda.',
              },
              {
                id: 'c',
                text: 'Porque el protocolo HTTP prohíbe que dos dominios distintos se comuniquen entre sí.',
              },
              {
                id: 'd',
                text: 'Por un bug histórico de los navegadores que nunca se ha corregido.',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'La respuesta correcta es la A. El navegador aplica la política del mismo origen para proteger al usuario: sin ella, cualquier web maliciosa podría leer datos privados de otra pestaña o de una API que el usuario tiene abierta. El servidor puede levantar esta restricción enviando las cabeceras CORS adecuadas (como Access-Control-Allow-Origin). Las otras opciones son falsas: HTTP no prohíbe la comunicación entre dominios a nivel de protocolo, la velocidad no tiene nada que ver, y la restricción es una característica deliberada de seguridad, no un bug.',
          },
        },
      },
    },
    // ── L2 ──────────────────────────────────────────────────────────────────
    {
      title: 'Códigos de estado: elige el correcto',
      objective:
        'Seleccionar el código de estado HTTP adecuado según la situación, especialmente el 404 cuando un recurso no existe.',
      theory:
        'Cada respuesta HTTP incluye un código de tres dígitos que resume el resultado de la operación. Estos códigos se agrupan por centenas: 2xx indica éxito, 3xx redirección, 4xx error del cliente y 5xx error del servidor. Elegir el código correcto no es un detalle cosmético: el cliente, los proxies y las cachés toman decisiones distintas en función de ese número.\n\nLos más habituales en una API REST son: 200 OK (la petición tuvo éxito y hay datos en la respuesta), 201 Created (se creó un recurso nuevo, típico tras un POST), 400 Bad Request (la petición tiene datos inválidos o mal formados —el problema está en lo que envió el cliente—), 401 Unauthorized (falta autenticación o el token es inválido), 403 Forbidden (el usuario está autenticado pero no tiene permiso), 404 Not Found (el recurso pedido no existe en el servidor) y 500 Internal Server Error (algo falló inesperadamente en el servidor).\n\nUn error frecuente es devolver siempre 200 incluso cuando algo va mal, poniendo el error solo en el cuerpo JSON. Esto rompe los contratos implícitos de HTTP: los clientes que comprueben el código nunca sabrán que falló, y las herramientas de monitoreo contarán errores como éxitos.\n\nOtro error habitual es confundir 401 y 403: el 401 significa "no sé quién eres, preséntate" (falta o token inválido), mientras que el 403 significa "sé quién eres, pero no tienes permiso". Usarlos correctamente hace que la API sea más clara y segura.',
      concepts: [
        'status-codes',
        'http-2xx',
        'http-4xx',
        'http-5xx',
        '404-not-found',
      ],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué código de estado devuelves cuando el recurso no existe?',
        brief:
          'El usuario pide un recurso que NO existe. ¿Qué código de estado devuelves?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http', 'api-rest', 'auth-sesiones'],
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
              '404 Not Found es el código correcto: el servidor entendió perfectamente la petición, pero el recurso que se pide simplemente no existe. El 200 indicaría éxito (incorrecto, ya que no hay nada que devolver). El 400 señala que la petición en sí está mal formada o tiene datos inválidos, no que el recurso no exista. El 500 indica un fallo interno del servidor, no una ausencia de recurso. Usar 404 permite al cliente (y a los proxies) saber que no merece la pena reintentar esa URL.',
          },
        },
      },
    },
    // ── L3 ──────────────────────────────────────────────────────────────────
    {
      title: 'Todo junto: middleware de auth + handler de datos',
      objective:
        'Unir un middleware de autenticación y un handler final en un flujo completo usando use() y route().',
      theory:
        'Cuando conectamos todo lo aprendido, el ciclo queda así: el cliente envía una petición HTTP con un token en la cabecera Authorization, el servidor la recibe y la hace pasar por una cadena de middlewares antes de llegar al handler final.\n\nEl primer middleware actúa como portero: comprueba que la cabecera Authorization existe. Si no está, responde inmediatamente con 401 y no llama a next(), cortando el flujo —la petición nunca llega al handler—. Si el token está presente, llama a next() y la petición avanza al siguiente eslabón de la cadena.\n\nEl handler final (route) asume que, si llegó hasta aquí, los middlewares dieron el visto bueno. Solo tiene que hacer su trabajo: obtener los datos y responder con el código adecuado (200) y el cuerpo en JSON. No necesita volver a comprobar la autenticación porque ya fue validada antes.\n\nEste patrón —cadena de middlewares + handler final— es la base de cualquier API REST real, independientemente del framework que uses. Permite separar responsabilidades: cada middleware se encarga de una sola cosa (autenticación, logging, validación…) y el handler se centra solo en la lógica de negocio.',
      concepts: [
        'middleware',
        'autenticacion-token',
        'handler',
        'cadena-middlewares',
        'flujo-peticion',
      ],
      tools: [],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'Flujo mínimo: middleware de auth + handler de reseñas',
        brief:
          'Monta el flujo mínimo: un middleware con use() que exija req.headers.authorization (si falta → 401 y NO llama next()), y un route() que responda 200 con res.json de una lista de reseñas. Usa la petición de ejemplo que SÍ trae token.',
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
            'Monta el flujo mínimo: un middleware con use() que exija req.headers.authorization (si falta, responde con res.status(401).send("No autorizado") y NO llames a next()), y un route() que responda 200 con res.json de una lista de reseñas. Usa la petición de ejemplo que SÍ trae token.',
          starterCode: `// Middleware de autenticación
use((req, res, next) => {
  // TODO: comprueba req.headers.authorization
  // Si NO existe → res.status(401).send('No autorizado') y para aquí (no llames a next())
  // Si existe → llama a next() para que la petición continúe
});

// Handler final de reseñas
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
