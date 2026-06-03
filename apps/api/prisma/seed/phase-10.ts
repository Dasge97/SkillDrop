import { CRIT, type LessonSeed, type PhaseSeed } from './content-types.js';

function lesson(
  title: string,
  objective: string,
  theory: string,
  concepts: string[],
  tools: string[],
  challenge: LessonSeed['challenge'],
): LessonSeed {
  return { title, objective, theory, concepts, tools, estimatedTimeMinutes: 50, challenge };
}

export const phase10: PhaseSeed = {
  code: 'FASE 10',
  title: 'Handoff y trabajo con desarrollo',
  objective: 'Conectar diseño con código.',
  unlockedSkills: ['dev-mode', 'handoff'],
  projects: [
    'Handoff de landing page',
    'Handoff de app móvil',
    'Documentación de componentes',
    'Guía de frontend',
  ],
  lessons: [
    lesson(
      'Dev Mode: lo que el developer realmente necesita',
      'Aprender a preparar un archivo Figma para que desarrollo lo lea sin preguntas.',
      'Dev Mode es la vista de Figma pensada para developers. Actívala con D y verás lo que ve el developer: medidas, tokens, propiedades CSS, assets exportables. El diseñador que no ha abierto Dev Mode no sabe lo que entrega.\n\nUn developer necesita tres cosas: saber qué mide cada capa, saber qué fuente y color usa, y poder exportar los assets sin pedirte nada. Si alguna de las tres falla, el ticket vuelve contigo.\n\nLas capas nombradas con criterio son el primer filtro. "Frame 23" no le dice nada a nadie. "card-product / image" ya le dice estructura, bloque y elemento. Nombra pensando en el inspector, no en ti.\n\nAntes de dar por entregado un diseño, abre Dev Mode tú mismo y navega el archivo como si fueras el developer. Si algo no se entiende, no está listo.',
      ['Dev Mode', 'Inspect panel', 'Nomenclatura de capas', 'CSS automático', 'Assets exportables'],
      ['Dev Mode (D)', 'Inspect', 'Export'],
      {
        title: 'Handoff de landing page',
        brief:
          'Prepara el handoff completo de una landing de 4 secciones (navbar, hero, features, footer) lista para que un frontend la maquete sin preguntas.',
        context:
          'El equipo de frontend va a recibir tu Figma como única fuente de verdad. No habrá reunión de aclaración: o el archivo es claro o el producto se retrasa.',
        objective:
          'Entregar una landing con todas las capas nombradas, medidas revisadas en Dev Mode, assets marcados para exportar y un frame de anotaciones con breakpoints y espaciados clave.',
        targetUser: 'Developer frontend que maqueta la landing.',
        restrictions: [
          'Todas las capas con nombre semántico (sin "Frame", "Group" sin nombre).',
          'Mínimo 3 assets marcados para exportar en el tamaño correcto.',
          'Un frame de specs con las medidas de grid, breakpoints y padding de secciones.',
          'Sin capas ocultas ni frames vacíos.',
        ],
        deliverables: [
          'Archivo Figma con Dev Mode abierto y todas las capas nombradas.',
          'Frame de specs visible en la misma página.',
          'Link + captura del Inspect panel de un componente.',
        ],
        checklist: [
          'Abro Dev Mode y no veo ninguna capa genérica.',
          'Los assets tienen la configuración de exportación correcta.',
          'El frame de specs incluye grid, breakpoints y padding.',
          'El developer puede maquetar sin hacerme ninguna pregunta.',
        ],
        commonMistakes: [
          'Entregar el archivo sin abrir Dev Mode ni una vez.',
          'Dejar grupos sin nombre que confunden la jerarquía CSS.',
          'Assets embebidos en el diseño sin marcar para exportar.',
          'Omitir los breakpoints y asumir que el developer los adivina.',
        ],
        difficulty: 3,
        timeLimitMinutes: 60,
        skills: ['dev-mode', 'handoff'],
        rubric: [
          CRIT.devready(true),
          CRIT.capas(),
          CRIT.espaciado(),
          CRIT.responsive(),
          CRIT.profesionalidad(),
        ],
      },
    ),
    lesson(
      'Specs de app: medidas, estados y assets móvil',
      'Documentar los estados de una pantalla de app y exportar assets preparados para iOS y Android.',
      'Una app móvil tiene más estados que una web: vacío, cargando, error, éxito, deshabilitado. Si no los diseñas y documentas, el developer los inventa. Y los inventa mal.\n\nPara mobile los assets se exportan en múltiples escalas: @1x, @2x, @3x en iOS; mdpi, hdpi, xhdpi en Android. Figma puede generar todos de un solo clic si los configuras bien. El developer no debería recortar ni escalar nada.\n\nLas medidas en app van en puntos (pt) o dp, no en píxeles físicos. Asegúrate de que tu frame base es el correcto (375 para iOS, 360 para Android) y de que los valores en el Inspect panel son coherentes con la plataforma.\n\nDocumenta en el mismo archivo: qué pantallas existen, qué estados tiene cada una, qué gestos activan qué transiciones. Una nota de texto al lado de un frame vale más que un documento Word separado.',
      ['Estados de UI', 'Escalas de exportación (@1x @2x @3x)', 'Puntos vs píxeles', 'Frames de estado', 'Anotaciones inline'],
      ['Dev Mode', 'Export (múltiples escalas)', 'Inspect panel'],
      {
        title: 'Handoff de app móvil',
        brief:
          'Prepara el handoff de 3 pantallas de una app (listado, detalle, formulario) con todos sus estados y los assets exportados a escala correcta.',
        context:
          'El equipo mobile va a implementar estas pantallas para iOS y Android. Necesitan los estados, las medidas en puntos y los assets en todas las escalas sin tener que pedirte nada.',
        objective:
          'Entregar 3 pantallas con estados documentados (normal, vacío, error, cargando), assets configurados para exportar en @1x @2x @3x y anotaciones de gestos.',
        targetUser: 'Developer iOS o Android que implementa las pantallas.',
        restrictions: [
          'Frame base en 375×812 (iPhone 14 Pro) o 360×800 (Android).',
          'Cada pantalla con mínimo 3 estados (normal, vacío, error).',
          'Todos los iconos marcados para exportar en @1x, @2x y @3x.',
          'Anotaciones de gestos o navegación en cada pantalla.',
        ],
        deliverables: [
          'Archivo con 3 pantallas × 3 estados cada una.',
          'Assets configurados con múltiples escalas de exportación.',
          'Anotaciones de navegación y gestos.',
          'Link + captura del panel de exportación con las escalas.',
        ],
        checklist: [
          'Las pantallas están en el tamaño correcto para la plataforma.',
          'Cada pantalla tiene estado vacío y estado de error.',
          'Los assets se exportan a @1x, @2x y @3x sin ajuste manual.',
          'El developer sabe qué gesto va a qué pantalla.',
        ],
        commonMistakes: [
          'Diseñar solo el estado "feliz" y olvidar vacío y error.',
          'Exportar assets solo en @1x y asumir que el developer escala.',
          'Mezclar unidades dp con px reales en las notas.',
          'No indicar qué navegación activa cada elemento.',
        ],
        difficulty: 4,
        timeLimitMinutes: 75,
        skills: ['dev-mode', 'handoff', 'mobile-ui'],
        rubric: [
          CRIT.devready(true),
          CRIT.capas(),
          CRIT.consistencia(),
          CRIT.responsive(),
          { name: 'Estados documentados', description: 'Vacío, error y cargando están diseñados y visibles.', isCritical: true },
          CRIT.profesionalidad(),
        ],
      },
    ),
    lesson(
      'Documentar componentes: lo que va al design system',
      'Escribir la documentación de un componente de forma que el developer pueda implementarlo sin leer tu mente.',
      'Un componente sin documentación es un componente a medias. El developer necesita saber: qué props tiene, qué variantes existen, qué estados maneja, qué restricciones de uso aplican y qué no debe hacer con él.\n\nEn Figma puedes documentar directamente en el panel de componentes: añade descripción en la propiedad del componente, nombra las variantes con el mismo criterio que usarías en código (variant=primary/secondary, size=sm/md/lg, state=default/hover/disabled).\n\nLos tokens de diseño son el puente entre Figma y código. Si tu color se llama "Azul corporativo" en Figma y "blue-600" en CSS, hay fricción. Si se llama "color/brand/primary" en los dos sitios, el handoff es directo. Usa la nomenclatura de tokens desde el primer componente.\n\nUna buena documentación de componente incluye: descripción de uso, listado de variantes, guía de cuándo NO usarlo y ejemplo visual con medidas. Si el developer tiene que preguntarte algo después de leerla, no está completa.',
      ['Propiedades de componente', 'Nomenclatura de variantes', 'Tokens de diseño', 'Descripción en Figma', 'Guía de uso'],
      ['Component properties', 'Design tokens', 'Dev Mode', 'Variants'],
      {
        title: 'Documentar componentes',
        brief:
          'Documenta 4 componentes de un design system (botón, input, card, badge) con todas sus variantes, estados, tokens y guías de uso.',
        context:
          'El equipo de frontend va a implementar estos componentes en React. Tu documentación en Figma es el contrato: si está mal, el componente saldrá mal.',
        objective:
          'Entregar 4 componentes completamente documentados con descripción, variantes nombradas en clave token, estados, propiedades CSS exportables desde Dev Mode y notas de uso.',
        targetUser: 'Developer frontend que implementa el design system.',
        restrictions: [
          'Variantes nombradas con el patrón propiedad=valor (type=primary, size=md).',
          'Colores y tipografía usando tokens (no valores hexadecimales sueltos en la descripción).',
          'Cada componente con descripción en el panel de Figma.',
          'Incluir al menos un "no hagas esto" por componente.',
        ],
        deliverables: [
          'Página de componentes con 4 componentes documentados.',
          'Sección de tokens con la nomenclatura usada.',
          'Link + captura del panel de propiedades de un componente.',
        ],
        checklist: [
          'Las variantes siguen el patrón propiedad=valor.',
          'Los tokens están nombrados igual que en el código.',
          'Cada componente tiene descripción y guía de uso.',
          'El developer puede implementarlo sin preguntarme nada.',
        ],
        commonMistakes: [
          'Variantes nombradas como "Azul", "Grande", sin criterio de código.',
          'Usar hex en la documentación en vez de nombre de token.',
          'Olvidar el estado disabled o el estado de error en los inputs.',
          'Documentar el componente pero no documentar cuándo NO usarlo.',
        ],
        difficulty: 4,
        timeLimitMinutes: 90,
        skills: ['dev-mode', 'handoff', 'components', 'design-systems', 'tokens'],
        rubric: [
          CRIT.devready(true),
          CRIT.componentes(true),
          CRIT.consistencia(),
          { name: 'Tokens correctos', description: 'Colores y tamaños referenciados por token, no por valor.', isCritical: true },
          CRIT.capas(),
          CRIT.profesionalidad(),
        ],
      },
    ),
    lesson(
      'Guía de frontend: el documento que evita el 80% de los tickets',
      'Crear una guía de handoff que el equipo de desarrollo pueda consultar de forma autónoma.',
      'Una guía de frontend no es un tutorial de Figma. Es un documento operativo que responde las preguntas que el developer va a hacerse antes de que las haga. Qué grid usas, qué breakpoints, qué familia tipográfica, cómo se exportan los iconos, qué archivo tiene los tokens, qué layer o page tiene la versión final.\n\nEl formato importa: listas cortas, capturas anotadas, tablas de valores. Nada de párrafos largos. El developer abre la guía cuando tiene una duda urgente, no para leer.\n\nIncluye un checklist de "el diseño está listo para dev" que el propio diseñador pueda usar antes de entregar. Si el diseñador lo usa bien, el developer recibe archivos limpios. Si no existe, cada entrega tiene calidad diferente.\n\nLa guía vive en Figma, no en Notion ni en un PDF. Así el developer tiene el contexto junto al diseño. Una página llamada "00 — Guía de handoff" al inicio del archivo es suficiente.',
      ['Grid y breakpoints', 'Tipografía y escala', 'Iconos y assets', 'Tokens y variables', 'Checklist de entrega', 'Página de guía en Figma'],
      ['Dev Mode', 'Variables', 'Grids', 'Export'],
      {
        title: 'Crear guía para frontend',
        brief:
          'Crea una página "00 — Guía de handoff" dentro de un archivo Figma de proyecto real o simulado, con toda la información que un frontend necesita para maquetar sin fricción.',
        context:
          'El equipo de frontend cambia de miembro y el nuevo developer tiene que ponerse al día con tu proyecto en menos de 30 minutos usando solo el archivo de Figma.',
        objective:
          'Entregar una guía de handoff autónoma que cubra grid, breakpoints, tipografía, tokens de color, instrucciones de exportación de assets y checklist de entrega.',
        targetUser: 'Developer frontend nuevo en el proyecto.',
        restrictions: [
          'La guía vive en una página propia dentro del archivo Figma.',
          'Incluye tabla de breakpoints con valores en px.',
          'Incluye la escala tipográfica con nombres de token.',
          'Incluye checklist de "diseño listo para dev" con mínimo 8 ítems.',
          'Sin texto corrido: usa listas, tablas y capturas anotadas.',
        ],
        deliverables: [
          'Página "00 — Guía de handoff" en el archivo Figma.',
          'Checklist de entrega visible y usable.',
          'Link + captura de la guía completa.',
        ],
        checklist: [
          'La guía está en una página propia al inicio del archivo.',
          'Un developer nuevo puede maquetar sin preguntarme nada.',
          'El checklist de entrega tiene mínimo 8 ítems accionables.',
          'Los breakpoints y tokens están en formato tabla, no en párrafo.',
          'Las capturas están anotadas con medidas o referencias.',
        ],
        commonMistakes: [
          'Poner la guía en Notion en vez de en el propio Figma.',
          'Escribir párrafos largos en vez de listas y tablas.',
          'Olvidar las instrucciones de exportación de iconos y assets.',
          'Checklist genérico que no refleja el proyecto real.',
          'Guía desactualizada respecto al diseño final.',
        ],
        difficulty: 5,
        timeLimitMinutes: 90,
        skills: ['dev-mode', 'handoff', 'design-systems', 'tokens'],
        rubric: [
          CRIT.devready(true),
          { name: 'Guía autónoma', description: 'Un developer nuevo puede maquetar el proyecto sin preguntar nada.', isCritical: true },
          CRIT.consistencia(),
          CRIT.tipografia(),
          CRIT.responsive(),
          CRIT.profesionalidad(),
          { name: 'Checklist de entrega', description: 'Existe un checklist accionable de mínimo 8 ítems que el diseñador usa antes de entregar.' },
        ],
      },
    ),
  ],
};
