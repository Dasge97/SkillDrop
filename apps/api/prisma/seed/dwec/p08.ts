import { type PhaseSeed } from '../content-types.js';

export const dwecP08: PhaseSeed = {
  code: 'FASE 8',
  title: 'Conecta con tu API (ReseñApp)',
  objective:
    'Integrar el frontend de ReseñApp con la API REST PHP construida en el curso de servidor, gestionando autenticación, cabeceras y errores HTTP desde el cliente.',
  unlockedSkills: ['fetch-api'],
  projects: [
    'Login con token en ReseñApp',
    'Listado de reseñas desde la API real',
    'Formulario de nueva reseña (POST)',
    'Edición y borrado de reseña propia',
  ],
  lessons: [
    {
      title: 'Fetch, cabeceras y autenticación',
      objective:
        'Enviar peticiones HTTP autenticadas con fetch, gestionar tokens en cabeceras y manejar respuestas de error.',
      theory:
        'La Fetch API es la forma nativa de hacer peticiones HTTP en el navegador. A diferencia de XMLHttpRequest, devuelve Promesas y tiene una sintaxis limpia que se combina bien con async/await. La función fetch() acepta una URL y un objeto de opciones donde se especifican el método (GET, POST, PUT, DELETE), las cabeceras y el cuerpo.\n\nCuando la API requiere autenticación por token, el flujo es: primero llamas al endpoint /auth/login con las credenciales del usuario; si son correctas, recibes un token (normalmente JWT) que debes guardar —en memoria o en localStorage— y adjuntar en todas las peticiones posteriores dentro de la cabecera Authorization: Bearer <token>.\n\nLas cabeceras se configuran con el objeto Headers o directamente en el campo headers de las opciones de fetch. Para enviar JSON hay que añadir Content-Type: application/json y convertir el cuerpo con JSON.stringify(). Para leer la respuesta, usas response.json() que también devuelve una Promesa.\n\nEl manejo de errores HTTP requiere atención especial: fetch solo lanza un error de red si la petición no llega al servidor. Códigos como 401, 403 o 500 llegan como respuestas "correctas" para fetch; debes comprobar response.ok o response.status y lanzar el error tú mismo para gestionarlo en el bloque catch.',
      example:
        'async function login(email: string, password: string) {\n  const res = await fetch(\'/api/auth/login\', {\n    method: \'POST\',\n    headers: { \'Content-Type\': \'application/json\' },\n    body: JSON.stringify({ email, password }),\n  });\n  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);\n  const { token } = await res.json();\n  localStorage.setItem(\'token\', token);\n  return token;\n}\n\nasync function getReviews() {\n  const token = localStorage.getItem(\'token\');\n  const res = await fetch(\'/api/reviews\', {\n    headers: { Authorization: `Bearer ${token}` },\n  });\n  if (!res.ok) throw new Error(`Error ${res.status}`);\n  return res.json();\n}',
      concepts: [
        'fetch()',
        'async/await',
        'Headers',
        'Authorization Bearer',
        'response.ok',
        'response.status',
        'JSON.stringify / response.json()',
        'try/catch en async',
      ],
      tools: ['fetch API', 'localStorage', 'DevTools → Network'],
      estimatedTimeMinutes: 40,
    },
    {
      title: 'CRUD completo y CORS desde el cliente',
      objective:
        'Implementar las operaciones GET, POST, PUT y DELETE contra la API de ReseñApp y entender qué es CORS y cómo afecta al cliente.',
      theory:
        'Con el login resuelto, el siguiente paso es construir las funciones que consuman el resto de endpoints: GET /reviews para listar, POST /reviews para crear, PUT /reviews/:id para editar y DELETE /reviews/:id para borrar. Cada función debe adjuntar el token, comprobar response.ok y devolver o lanzar según el resultado. Agrupar estas funciones en un módulo (reviewsApi.js) mantiene el código organizado y facilita cambiar la URL base sin tocar los componentes.\n\nCORs (Cross-Origin Resource Sharing) es un mecanismo de seguridad del navegador que bloquea peticiones a un origen diferente al de la página a menos que el servidor lo autorice explícitamente. Cuando el frontend corre en localhost:5173 y la API en localhost:8000, el navegador comprueba si la respuesta incluye la cabecera Access-Control-Allow-Origin. Si no la encuentra, la petición se rechaza en el cliente aunque llegue al servidor. La solución está siempre en el servidor (PHP en este caso), no en el frontend; pero como alumno de cliente necesitas saber leer el error en la consola y comunicar al equipo de backend qué cabeceras faltan.\n\nPara peticiones con cabeceras personalizadas como Authorization, el navegador envía primero una petición OPTIONS (preflight) para pedir permiso. El servidor debe responder con Access-Control-Allow-Headers: Authorization, Content-Type. Entender este flujo evita horas de depuración.',
      concepts: [
        'CRUD con fetch',
        'PUT y DELETE',
        'Módulo de API (service layer)',
        'CORS',
        'preflight OPTIONS',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
      ],
      tools: ['fetch API', 'DevTools → Network', 'DevTools → Console'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'ReseñApp conectada a la API real',
        brief:
          'Conecta el frontend de ReseñApp a la API PHP del curso de servidor: implementa el login, lista las reseñas reales del backend y permite crear una nueva reseña desde el formulario.',
        context:
          'Hasta ahora ReseñApp usaba datos inventados en el código. Es el momento de hacer que la aplicación funcione con datos reales: el mismo backend que construiste (o construirás) en el curso de servidor expone los endpoints /auth/login, GET /reviews y POST /reviews.',
        objective:
          'Que el alumno complete el ciclo cliente-servidor: autenticarse con credenciales reales, mostrar reseñas obtenidas de la base de datos y persistir una nueva reseña via POST.',
        targetUser: 'Usuario autenticado de ReseñApp que quiere consultar y añadir reseñas.',
        restrictions: [
          'Usar fetch nativo (no axios ni otras librerías externas).',
          'El token debe guardarse y enviarse en la cabecera Authorization: Bearer <token>.',
          'Si el servidor devuelve 401, mostrar un mensaje de sesión expirada y redirigir al login.',
          'Las llamadas a la API deben estar en un módulo separado (ej. src/api/reviews.js), no mezcladas con la lógica de UI.',
          'No hardcodear credenciales en el código fuente.',
        ],
        deliverables: [
          'Repositorio con el código del frontend en una rama o carpeta identificable.',
          'Módulo src/api/ con las funciones de llamada a la API.',
          'Pantalla de login funcional contra el endpoint /auth/login.',
          'Listado de reseñas cargado desde GET /reviews con el token.',
          'Formulario que persiste una nueva reseña via POST /reviews.',
          'Capturas de pantalla de: login exitoso, listado con datos reales y creación correcta (red tab incluida).',
        ],
        checklist: [
          'El formulario de login llama a /auth/login y guarda el token.',
          'Las peticiones a /reviews incluyen Authorization: Bearer <token>.',
          'El listado muestra datos reales de la base de datos.',
          'Crear una reseña desde el formulario la persiste en el servidor.',
          'Los errores HTTP (401, 404, 500) se capturan y muestran al usuario.',
          'Las funciones de API están en un módulo separado.',
          'No hay credenciales hardcodeadas.',
        ],
        commonMistakes: [
          'Olvidar el Content-Type: application/json en el POST y que el backend reciba el body vacío.',
          'No comprobar response.ok y tratar una respuesta 401 como éxito.',
          'Guardar el token en una variable local que se pierde al recargar la página.',
          'Mezclar la lógica de fetch con la manipulación del DOM en la misma función.',
          'Confundir el error de CORS con un error de autenticación.',
        ],
        difficulty: 4,
        timeLimitMinutes: 120,
        skills: ['fetch-api', 'async'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'Login, listado y creación funcionan contra la API real sin errores en consola.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Código legible, sin duplicación, con nombres de variables y funciones descriptivos.',
          },
          {
            name: 'Separación en módulo de API',
            description:
              'Las llamadas fetch están aisladas en un service layer, no mezcladas con la UI.',
          },
          {
            name: 'Manejo de errores HTTP',
            description:
              'Todos los códigos de error relevantes (401, 403, 404, 500) se capturan y comunican al usuario.',
          },
        ],
      },
    },
  ],
};
