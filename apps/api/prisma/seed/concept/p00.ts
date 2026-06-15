import { type PhaseSeed } from '../content-types.js';

export const conceptP00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Cliente, servidor y el viaje de la petición',
  objective:
    'Construir el modelo mental: quién pide y quién responde, y qué viaja por la red.',
  unlockedSkills: ['http'],
  projects: [],
  lessons: [
    {
      title: 'Cliente y servidor: dos roles',
      objective:
        'Entender qué es un cliente, qué es un servidor y por qué la web separa estos dos roles.',
      theory:
        'En la web, toda comunicación ocurre entre dos actores con roles bien definidos. El **cliente** es quien solicita información o recursos: normalmente un navegador, una app móvil o cualquier programa que quiera obtener o enviar datos. El **servidor** es quien espera peticiones, las procesa y devuelve una respuesta. Nunca inicia la conversación; reacciona.\n\n' +
        'Esta separación existe por una razón práctica: centralizar la lógica y los datos en un lugar controlado (el servidor) mientras los clientes —que pueden ser millones y de muchos tipos— solo consumen lo que necesitan. El servidor no sabe ni le importa si quien le habla es un navegador, una app o un script.\n\n' +
        'El modelo es asimétrico: **siempre es el cliente quien da el primer paso**. El servidor no puede "llamar" a un cliente por iniciativa propia en el modelo clásico HTTP (existen técnicas especiales para eso, pero son excepciones). Esta asimetría es fundamental y conviene grabársela desde el principio.',
      concepts: ['cliente', 'servidor', 'roles', 'asimetría'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: '¿Quién habla primero?',
        brief: 'Identifica cuál de los dos roles inicia siempre la comunicación en la web.',
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
          prompt: '¿Quién inicia siempre la conversación en la web?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'El cliente' },
              { id: 'b', text: 'El servidor' },
              { id: 'c', text: 'Ambos a la vez' },
              { id: 'd', text: 'El navegador del servidor' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'En HTTP clásico, siempre es el cliente quien abre la conversación enviando una petición. El servidor espera pasivamente y solo responde cuando recibe una. Nunca toma la iniciativa.',
          },
        },
      },
    },
    {
      title: 'El viaje de una petición (HTTP)',
      objective:
        'Conocer las partes que componen una petición HTTP y una respuesta HTTP, y saber qué rol juega cada una.',
      theory:
        'Cuando un cliente quiere hablar con un servidor, envía una **petición HTTP**. Esa petición tiene cuatro partes: el **método** (qué quiere hacer: GET para obtener, POST para enviar datos, etc.), la **ruta** (a qué recurso concreto se dirige, como `/usuarios/42`), las **cabeceras** (metadatos: tipo de contenido esperado, idioma, token de autenticación…) y, opcionalmente, un **cuerpo** con datos adicionales (por ejemplo, el JSON con el formulario que acaba de rellenar el usuario).\n\n' +
        'El servidor procesa la petición y devuelve una **respuesta**. Esta también tiene cabeceras, un cuerpo opcional con el contenido solicitado, y lo más importante para saber si todo fue bien: el **código de estado**. Es un número de tres cifras que resume el resultado. Los 2xx indican éxito (200 OK, 201 Created), los 4xx indican error del cliente (404 Not Found, 401 Unauthorized) y los 5xx indican error del servidor (500 Internal Server Error).\n\n' +
        'Memorizar todos los códigos no es el objetivo; lo importante es el concepto: el código de estado es la forma estándar y universal que tiene el servidor de decirle al cliente "te entendí y esto pasó". Es el primer dato que cualquier cliente debe leer antes de tocar el cuerpo de la respuesta.',
      concepts: ['petición HTTP', 'método', 'ruta', 'cabeceras', 'cuerpo', 'código de estado', 'respuesta HTTP'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: 'Anatomía de la respuesta',
        brief: 'Identifica qué parte de la respuesta HTTP indica si la petición tuvo éxito o falló.',
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
            'Haces una petición al servidor para obtener un perfil de usuario. ¿Qué parte de la respuesta te dice de forma estándar si todo fue bien o algo falló?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'El método HTTP' },
              { id: 'b', text: 'La ruta del recurso' },
              { id: 'c', text: 'El código de estado' },
              { id: 'd', text: 'Una cabecera cualquiera' },
            ],
            correctIds: ['c'],
            multiple: false,
            explanation:
              'El código de estado es un número de tres cifras en la respuesta que resume el resultado de forma universal: 2xx es éxito, 4xx es error del cliente y 5xx es error del servidor. Es lo primero que debe comprobar cualquier cliente antes de procesar el cuerpo.',
          },
        },
      },
    },
  ],
};
