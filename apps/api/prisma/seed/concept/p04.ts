import { type PhaseSeed } from '../content-types.js';

export const conceptP04: PhaseSeed = {
  code: 'FASE 4',
  title: 'El cliente pide: fetch',
  objective:
    'La otra mitad del viaje: el cliente pide datos de forma asíncrona y gestiona carga, éxito y error.',
  unlockedSkills: ['async', 'fetch-api'],
  projects: [],
  lessons: [
    {
      title: '¿Qué es fetch y por qué es asíncrono?',
      objective:
        'Entender qué hace fetch y por qué necesita ser asíncrono para que la página no se congele.',
      theory:
        'fetch es la función nativa del navegador (y de Node.js moderno) para hacer peticiones HTTP desde el cliente. Recibe una URL y devuelve una Promesa: una promesa de que, en algún momento futuro, llegará la respuesta del servidor.\n\nLa clave está en que esa respuesta no llega de forma instantánea: el navegador tiene que enviar la petición por la red, el servidor tiene que procesarla y devolver datos, y eso puede tardar milisegundos o varios segundos. Si ese tiempo de espera bloqueara el hilo principal de JavaScript, la página entera quedaría congelada: no podrías hacer scroll, no podrías escribir en un campo, no podría animarse nada.\n\nPor eso fetch es asíncrono: el navegador lanza la petición y, sin esperar la respuesta, sigue ejecutando el resto del código. Cuando la respuesta llega, JavaScript lo notifica y ejecuta el código que habías preparado para gestionarla. Esto es lo que hace posible que una aplicación web sea fluida mientras carga datos en segundo plano.\n\nEl flujo completo es: fetch(url) → devuelve una Promesa → cuando resuelve, obtienes un objeto Response → llamas a .json() (también asíncrono) para parsear el cuerpo → y entonces tienes los datos.',
      concepts: ['fetch', 'Promesa', 'asincronía', 'hilo principal', 'Response'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Qué hace fetch y por qué es asíncrono?',
        brief:
          'Explica qué hace fetch y por qué es ASÍNCRONO: qué problema evita que la página se congele.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['async', 'fetch-api'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'short',
          prompt:
            'Explica qué hace fetch y por qué es ASÍNCRONO. ¿Qué problema concreto evita que la página se congele mientras espera la respuesta del servidor?',
          solution:
            'fetch envía una petición HTTP desde el cliente y devuelve una Promesa con la respuesta futura. Es asíncrono porque la respuesta del servidor no llega de inmediato: si tuviéramos que esperar bloqueados, el hilo principal de JavaScript quedaría congelado y la página no podría responder a ninguna interacción del usuario (scroll, clics, animaciones). Al ser asíncrono, el navegador lanza la petición y sigue ejecutando otro código; cuando llega la respuesta, la Promesa se resuelve y podemos procesarla.',
        },
      },
    },
    {
      title: 'async/await: esperar sin bloquear',
      objective:
        'Usar async/await para consumir una promesa de forma legible y controlar el orden de ejecución.',
      theory:
        'Las Promesas se pueden encadenar con .then(), pero async/await ofrece una sintaxis que parece código síncrono aunque sigue siendo asíncrono por dentro. Una función marcada con async siempre devuelve una Promesa. Dentro de ella, await "pausa" esa función (sin bloquear el hilo) hasta que la Promesa que le sigues resuelve, y entonces te da el valor directamente.\n\nEl orden de ejecución es lo que suelen confundir los principiantes: el código ANTES del primer await se ejecuta de forma inmediata y síncrona. El código DESPUÉS del await se ejecuta solo cuando la Promesa ha resuelto. Por eso si quieres imprimir "pidiendo..." antes de recibir los datos, debes hacerlo antes del await.\n\nEsto permite escribir código asíncrono que se lee de arriba a abajo, sin anidar .then() dentro de .then(). Además, puedes envolver el await en un try/catch para capturar errores de red o de servidor de forma clara.',
      concepts: ['async', 'await', 'Promesa', 'orden de ejecución', 'try/catch'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Orden correcto con async/await',
        brief:
          'Usa async/await para esperar el resultado de getReviews() e imprime los mensajes en el orden correcto.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['async', 'fetch-api'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Tienes getReviews() que devuelve una promesa. Imprime \'pidiendo...\' ANTES, usa async/await para esperar el resultado, e imprime las reseñas y luego \'listo\'.',
          starterCode: `function getReviews() {
  return Promise.resolve([{ titulo: 'Inception' }]);
}
// TODO: async/await con los console.log en el orden correcto`,
          solution: `function getReviews() {
  return Promise.resolve([{ titulo: 'Inception' }]);
}

async function cargar() {
  console.log('pidiendo...');
  const reviews = await getReviews();
  console.log(reviews);
  console.log('listo');
}

cargar();`,
        },
      },
    },
    {
      title: 'Estados de una petición: carga, éxito y error',
      objective:
        'Saber qué debe mostrar la interfaz en cada momento del ciclo de vida de una petición fetch.',
      theory:
        'Toda petición asíncrona pasa por tres estados bien diferenciados. Primero está el estado de carga (loading): la petición se ha enviado pero aún no hay respuesta. Segundo, el estado de éxito (success): la respuesta llegó con datos válidos. Tercero, el estado de error (error): algo falló, ya sea un error de red, un timeout o una respuesta del servidor con código de error.\n\nDiseñar una interfaz correcta significa pensar en los tres estados. Si ignoras el estado de carga y simplemente muestras la lista vacía mientras esperas, el usuario no sabe si la aplicación está funcionando o rota. Un spinner o un esqueleto de contenido indican actividad y reducen la ansiedad del usuario.\n\nEl estado de error también merece atención: si muestras nada o simplemente la lista vacía cuando algo ha fallado, el usuario no puede saber qué ocurrió ni si debe reintentar. Un mensaje de error claro es siempre mejor que el silencio.',
      concepts: ['estado de carga', 'spinner', 'estado de éxito', 'estado de error', 'UX'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: 'Estado correcto mientras llegan los datos',
        brief:
          'Elige qué debería mostrar la interfaz mientras espera la respuesta de una API.',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['async', 'fetch-api'],
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
            'Mientras llega la respuesta de una API, ¿qué debería mostrar la interfaz?',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'Un estado de carga o spinner que indique que hay actividad',
              },
              {
                id: 'b',
                text: 'La lista vacía, como si no hubiera nada todavía',
              },
              {
                id: 'c',
                text: 'Un mensaje de error, porque aún no hay datos',
              },
              {
                id: 'd',
                text: 'Nada; esperar en silencio hasta que lleguen los datos',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Mientras la petición está en vuelo, la interfaz debe mostrar un indicador de carga (spinner, skeleton, barra de progreso…). Mostrar la lista vacía confunde al usuario, que no sabe si hay datos o no. Mostrar un error es incorrecto porque aún no ha ocurrido ningún fallo. El silencio total hace que la aplicación parezca rota o colgada.',
          },
        },
      },
    },
  ],
};
