import { type PhaseSeed } from '../content-types.js';

export const dwecP10: PhaseSeed = {
  code: 'FASE 10',
  title: 'Vue a fondo: SPA',
  objective: 'Construir una SPA completa con Vue 3 y Vue Router que consuma la API de ReseñApp.',
  unlockedSkills: ['vue', 'spa'],
  projects: [
    'SPA ReseñApp con Vue Router',
    'Vista catálogo con filtros',
    'Vista detalle de ítem con reseñas',
    'Vista login con formulario validado',
    'Servicio de API reutilizable',
  ],
  lessons: [
    {
      title: 'Estado, composición y Vue Router',
      objective: 'Organizar la SPA con composables, props/emits y rutas con Vue Router.',
      theory:
        'Vue 3 con la Composition API estructura la lógica en composables: funciones reutilizables que agrupan estado reactivo y comportamiento relacionado. `ref` y `reactive` crean estado reactivo; `computed` deriva valores; `watch` reacciona a cambios. Separar la lógica en composables (`useReseñas`, `useAuth`) hace que los componentes sean más delgados y fáciles de testear.\n\nLa comunicación entre componentes sigue dos vías: el padre pasa datos al hijo mediante `props` y el hijo notifica al padre mediante `emits`. Para estado compartido entre componentes no relacionados, el patrón más sencillo es un composable con estado en módulo (singleton reactivo); para aplicaciones mayores se usa Pinia.\n\nVue Router añade navegación del lado del cliente sin recargar la página. Se define un array de rutas (path → componente) y se monta con `createRouter`. `<RouterView>` renderiza el componente de la ruta activa y `<RouterLink>` genera enlaces sin recarga. Los parámetros de ruta (`:id`) se leen con `useRoute().params` dentro del componente.\n\nBuild con Vite: `npm run dev` arranca el servidor de desarrollo con HMR instantáneo; `npm run build` genera el bundle optimizado en `dist/`. El archivo `vite.config.ts` permite configurar alias de rutas (`@/` → `src/`) para importaciones limpias en proyectos grandes.',
      example:
        '// composable useReseñas.ts\nimport { ref } from \'vue\';\nconst lista = ref([]);\nexport function useReseñas() {\n  async function cargar() {\n    const res = await fetch(\'/api/items\');\n    lista.value = await res.json();\n  }\n  return { lista, cargar };\n}\n\n// router/index.ts\nimport { createRouter, createWebHistory } from \'vue-router\';\nexport const router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: \'/\', component: () => import(\'../views/CatalogoView.vue\') },\n    { path: \'/item/:id\', component: () => import(\'../views/DetalleView.vue\') },\n    { path: \'/login\', component: () => import(\'../views/LoginView.vue\') },\n  ],\n});',
      concepts: ['Composition API', 'ref', 'reactive', 'computed', 'composable', 'props', 'emits', 'Vue Router', 'createRouter', 'RouterView', 'RouterLink', 'useRoute', 'Vite', 'lazy loading de rutas'],
      tools: ['Vue 3', 'Vue Router', 'Vite', 'VS Code + Volar'],
      estimatedTimeMinutes: 50,
    },
    {
      title: 'Consumo de API, formularios y validación en Vue',
      objective: 'Conectar la SPA con la API PHP mediante fetch/axios, gestionar formularios con v-model y validar entradas.',
      theory:
        'En Vue la forma idiomática de sincronizar un campo de formulario con una variable reactiva es `v-model`. Para un `<input>` equivale a `:value="campo" @input="campo = $event.target.value"`. Con la Composition API se declara el campo con `ref(\'\')` y se vincula directamente. El evento `@submit.prevent` captura el envío sin recargar la página.\n\nLa validación puede ser simple (comprobar antes de enviar) o reactiva (mostrar mensajes mientras se escribe). Un patrón práctico: objeto `errors` reactivo que se rellena en una función `validar()` y se vacía al inicio de cada validación. Los mensajes de error se muestran con `v-if` junto a cada campo y deben ser descriptivos para que el usuario sepa qué corregir.\n\nPara el consumo de la API se recomienda centralizar las llamadas en un módulo de servicio (`src/services/api.ts`) que exponga funciones tipadas: `getItems()`, `getItem(id)`, `login(credenciales)`, `postReseña(datos)`. Así el componente solo llama a la función y maneja el estado de carga y el posible error, sin conocer la URL ni los headers.\n\nAxios simplifica la gestión de headers y la transformación automática de JSON, pero fetch nativo es suficiente para esta SPA. En ambos casos hay que gestionar el token JWT: guardarlo en memoria o localStorage tras el login y adjuntarlo como `Authorization: Bearer <token>` en las peticiones protegidas.',
      example:
        '// services/api.ts\nconst BASE = import.meta.env.VITE_API_URL;\nexport async function getItems(): Promise<Item[]> {\n  const res = await fetch(`${BASE}/items`);\n  if (!res.ok) throw new Error(\'Error al cargar ítems\');\n  return res.json();\n}\n\n// LoginView.vue (fragmento)\nconst email = ref(\'\');\nconst password = ref(\'\');\nconst errors = reactive({ email: \'\', password: \'\' });\nfunction validar() {\n  errors.email = email.value.includes(\'@\') ? \'\' : \'Email inválido\';\n  errors.password = password.value.length >= 6 ? \'\' : \'Mínimo 6 caracteres\';\n  return !errors.email && !errors.password;\n}\nasync function enviar() {\n  if (!validar()) return;\n  await login({ email: email.value, password: password.value });\n}',
      concepts: ['v-model', 'v-if', 'v-for', 'submit.prevent', 'validación reactiva', 'servicio de API', 'fetch', 'axios', 'JWT', 'Authorization header', 'import.meta.env'],
      tools: ['Vue 3', 'Vite', 'fetch API', 'axios (opcional)'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'SPA ReseñApp: catálogo, detalle y login',
        brief: 'Construye la SPA de ReseñApp con Vue 3 y Vue Router. Debe incluir tres vistas funcionales (catálogo, detalle de ítem con sus reseñas, y login) conectadas a la API PHP.',
        context: 'ReseñApp es una plataforma de reseñas (películas, series, juegos). La API PHP ya está construida y expone endpoints REST. El reto es la capa cliente: una SPA que consuma esa API, gestione la navegación entre vistas y permita al usuario iniciar sesión para dejar reseñas.',
        objective: 'Implementar una SPA Vue funcional con Vue Router y consumo real de la API, con formulario de login validado y navegación entre las tres vistas principales.',
        targetUser: 'Usuario de ReseñApp que navega el catálogo, consulta el detalle de un ítem y puede iniciar sesión.',
        restrictions: [
          'Vue 3 con Composition API (no Options API).',
          'Vue Router con al menos tres rutas: /, /item/:id y /login.',
          'Centralizar las llamadas a la API en un módulo src/services/api.ts.',
          'El formulario de login debe validar email y contraseña antes de enviar.',
          'Usar v-model para los campos del formulario.',
          'Sin frameworks CSS ajenos al proyecto (se permite CSS propio o el sistema de diseño ya definido).',
          'El token JWT recibido en el login debe guardarse y adjuntarse en peticiones protegidas.',
        ],
        deliverables: [
          'Repositorio GitHub con el código fuente (enlace en la entrega).',
          'URL de la SPA desplegada y accesible (Vercel, Netlify u otro).',
          'Capturas de las tres vistas: catálogo, detalle con reseñas, y formulario de login.',
        ],
        checklist: [
          'La ruta / muestra el catálogo con los ítems cargados desde la API.',
          'Hacer clic en un ítem navega a /item/:id y muestra su detalle y reseñas.',
          'La ruta /login tiene un formulario con validación y muestra errores descriptivos.',
          'El login correcto guarda el token y redirige al catálogo.',
          'Las llamadas a la API están centralizadas en src/services/api.ts.',
          'El router usa lazy loading para al menos una vista.',
          'La SPA está desplegada y la URL es accesible.',
        ],
        commonMistakes: [
          'Hacer fetch directamente en el componente en lugar de en el servicio.',
          'No manejar el estado de carga: la vista aparece vacía un instante sin indicación al usuario.',
          'Olvidar adjuntar el token en las peticiones que lo requieren.',
          'Usar la Options API en lugar de la Composition API.',
          'No configurar el servidor de producción para que sirva index.html en cualquier ruta (historyApiFallback).',
        ],
        difficulty: 4,
        timeLimitMinutes: 240,
        skills: ['vue', 'spa'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las tres vistas cargan datos reales de la API, la navegación funciona, y el login autentica correctamente.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Lógica separada en composables y servicio de API; componentes con responsabilidad única y sin código duplicado.',
          },
          {
            name: 'Accesibilidad',
            description: 'Los enlaces de navegación son elementos <a> (RouterLink), el formulario tiene labels asociados y los errores de validación son textos visibles.',
          },
          {
            name: 'Acabado / profesionalidad',
            description: 'La SPA está desplegada, la URL funciona, y la interfaz es coherente con el diseño de ReseñApp.',
          },
        ],
      },
    },
  ],
};
