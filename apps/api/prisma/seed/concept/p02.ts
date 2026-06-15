import { type PhaseSeed } from '../content-types.js';

export const conceptP02: PhaseSeed = {
  code: 'FASE 2',
  title: 'Cómo viajan los datos',
  objective:
    'Saber dónde poner cada dato: en la ruta, en la query o en el cuerpo.',
  unlockedSkills: ['http', 'api-rest'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'La query string: filtros y parámetros opcionales',
      objective:
        'Distinguir cuándo un dato debe ir en la query string y no en el cuerpo.',
      theory:
        'Cuando haces una petición HTTP, los datos pueden viajar de varias formas: en la propia ruta (p. ej. /reviews/42), en la query string (p. ej. ?cat=cine), en las cabeceras o en el cuerpo. Elegir mal el lugar hace que la API sea confusa o que el navegador rompa el caché sin motivo.\n\nLa query string es la parte de la URL que va después del signo ?. Está pensada para datos opcionales que modifican o filtran el resultado de una petición GET: paginación, orden, búsqueda, categoría... El servidor los recibe en req.query y pueden llegar varios a la vez separados por &, por ejemplo ?cat=cine&orden=reciente.\n\nEl cuerpo (body) se reserva para datos de escritura: cuando envías un formulario, creas un recurso nuevo (POST) o actualizas uno existente (PUT/PATCH). Los navegadores no incluyen cuerpo en las peticiones GET, y los proxies y CDN no cachean respuestas cuya petición tiene cuerpo.\n\nLas cabeceras llevan metadatos de la comunicación: tipo de contenido, token de autenticación, idioma aceptado... No son el sitio adecuado para parámetros de negocio como la categoría de una búsqueda.',
      concepts: ['query-string', 'body', 'cabeceras', 'GET', 'filtros'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Dónde va el filtro de categoría?',
        brief:
          'Para FILTRAR una búsqueda por categoría, ¿dónde viajan normalmente los datos?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http', 'api-rest'],
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
            'Quieres listar las reseñas de la categoría "cine". ¿Dónde pones ese dato al hacer la petición GET /reviews?',
          runner: 'none',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'En la query string, p. ej. GET /reviews?cat=cine',
              },
              {
                id: 'b',
                text: 'En el cuerpo de la petición, como JSON { "cat": "cine" }',
              },
              {
                id: 'c',
                text: 'En una cabecera personalizada, p. ej. X-Categoria: cine',
              },
              {
                id: 'd',
                text: 'En el código de estado de la petición',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Los filtros opcionales van en la query string (?cat=cine) porque forman parte de la URL, el servidor los lee en req.query y el navegador/CDN puede cachear la respuesta. El cuerpo no aplica en GET; las cabeceras son para metadatos de protocolo (auth, content-type…), no para parámetros de negocio; y el código de estado es solo de respuesta, nunca de petición.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Leer la query string en el servidor',
      objective:
        'Acceder a req.query dentro de un handler y devolver el valor recibido.',
      theory:
        'En el mini-servidor del curso, cada petición llega como un objeto req con cuatro propiedades: method, path, headers y query. La query string ya llega parseada como un objeto: si la URL es /reviews?cat=cine entonces req.query.cat vale "cine".\n\nEl handler (la función que registras con route()) recibe ese objeto y decide qué respuesta enviar. Para responder usas el objeto res: res.status(200) fija el código HTTP, res.json({ clave: valor }) serializa el objeto a JSON y envía la respuesta. Los dos métodos se pueden encadenar: res.status(200).json({ categoria: req.query.cat }).\n\nSi el parámetro de query no existe, req.query.cat valdrá undefined. En producción deberías validarlo, pero en este ejercicio asumimos que siempre llega.\n\nEsta lectura directa de req.query es exactamente lo que hacen frameworks como Express.js, Fastify o Hono: abstraen el parseo de la URL y te dan el objeto listo para usar.',
      concepts: ['req.query', 'handler', 'res.json', 'res.status'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Responde con la categoría recibida',
        brief:
          'Lee la categoría de req.query.cat y responde 200 con JSON { categoria: <valor> }.',
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
            'El servidor recibe GET /reviews?cat=cine. Completa el handler para que responda con código 200 y el JSON { "categoria": "cine" } (usando el valor real de req.query.cat).',
          runner: 'server',
          sample: {
            method: 'GET',
            path: '/reviews',
            headers: {},
            query: { cat: 'cine' },
            body: null,
          },
          starterCode:
            'route((req, res) => {\n  // TODO: lee req.query.cat y responde 200 con { categoria }\n});',
          solution:
            'route((req, res) => {\n  res.status(200).json({ categoria: req.query.cat });\n});',
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'El cuerpo de la petición: datos de escritura',
      objective:
        'Identificar que en POST los datos enviados se leen desde req.body.',
      theory:
        'Cuando un cliente quiere crear o modificar algo en el servidor, envía los datos en el cuerpo de la petición (body). El cuerpo viaja junto a la petición HTTP, separado de las cabeceras por una línea en blanco, y puede ser JSON, texto, form-data o binario.\n\nEn los verbos de escritura como POST, PUT o PATCH, el servidor necesita saber qué recurso crear o modificar. Esa información (el título de una reseña, el precio de un producto…) no cabe bien en la URL porque puede ser larga, contener caracteres especiales o ser privada.\n\nEn el mini-servidor del curso, el body ya llega parseado como objeto JavaScript en req.body. Si el cliente envía { "titulo": "Inception" } como JSON, en el handler puedes leer req.body.titulo y obtienes el string "Inception".\n\nEs importante no confundir los tres orígenes: req.query para filtros en la URL, req.body para datos de escritura y req.headers para metadatos de protocolo. Mezclarlos es uno de los errores más frecuentes al diseñar una API.',
      concepts: ['body', 'req.body', 'POST', 'PUT', 'PATCH', 'JSON'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿De dónde lees el título en un POST?',
        brief:
          'En POST /reviews con cuerpo { "titulo": "Inception" }, ¿de dónde lees el título en el servidor?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http', 'api-rest'],
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
            'El cliente hace POST /reviews con el cuerpo JSON { "titulo": "Inception" }. En el handler del servidor, ¿cómo lees el título?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: 'req.body.titulo' },
              { id: 'b', text: 'req.query.titulo' },
              { id: 'c', text: 'req.headers.titulo' },
              { id: 'd', text: 'req.path' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'El cuerpo de la petición se lee en req.body. req.query solo tiene los parámetros de la URL (?clave=valor); req.headers trae metadatos del protocolo (Content-Type, Authorization…); y req.path es simplemente la ruta "/reviews", sin datos de negocio.',
          },
        },
      },
    },
  ],
};
