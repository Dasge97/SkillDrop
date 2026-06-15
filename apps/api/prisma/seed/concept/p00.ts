import { type PhaseSeed } from '../content-types.js';

export const conceptP00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Cliente, servidor y el viaje de la petición',
  objective:
    'Construir el modelo mental del round-trip: quién pide, quién responde y qué viaja.',
  unlockedSkills: ['http'],
  projects: [],
  lessons: [
    // ── L1 ─────────────────────────────────────────────────────────────────
    {
      title: '¿Quién habla primero?',
      objective:
        'Identificar cuál de los dos actores inicia siempre la conversación en la web.',
      theory:
        'En la web existe una regla fundamental: alguien tiene que pedir antes de que alguien pueda responder. A ese «alguien que pide» lo llamamos cliente (un navegador, una app móvil, un script) y al «alguien que responde» lo llamamos servidor.\n\nEsta relación es asimétrica por diseño. El servidor no puede «llamarte» por iniciativa propia en el modelo clásico HTTP: espera pasivamente hasta que llega una petición. Solo entonces actúa y devuelve una respuesta.\n\nEntender este rol activo/pasivo es la base de todo lo que viene después: sin saber quién inicia, es imposible razonar sobre errores de red, tiempos de espera o problemas de seguridad.',
      concepts: ['cliente', 'servidor', 'petición', 'respuesta'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: '¿Quién inicia la conversación?',
        brief:
          'Elige la opción que describe correctamente quién empieza siempre el intercambio de mensajes en HTTP.',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['http'],
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
            'En el modelo HTTP clásico, ¿quién inicia siempre la conversación entre cliente y servidor?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'El servidor, porque está siempre encendido y espera conexiones.' },
              { id: 'b', text: 'El cliente, enviando una petición al servidor.' },
              { id: 'c', text: 'Ambos pueden iniciar indistintamente.' },
              { id: 'd', text: 'El router de red, que decide quién habla primero.' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'En HTTP el cliente es siempre el actor activo: envía una petición (request) y el servidor responde (response). El servidor no puede iniciar un intercambio por sí solo en el modelo clásico.',
          },
        },
      },
    },

    // ── L2 ─────────────────────────────────────────────────────────────────
    {
      title: 'La respuesta tiene partes',
      objective:
        'Reconocer qué parte de la respuesta HTTP comunica el resultado de la operación.',
      theory:
        'Cuando el servidor responde, su mensaje no es solo el contenido que pediste. Incluye varias partes: una línea de estado con un código numérico, un conjunto de cabeceras con metadatos y, opcionalmente, un cuerpo con datos.\n\nEl código de estado es el semáforo de HTTP. Un 200 dice «todo bien», un 404 dice «no lo encontré» y un 500 dice «algo estalló en el servidor». Sin leer ese código no sabes si tu petición tuvo éxito.\n\nLas cabeceras dan contexto adicional (tipo de contenido, caché, autenticación), pero no son el indicador principal de éxito o error. El cuerpo contiene los datos útiles, pero tampoco dice si la operación fue exitosa: eso es tarea exclusiva del código de estado.',
      concepts: ['código de estado', 'cabeceras', 'cuerpo', 'respuesta HTTP'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: '¿Qué parte indica si todo fue bien?',
        brief:
          'Identifica cuál de los elementos de una respuesta HTTP es el indicador principal de éxito o error.',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['http'],
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
            '¿Qué parte de una respuesta HTTP indica si la operación fue exitosa o si hubo un error?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'El método HTTP (GET, POST…).' },
              { id: 'b', text: 'La ruta o URL solicitada.' },
              { id: 'c', text: 'El código de estado (200, 404, 500…).' },
              { id: 'd', text: 'La cabecera Content-Type.' },
            ],
            correctIds: ['c'],
            multiple: false,
            explanation:
              'El código de estado es el indicador estándar de resultado en HTTP: 2xx = éxito, 4xx = error del cliente, 5xx = error del servidor. El método y la ruta pertenecen a la petición, no a la respuesta; Content-Type informa el formato pero no el resultado.',
          },
        },
      },
    },

    // ── L3 ─────────────────────────────────────────────────────────────────
    {
      title: '¿Dónde van los datos que envías?',
      objective:
        'Localizar en qué parte de la petición HTTP viajan los datos cuando se crea o actualiza un recurso.',
      theory:
        'Una petición HTTP también tiene partes: una línea de solicitud (método + ruta), cabeceras y, opcionalmente, un cuerpo. No todas las peticiones tienen cuerpo: un GET simple no lo necesita, pero cuando quieres enviar datos al servidor (crear una reseña, registrarte, subir un archivo) esos datos van en el cuerpo de la petición.\n\nLa ruta identifica el recurso sobre el que actúas, no transporta los datos del recurso. Las cabeceras pueden incluir metadatos sobre el contenido (como su tipo), pero no los datos en sí. El código de estado solo existe en las respuestas, nunca en las peticiones.\n\nEntender dónde colocar los datos es clave para depurar: si tu backend no recibe lo que esperaba, lo primero es revisar si enviaste el cuerpo correctamente y si lo marcaste con el Content-Type adecuado.',
      concepts: ['cuerpo de la petición', 'método HTTP', 'ruta', 'cabeceras de petición'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: '¿Dónde viajan los datos al crear algo?',
        brief:
          'Cuando envías datos al servidor para crear un recurso, ¿en qué parte de la petición van?',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['http'],
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
            'Cuando creas algo nuevo en el servidor (por ejemplo, envías una reseña de película), ¿en qué parte de la petición HTTP viajan normalmente esos datos?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'En la ruta (URL), como parte del path.' },
              { id: 'b', text: 'En el cuerpo (body) de la petición.' },
              { id: 'c', text: 'En una cabecera personalizada.' },
              { id: 'd', text: 'En el código de estado de la petición.' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'Los datos de creación o actualización viajan en el cuerpo (body) de la petición, habitualmente con Content-Type: application/json. La ruta identifica el endpoint; las cabeceras aportan metadatos; y los códigos de estado solo existen en las respuestas.',
          },
        },
      },
    },
  ],
};
