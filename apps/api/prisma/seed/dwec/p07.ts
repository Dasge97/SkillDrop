import { type PhaseSeed } from '../content-types.js';

export const dwecP07: PhaseSeed = {
  code: 'FASE 7',
  title: 'Asíncrono y fetch',
  objective:
    'Comunicar el frontend de ReseñApp con un servidor de forma asíncrona usando fetch, gestionar los estados de carga y error, y procesar datos JSON con async/await.',
  unlockedSkills: ['async', 'fetch-api'],
  projects: ['Integración de ReseñApp con una API pública de películas/series'],
  lessons: [
    {
      title: 'Callbacks, promesas y async/await',
      objective:
        'Comprender por qué JavaScript necesita asincronía, cómo evolucionó de callbacks a promesas y cómo async/await simplifica la escritura de código asíncrono.',
      theory:
        'JavaScript es monohilo: solo puede ejecutar una cosa a la vez. Para no bloquear el hilo principal mientras espera una respuesta de red, usa un modelo basado en eventos y una cola de tareas. Los callbacks fueron la primera solución: pasas una función que se invoca cuando la operación termina. El problema es que los callbacks anidados producen el infame "callback hell", código en forma de pirámide difícil de leer y de manejar de errores.\n\nLas Promesas (ES2015) resuelven esto con una interfaz encadenable. Una Promise representa un valor que existirá en el futuro: puede estar pendiente, resuelta con éxito (fulfilled) o rechazada con un error (rejected). Se encadenan con .then() para el caso de éxito y .catch() para el error, lo que aplana el código y centraliza el manejo de errores.\n\nAsync/await (ES2017) es azúcar sintáctico sobre promesas que hace que el código asíncrono se lea como código síncrono. Una función marcada como async siempre devuelve una Promesa. Dentro de ella, await pausa la ejecución de esa función (sin bloquear el hilo) hasta que la Promesa se resuelva. El manejo de errores se hace con try/catch, igual que en código síncrono, lo que lo hace muy legible.\n\nEl Event Loop es el mecanismo que orquesta todo esto: mientras espera respuestas de red o timers, el hilo principal puede atender otros eventos (clics, teclado). Entender este modelo conceptual evita errores como intentar leer el resultado de un fetch antes de que haya llegado.',
      concepts: [
        'Monohilo y Event Loop',
        'Callbacks y callback hell',
        'Promise (pending / fulfilled / rejected)',
        '.then() y .catch()',
        'async / await',
        'try / catch con async',
        'Promise.all()',
      ],
      tools: ['VS Code', 'DevTools Console', 'DevTools Network'],
      estimatedTimeMinutes: 40,
    },
    {
      title: 'fetch, JSON y estados de la UI',
      objective:
        'Realizar peticiones HTTP con fetch, procesar respuestas JSON y reflejar en la interfaz los estados de carga, éxito y error.',
      theory:
        'fetch() es la API nativa del navegador para hacer peticiones HTTP. Devuelve una Promesa que se resuelve con un objeto Response cuando el servidor contesta, incluso si el código de estado es 404 o 500. Por eso es obligatorio comprobar response.ok (o response.status) antes de parsear el cuerpo: un fetch que "no lanza error" no significa que la petición haya tenido éxito. El cuerpo se extrae con response.json(), que también es asíncrono y devuelve otra Promesa.\n\nCualquier petición a una API tiene tres estados que la interfaz debe reflejar: cargando (el usuario debe saber que algo ocurre, normalmente con un spinner o texto), éxito (se muestran los datos) y error (se informa al usuario con un mensaje útil, no un alert genérico). No gestionar estos tres estados es el error más común y el que peor experiencia de usuario produce.\n\nLas cabeceras HTTP y los parámetros de consulta (query params) son la forma de configurar una petición. Para peticiones POST se añade un cuerpo JSON con JSON.stringify() y la cabecera Content-Type: application/json. Entender la diferencia entre GET (lectura) y POST/PUT/DELETE (escritura) es la base de cualquier integración con una API REST.\n\nLas APIs públicas como la de The Movie Database (TMDB) o similar son un banco de pruebas perfecto: tienen datos reales, documentación clara y no requieren servidor propio. Practicar con ellas antes de conectar ReseñApp a la API PHP del curso servidor permite concentrarse en el código cliente sin depender de infraestructura.',
      example:
        '// api.js\nconst BASE_URL = \'https://api.themoviedb.org/3\';\nconst API_KEY = import.meta.env.VITE_TMDB_KEY; // o una variable de entorno\n\nexport async function buscarPeliculas(query) {\n  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);\n  const data = await response.json();\n  return data.results;\n}\n\n// main.js\nasync function cargarCatalogo(query) {\n  const estado = document.querySelector(\'#estado\');\n  const lista = document.querySelector(\'#lista\');\n  try {\n    estado.textContent = \'Cargando...\';\n    lista.innerHTML = \'\';\n    const peliculas = await buscarPeliculas(query);\n    estado.textContent = \'\';\n    peliculas.forEach(p => {\n      const li = document.createElement(\'li\');\n      li.textContent = `${p.title} (${p.release_date?.slice(0,4)})`;\n      lista.appendChild(li);\n    });\n  } catch (err) {\n    estado.textContent = `No se pudieron cargar los resultados: ${err.message}`;\n  }\n}',
      concepts: [
        'fetch() y la Promesa Response',
        'response.ok y response.status',
        'response.json()',
        'JSON.stringify() y JSON.parse()',
        'Estados de la UI: cargando / éxito / error',
        'Query params y cabeceras HTTP',
        'GET vs POST',
        'CORS (concepto)',
      ],
      tools: ['VS Code', 'DevTools Network', 'DevTools Console', 'TMDB API (o similar)'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'ReseñApp conectada: catálogo desde una API pública',
        brief:
          'Conecta ReseñApp a una API pública de películas o series (p. ej. TMDB). Al cargar la página, muestra un catálogo con los títulos más populares. Añade un buscador que filtre resultados llamando a la API. Gestiona visualmente los estados de carga y error.',
        context:
          'ReseñApp necesita un catálogo real de ítems para reseñar. Antes de conectarla a la API PHP del servidor, practicamos la comunicación HTTP con una API pública. El resultado de esta fase será la vista de catálogo funcional de ReseñApp, que en fases siguientes se alimentará de datos propios.',
        objective:
          'Implementar la obtención de datos desde una API externa con fetch, reflejando en la UI los tres estados (cargando, éxito, error) de forma clara y accesible.',
        targetUser: 'Usuario de ReseñApp que quiere explorar el catálogo de títulos disponibles.',
        restrictions: [
          'Usar fetch nativo con async/await; prohibido axios u otras librerías HTTP.',
          'La UI debe mostrar un indicador de carga mientras espera la respuesta.',
          'Los errores de red y de API (status >= 400) deben mostrarse al usuario con un mensaje descriptivo, no con alert().',
          'La API key no debe estar hardcodeada en el código que se sube al repositorio (usar variable de entorno o un archivo .env ignorado por git).',
          'Sin frameworks en esta fase; solo JS vanilla y DOM.',
        ],
        deliverables: [
          'Enlace al repositorio de GitHub con el código de la integración.',
          'Captura de la interfaz mostrando el catálogo cargado correctamente.',
          'Captura de la interfaz mostrando el estado de error (p. ej. con la red desconectada o una key inválida).',
          'Captura de la interfaz mostrando el estado de carga (spinner o texto).',
        ],
        checklist: [
          'Al cargar la página se muestra un indicador de carga y luego el catálogo.',
          'El buscador hace una nueva llamada a la API con cada búsqueda (no filtra en local).',
          'Si la petición falla, aparece un mensaje de error en la UI (no en consola solamente).',
          'response.ok se comprueba antes de llamar a response.json().',
          'La API key no está en el código del repositorio.',
          'No hay console.error como único manejo de error.',
        ],
        commonMistakes: [
          'No comprobar response.ok y parsear el JSON de una respuesta 401 o 404 como si fuera correcta.',
          'Leer el resultado de fetch sin await y obtener una Promesa en lugar del valor.',
          'Olvidar el estado de carga, dejando la pantalla en blanco durante la petición.',
          'Subir la API key al repositorio y luego tener que revocarla.',
          'Mostrar solo el error en consola sin informar al usuario en la UI.',
          'No limpiar el listado anterior antes de renderizar los nuevos resultados, acumulando items.',
        ],
        difficulty: 3,
        timeLimitMinutes: 100,
        skills: ['async', 'fetch-api', 'dom'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'El catálogo se carga desde la API, el buscador funciona y los datos se muestran correctamente en el DOM.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'La lógica de fetch está separada de la lógica de presentación (DOM); async/await usado de forma limpia y sin mezclar con .then().',
          },
          {
            name: 'Manejo de errores y estados',
            description:
              'Se gestionan explícitamente los tres estados (cargando, éxito, error) con feedback visible al usuario; response.ok se verifica antes de parsear.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'API key fuera del repositorio, .gitignore correcto, commits descriptivos y sin código muerto.',
          },
        ],
      },
    },
  ],
};
