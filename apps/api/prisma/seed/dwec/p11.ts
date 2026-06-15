import { type PhaseSeed } from '../content-types.js';

export const dwecP11: PhaseSeed = {
  code: 'FASE 11',
  title: 'Calidad y proyecto integrador',
  objective: 'Pulir y entregar la SPA de ReseñApp con accesibilidad, manejo de errores, build de producción y pruebas básicas.',
  unlockedSkills: ['accesibilidad-web', 'testing-front', 'spa'],
  projects: [
    'ReseñApp SPA accesible y desplegada',
    'Auditoría de accesibilidad con axe',
    'Suite de pruebas básica con Vitest',
    'Build de producción optimizado',
  ],
  lessons: [
    {
      title: 'Accesibilidad, errores y estados vacíos',
      objective: 'Aplicar roles ARIA, gestión del foco y contraste correcto, y manejar estados de carga, error y lista vacía en la SPA.',
      theory:
        'La accesibilidad web no es un añadido final: es parte de la correctitud del producto. Los lectores de pantalla navegan el DOM usando roles semánticos; usar `<button>` en lugar de `<div @click>`, `<nav>` para la barra de navegación y `<main>` para el contenido principal es la base. Cuando el contenido cambia dinámicamente (una lista que se actualiza tras un fetch), el usuario de lector de pantalla no lo percibe a menos que lo anunciemos con `aria-live="polite"` en el contenedor o movamos el foco al nuevo contenido.\n\nEl contraste mínimo exigido por WCAG 2.1 AA es 4.5:1 para texto normal y 3:1 para texto grande. Verificarlo con las DevTools de Chrome o con la extensión axe antes de entregar evita correcciones tardías. Los elementos interactivos (botones, enlaces, inputs) deben tener un área táctil mínima de 44×44 px y un indicador de foco visible; nunca elimines `outline` sin sustituirlo por otro estilo de foco claro.\n\nLos estados de interfaz que toda vista asíncrona debe contemplar son tres: cargando (skeleton o spinner con `aria-label="Cargando..."`), error (mensaje descriptivo con posibilidad de reintentar) y vacío (texto informativo cuando no hay resultados, nunca una pantalla en blanco). En Vue se gestionan con variables booleanas `cargando` y `error` junto al dato; la plantilla usa `v-if`/`v-else` para mostrar el estado correcto en cada momento.\n\nLa validación robusta de formularios implica validar en cliente antes de enviar (retroalimentación inmediata) y también gestionar los errores que devuelve el servidor (credenciales incorrectas, campo duplicado). El mensaje de error debe asociarse al campo con `aria-describedby` para que sea anunciado por el lector de pantalla cuando el campo recibe el foco.',
      concepts: ['roles ARIA', 'aria-live', 'aria-describedby', 'gestión del foco', 'contraste WCAG AA', 'área táctil', 'estado cargando', 'estado error', 'estado vacío', 'validación en cliente', 'errores de servidor'],
      tools: ['axe DevTools', 'Chrome DevTools (Accessibility)', 'Lighthouse', 'Vue 3'],
      estimatedTimeMinutes: 45,
    },
    {
      title: 'Pruebas básicas, build y despliegue',
      objective: 'Escribir pruebas unitarias de composables con Vitest, generar el build de producción con Vite y desplegar la SPA.',
      theory:
        'Las pruebas del lado cliente se dividen en unitarias (lógica pura: composables, servicios, funciones de utilidad) y de componente (renderizado e interacción). Vitest es el runner natural en proyectos Vite: comparte configuración, soporta HMR en modo watch y tiene una API compatible con Jest. Para composables sin dependencias de DOM, una prueba unitaria es tan sencilla como importar la función, llamarla y asegurar con `expect` el resultado.\n\nLas pruebas de componente necesitan montar el componente en un DOM virtual. Vue Testing Library (o `@vue/test-utils`) monta el componente, simula interacciones del usuario y permite asegurar que el DOM refleja el estado esperado. El principio guía es testear el comportamiento visible, no los detalles de implementación: el usuario ve texto, pulsa botones, lee mensajes de error; no accede directamente al estado interno del componente.\n\nEl build de producción (`npm run build`) genera archivos estáticos en `dist/`: HTML, JS y CSS con nombres hasheados para cache-busting. Para desplegar en Vercel o Netlify basta con apuntar al repositorio y configurar el comando de build y el directorio de salida. El punto crítico de las SPA es el historyApiFallback: el servidor debe devolver `index.html` para cualquier ruta, ya que las rutas las maneja el router del cliente. En Vercel se resuelve con un archivo `vercel.json`; en Netlify con un `_redirects`.\n\nUna pequeña suite de pruebas aporta confianza antes del despliegue: prueba al menos que el servicio de API maneja correctamente una respuesta de error (fetch que falla) y que el composable principal devuelve la lista vacía en el estado inicial.',
      example:
        '// tests/useReseñas.test.ts\nimport { describe, it, expect, vi } from \'vitest\';\nimport { useReseñas } from \'../src/composables/useReseñas\';\n\ndescribe(\'useReseñas\', () => {\n  it(\'devuelve lista vacía en el estado inicial\', () => {\n    const { lista } = useReseñas();\n    expect(lista.value).toEqual([]);\n  });\n\n  it(\'marca error cuando el fetch falla\', async () => {\n    vi.stubGlobal(\'fetch\', vi.fn().mockRejectedValue(new Error(\'red caída\')));\n    const { cargar, error } = useReseñas();\n    await cargar();\n    expect(error.value).toBeTruthy();\n    vi.unstubAllGlobals();\n  });\n});',
      concepts: ['Vitest', 'describe', 'it', 'expect', 'vi.fn', 'vi.stubGlobal', 'Vue Testing Library', 'build de producción', 'dist/', 'historyApiFallback', 'vercel.json', '_redirects', 'cache-busting'],
      tools: ['Vitest', 'Vue Testing Library', 'Vite', 'Vercel', 'Netlify'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Proyecto integrador: ReseñApp SPA completa',
        brief: 'Completa, pule y despliega la SPA de ReseñApp: accesible, con estados de carga y error, conectada a la API real, con un build de producción funcional y una suite mínima de pruebas.',
        context: 'Este es el proyecto final del módulo cliente de DAW. ReseñApp debe ser un producto entregable, no un ejercicio: accesible para usuarios con lector de pantalla, robusta ante fallos de red, desplegada en una URL pública y con un mínimo de pruebas que acrediten su calidad. La API PHP del servidor está operativa; el reto es elevar la calidad del cliente hasta un estándar profesional.',
        objective: 'Entregar la SPA de ReseñApp completa, accesible (WCAG AA básico), con gestión de estados asíncronos, conectada a la API real, con build de producción desplegado y al menos tres pruebas automáticas que pasen.',
        targetUser: 'Cualquier usuario de ReseñApp, incluidos usuarios con discapacidad visual que usen lector de pantalla.',
        restrictions: [
          'La SPA debe pasar la auditoría de Lighthouse Accessibility con una puntuación mínima de 85.',
          'Toda petición a la API debe gestionar los tres estados: cargando, error y vacío.',
          'Los mensajes de error de formulario deben estar asociados con aria-describedby.',
          'El foco debe gestionarse al navegar entre vistas (moverlo al título de la nueva vista o al contenido principal).',
          'Incluir al menos tres pruebas automáticas con Vitest que pasen en CI (npm test).',
          'El build de producción (npm run build) debe completarse sin errores.',
          'La URL desplegada debe servir correctamente cualquier ruta de la SPA (historyApiFallback configurado).',
        ],
        deliverables: [
          'Repositorio GitHub con el código fuente, incluyendo las pruebas (enlace en la entrega).',
          'URL pública de la SPA desplegada y accesible.',
          'Captura de la auditoría Lighthouse (pestaña Accessibility) mostrando la puntuación obtenida.',
          'Capturas de las vistas principales: catálogo, detalle, login y al menos un estado de error o carga visible.',
        ],
        checklist: [
          'El catálogo muestra un indicador de carga mientras espera la API y un mensaje de error si la petición falla.',
          'La vista detalle muestra las reseñas del ítem y gestiona correctamente el estado vacío (sin reseñas aún).',
          'El formulario de login asocia los mensajes de error a sus campos con aria-describedby.',
          'Los elementos interactivos tienen área táctil suficiente y foco visible.',
          'El contraste de texto supera 4.5:1 en las partes principales de la interfaz.',
          'Al navegar entre vistas, el foco se desplaza al inicio del contenido nuevo.',
          'Hay al menos tres pruebas Vitest que cubren lógica del composable o del servicio de API.',
          'npm run build genera el bundle sin errores y npm test pasa.',
          'La URL desplegada carga correctamente al acceder directamente a /item/1 o /login.',
        ],
        commonMistakes: [
          'Eliminar el outline de los elementos sin añadir un estilo de foco alternativo.',
          'No mover el foco tras la navegación programática: el lector de pantalla sigue "leyendo" la vista anterior.',
          'Mostrar la pantalla en blanco mientras carga en lugar de un skeleton o spinner con aria-label.',
          'No configurar historyApiFallback en el proveedor de despliegue y obtener 404 al recargar en cualquier ruta que no sea /.',
          'Escribir pruebas que testean detalles de implementación (estado interno) en lugar de comportamiento visible.',
          'No gestionar el error que devuelve la API cuando las credenciales son incorrectas.',
        ],
        difficulty: 5,
        timeLimitMinutes: 360,
        skills: ['spa', 'accesibilidad-web', 'testing-front'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'La SPA está desplegada, conectada a la API real, y todas las rutas funcionan correctamente incluso al recargar la página.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Código organizado en composables, servicio de API y componentes con responsabilidad única; pruebas Vitest que pasan en CI.',
          },
          {
            name: 'Accesibilidad',
            description: 'Puntuación Lighthouse Accessibility ≥ 85; foco gestionado en navegación; errores de formulario anunciados con aria-describedby; contraste suficiente.',
          },
          {
            name: 'Acabado / profesionalidad',
            description: 'Los tres estados asíncronos (carga, error, vacío) están presentes en todas las vistas; la interfaz es coherente y el producto parece terminado.',
          },
        ],
      },
    },
  ],
};
