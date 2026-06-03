import { CRIT, type LessonSeed, type PhaseSeed } from './content-types.js';

// Helper para crear lecciones de componentes con su reto en la Fase 6.
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

export const phase06: PhaseSeed = {
  code: 'FASE 6',
  title: 'Componentes profesionales',
  objective: 'Diseñar de forma escalable.',
  unlockedSkills: ['components', 'variants', 'design-systems', 'tokens', 'dev-mode', 'handoff'],
  projects: [
    'Sistema de botones',
    'Sistema de inputs',
    'Sistema de cards',
    'Navbar con variantes',
    'Modal con variantes',
    'Mini UI kit',
  ],
  lessons: [
    lesson(
      'Sistema de botones',
      'Construir un componente de botón escalable con variantes y properties.',
      'Un componente Figma no es solo un frame con nombre. Es una unidad publicable, instanciable y mantenible. La diferencia entre un diseñador junior y uno senior está en cómo nombra y estructura sus componentes: `button/primary/default` no es lo mismo que `Botón azul copia 3`.\n\nLas Variants agrupan estados bajo un solo componente: Primary / Secondary / Danger; Default / Hover / Disabled. Las Component Properties permiten exponer controles sin salir de la instancia: mostrar u ocultar el icono, cambiar el label, alternar el estado. Sin ellas, cada estado es una capa suelta que se desincroniza.\n\nEl naming sigue una convención BEM-like o slash-notation: `Componente/Variante/Estado`. Decide una convención y respétala en cada componente del kit. La consistencia en el naming es lo primero que revisa un desarrollador al hacer handoff.\n\nUn botón bien construido tiene padding controlado con Auto Layout, texto centrado, icono opcional con boolean property, y mínimo cuatro estados: Default, Hover, Focused, Disabled. Cuando cambias el texto de la instancia, el botón crece. Cuando desactivas el icono, el espacio desaparece solo.',
      ['Variants', 'Component Properties', 'Boolean property', 'Slot de icono', 'Naming slash-notation', 'Estados de interacción'],
      ['Components', 'Variants', 'Auto Layout'],
      {
        title: 'Sistema de botones',
        brief:
          'Diseña un componente Button con las variantes Primary, Secondary y Danger; los estados Default, Hover, Focused y Disabled; y una boolean property para mostrar u ocultar un icono a la izquierda.',
        context:
          'El botón es el primer componente de cualquier design system. Si lo construyes bien ahora, cada proyecto futuro lo reutiliza sin rehacer nada.',
        objective:
          'Un componente Button publicable con variantes bien nombradas, properties útiles y Auto Layout que nunca se rompe.',
        targetUser: 'Diseñador o desarrollador que instancia el botón en una pantalla.',
        restrictions: [
          'Naming obligatorio en slash-notation: Button/Primary/Default, Button/Primary/Hover, etc.',
          'Auto Layout en todos los estados.',
          'Boolean property "Icon" para mostrar/ocultar icono.',
          'Text property "Label" editable desde la instancia.',
          'Sin frames con tamaño fijo en el label.',
          'Mínimo 3 variantes × 4 estados = 12 variantes totales.',
        ],
        deliverables: [
          'Frame con la tabla de variantes completa (Figma variant grid).',
          'Frame de demo con al menos 6 instancias en distintas combinaciones.',
          'Link al archivo + captura del panel de propiedades de una instancia.',
        ],
        checklist: [
          'Cambio el label en la instancia y el botón crece correctamente.',
          'Activo/desactivo el icono sin romper el layout.',
          'Los 4 estados son visualmente distinguibles.',
          'El naming es consistente en todas las variantes.',
          'No hay capas sin nombre (Frame 1, Rectangle 2…).',
        ],
        commonMistakes: [
          'Crear un componente por estado en vez de usar Variants.',
          'Naming inconsistente (minúsculas aquí, mayúsculas allá).',
          'Icono con posición absoluta en lugar de Auto Layout.',
          'Olvidar el estado Disabled con opacidad reducida.',
          'Label con ancho fijo que corta el texto largo.',
        ],
        difficulty: 3,
        timeLimitMinutes: 60,
        skills: ['components', 'variants', 'auto-layout'],
        rubric: [
          CRIT.componentes(true),
          CRIT.autolayout(true),
          CRIT.consistencia(),
          CRIT.capas(),
          CRIT.espaciado(),
        ],
      },
    ),
    lesson(
      'Sistema de inputs',
      'Crear un componente Input robusto con todos sus estados y variantes de tipo.',
      'El input es el componente más complejo de documentar porque tiene más estados que cualquier botón: Empty, Filled, Focused, Error, Disabled, y a veces Read-only. Cada uno comunica algo diferente al usuario y al desarrollador.\n\nLas Component Properties son aquí imprescindibles: una boolean property "Icon left", otra "Icon right", una "Helper text" para mostrar el mensaje de ayuda o error, y un "Label" editable. Así el desarrollador puede configurar el input desde el panel sin desagrupar nada.\n\nEl nesting de componentes es la técnica clave: el icono dentro del input es una instancia de tu componente Icon, no un SVG suelto. Cuando actualizas el componente Icon en la librería, todos los inputs se actualizan solos. Esto es escalabilidad real.\n\nDocumenta el componente con una descripción en el panel de Figma y usa anotaciones o un frame de documentación junto a la tabla de variantes. El diseño sin documentación no llega a producción de forma limpia.',
      ['Estados de input', 'Nesting de componentes', 'Instance swap property', 'Helper text', 'Documentación de componentes'],
      ['Components', 'Variants', 'Auto Layout', 'Instance Swap'],
      {
        title: 'Sistema de inputs',
        brief:
          'Diseña un componente Input con variantes de tipo (Text, Password, Email) y estados (Empty, Filled, Focused, Error, Disabled). Incluye label superior, placeholder, helper text y soporte para iconos opcionales.',
        context:
          'Los formularios son la interfaz más usada en productos SaaS. Un input mal construido multiplica el tiempo de maquetación del desarrollador.',
        objective:
          'Componente Input que cubra todos los estados reales con properties configurables desde la instancia.',
        targetUser: 'Usuario rellenando un formulario; desarrollador maquetando la vista.',
        restrictions: [
          'Mínimo 3 tipos × 5 estados = 15 variantes.',
          'Boolean properties: "Icon left", "Icon right", "Helper text visible".',
          'Text properties: "Label", "Placeholder", "Helper text".',
          'El icono debe ser una instancia de un componente Icon (nesting).',
          'El estado Error usa rojo del token de error, no un color libre.',
          'Auto Layout en toda la estructura interna.',
        ],
        deliverables: [
          'Tabla de variantes con los 15+ estados.',
          'Frame de demo: formulario de login usando instancias del componente.',
          'Link + captura del panel de propiedades configurado.',
        ],
        checklist: [
          'Puedo cambiar el tipo (Text/Password/Email) desde el panel de variantes.',
          'El helper text aparece y desaparece sin romper el layout.',
          'El estado Error es visualmente claro (borde + texto de error).',
          'El icono es una instancia anidada, no un SVG suelto.',
          'Todas las capas tienen nombre descriptivo.',
        ],
        commonMistakes: [
          'Estados con alturas distintas (el layout salta al cambiar de estado).',
          'Placeholder usado como label (accesibilidad rota).',
          'Color de error hardcodeado en lugar de usar el token.',
          'Olvidar el estado Disabled (opacity + no interactivo).',
          'No anidar el icono como componente propio.',
        ],
        difficulty: 4,
        timeLimitMinutes: 70,
        skills: ['components', 'variants', 'forms', 'design-systems'],
        rubric: [
          CRIT.componentes(true),
          CRIT.autolayout(true),
          CRIT.accesibilidad(),
          CRIT.consistencia(),
          CRIT.capas(),
        ],
      },
    ),
    lesson(
      'Sistema de cards',
      'Diseñar un componente Card flexible con nesting de subcomponentes.',
      'Una card es un contenedor de información que aparece en grids, listas y dashboards. Su reto de componente no está en el diseño visual, sino en la flexibilidad: la misma card debe servir para un artículo, un producto o una notificación, cambiando solo las properties.\n\nLa técnica es la misma que con el input: expón con Component Properties lo que puede variar. Boolean "Show image", boolean "Show badge", instance swap "Avatar type", text "Title", text "Description". El desarrollador configura la card sin tocar el componente base.\n\nEl nesting aquí es profundo: la card contiene una instancia de Badge, una instancia de Avatar, una instancia de Button. Si cada uno es un componente propio, cambiar el Badge en un sitio lo actualiza en toda la aplicación. Esto es lo que hace escalable un design system.\n\nUn error habitual es crear "Card de producto", "Card de blog" y "Card de usuario" como tres componentes distintos. La solución profesional es un único componente Card con las properties necesarias para cubrir los tres casos.',
      ['Nesting profundo', 'Boolean properties de secciones', 'Instance swap', 'Flexibilidad vs rigidez', 'Un componente, múltiples usos'],
      ['Components', 'Variants', 'Auto Layout', 'Instance Swap'],
      {
        title: 'Sistema de cards',
        brief:
          'Diseña un componente Card capaz de representar al menos tres casos de uso (artículo, producto, usuario) mediante Component Properties, sin duplicar el componente base.',
        context:
          'Las cards son el bloque más repetido en dashboards y listados. Un componente bien diseñado ahorra horas de trabajo al equipo.',
        objective:
          'Card flexible con nesting de Badge, Avatar y Button como subcomponentes instanciados.',
        targetUser: 'Usuario navegando un listado de contenidos o productos.',
        restrictions: [
          'Un único componente base Card (no tres variantes de "tipo").',
          'Boolean properties: "Show image", "Show badge", "Show avatar", "Show footer".',
          'Text properties: "Title", "Description", "Badge label".',
          'Image, Badge, Avatar y Button deben ser instancias anidadas.',
          'Auto Layout vertical con padding y gap consistentes.',
          'La card funciona en anchos de 280px y 400px sin romperse.',
        ],
        deliverables: [
          'Componente Card con properties documentadas.',
          'Demo frame: grid de 6 cards en distintas configuraciones (con/sin imagen, con/sin badge…).',
          'Link + captura del panel de properties en una instancia.',
        ],
        checklist: [
          'Puedo activar/desactivar la imagen y el layout se reajusta solo.',
          'El Badge es una instancia del componente Badge, no texto suelto.',
          'La card mantiene proporciones correctas en dos anchos distintos.',
          'Ninguna capa tiene nombre genérico (Frame 1, Group 3…).',
          'El componente base no tiene capas ocultas innecesarias.',
        ],
        commonMistakes: [
          'Crear Card_Blog, Card_Producto y Card_Usuario como componentes separados.',
          'Ocultar secciones con opacity:0 en lugar de boolean property (ocupan espacio).',
          'Badge como texto suelto en lugar de componente anidado.',
          'Padding inconsistente entre variantes configuradas.',
          'Imagen con tamaño fijo que no escala.',
        ],
        difficulty: 4,
        timeLimitMinutes: 70,
        skills: ['components', 'variants', 'design-systems', 'auto-layout'],
        rubric: [
          CRIT.componentes(true),
          CRIT.autolayout(true),
          CRIT.consistencia(),
          CRIT.responsive(),
          CRIT.capas(),
        ],
      },
    ),
    lesson(
      'Navbar con variantes',
      'Construir una barra de navegación como componente con variantes de breakpoint y estado activo.',
      'Una navbar tiene más complejidad como componente que como frame libre porque debe cubrir múltiples contextos: desktop con texto, tablet con icono+texto, móvil con menú hamburguesa. Estos tres son variantes, no tres archivos distintos.\n\nCada enlace de la navbar es a su vez un componente NavItem con sus propios estados: Default, Active, Hover. La navbar instancia varias NavItems y expone una instance swap o variant property para marcar cuál está activo. Esta es la diferencia entre un diseño y un sistema.\n\nEl naming de una navbar sigue el mismo patrón: `Navigation/Desktop/Default`, `Navigation/Mobile/Open`. El slash final indica la capa de estado o apertura. Mantener esta estructura facilita buscar el componente en cualquier archivo que use la librería.\n\nDurante el handoff, el componente bien nombrado y estructurado permite al desarrollador mapear directamente los estados de la navbar a los estados del componente en código. Menos reuniones de aclaración, menos errores de implementación.',
      ['Componentes de navegación', 'NavItem como subcomponente', 'Breakpoints como variantes', 'Estado Active', 'Naming jerárquico'],
      ['Components', 'Variants', 'Auto Layout', 'Prototyping'],
      {
        title: 'Navbar con variantes',
        brief:
          'Diseña un componente Navbar con variantes para Desktop, Tablet y Mobile, y un subcomponente NavItem con estados Default, Active y Hover.',
        context:
          'La navbar es el primer componente que ven los desarrolladores en un handoff. Si está mal estructurada, la implementación sufre desde el día uno.',
        objective:
          'Navbar escalable con breakpoints como variantes y NavItem como subcomponente reutilizable.',
        targetUser: 'Usuario navegando entre secciones de una web o app.',
        restrictions: [
          'Naming: Navigation/Desktop/Default, Navigation/Tablet/Default, Navigation/Mobile/Closed, Navigation/Mobile/Open.',
          'NavItem es un componente separado con variant Default/Active/Hover.',
          'La navbar Desktop usa Auto Layout space-between.',
          'La versión Mobile incluye el menú desplegable como variante "Open".',
          'El logo es una instancia de un componente Logo.',
          'Máximo 2 niveles de nesting visibles en el panel de capas.',
        ],
        deliverables: [
          'Componente Navbar con las 4 variantes nombradas.',
          'Componente NavItem con sus 3 estados.',
          'Frame de demo: las 4 variantes apiladas para comparación.',
          'Link + captura del panel de variantes.',
        ],
        checklist: [
          'El NavItem activo es visualmente claro (borde, color o peso de fuente).',
          'La versión Mobile/Open muestra el menú sin frames fuera de lugar.',
          'El naming sigue la convención slash en todos los componentes.',
          'Cambiar el logo en el componente Logo actualiza todas las navbars.',
          'Las capas de cada variante tienen los mismos nombres base.',
        ],
        commonMistakes: [
          'Tres frames de navbar separados en lugar de un componente con variantes.',
          'NavItem con estados como capas ocultas en vez de componente propio.',
          'Menú mobile como frame flotante suelto, no como variante.',
          'Naming sin jerarquía (Navbar_desktop, navbar mobile, NAV-TABLET).',
          'Logo como imagen importada directamente, no como instancia.',
        ],
        difficulty: 4,
        timeLimitMinutes: 65,
        skills: ['components', 'variants', 'responsive', 'web-ui', 'mobile-ui'],
        rubric: [
          CRIT.componentes(true),
          CRIT.autolayout(true),
          CRIT.responsive(true),
          CRIT.consistencia(),
          CRIT.capas(),
          CRIT.jerarquia(),
        ],
      },
    ),
    lesson(
      'Modal con variantes',
      'Diseñar un componente Modal reutilizable con variantes de tamaño y tipo de contenido.',
      'Un modal es uno de los patrones de UI más reutilizados y más mal implementados. El error clásico es diseñar el "modal de confirmación", el "modal de formulario" y el "modal de información" como tres frames distintos. El resultado: tres versiones que divergen con el tiempo.\n\nLa solución de componente es un único Modal con instance swap property en el slot de contenido. El header (título + botón de cierre) y el footer (botones de acción) son fijos y compartidos. El body acepta cualquier instancia: un formulario, un mensaje de texto, un listado. Esto es diseño orientado a slots.\n\nLas variantes de tamaño (Small, Medium, Large, Fullscreen) controlan el ancho y alto máximos. Las variantes de tipo (Info, Warning, Danger, Success) cambian el color del header o el icono. Con estas dos dimensiones de variante, un único componente cubre prácticamente todos los casos reales.\n\nEl overlay oscuro detrás del modal es un componente separado (Overlay) que se apila debajo. Documentar esto en el panel de Figma evita confusión durante el handoff.',
      ['Diseño orientado a slots', 'Instance swap en body', 'Variantes de tamaño', 'Overlay como componente', 'Modal header/footer compartidos'],
      ['Components', 'Variants', 'Auto Layout', 'Instance Swap'],
      {
        title: 'Modal con variantes',
        brief:
          'Diseña un componente Modal con variantes de tamaño (Small, Medium, Large) y tipo (Info, Warning, Danger). El body debe aceptar contenido mediante instance swap.',
        context:
          'Los modales aparecen en flujos críticos: confirmaciones de borrado, formularios de creación, alertas de sistema. Un componente sólido evita inconsistencias en esos momentos clave.',
        objective:
          'Modal como componente flexible con slots y variantes, documentado para handoff.',
        targetUser: 'Usuario realizando una acción que requiere confirmación o input adicional.',
        restrictions: [
          'Naming: Modal/Small/Info, Modal/Medium/Warning, Modal/Large/Danger, etc.',
          'Header y Footer son la misma base en todas las variantes.',
          'Instance swap property "Content" en el slot del body.',
          'Componente Overlay separado (fondo oscuro semitransparente).',
          'Botón de cierre (X) en el header como instancia del componente IconButton.',
          'Auto Layout vertical en todo el componente.',
        ],
        deliverables: [
          'Componente Modal con las 9 variantes (3 tamaños × 3 tipos).',
          'Componente Overlay.',
          'Demo frame: modal Medium/Danger sobre overlay en una pantalla de contexto.',
          'Link + captura del panel de properties de una instancia.',
        ],
        checklist: [
          'Puedo cambiar el tamaño y el tipo desde el panel sin desagrupar.',
          'El body acepta un formulario y también un mensaje de texto sin romper el layout.',
          'El botón X es una instancia de IconButton, no un texto suelto.',
          'El Overlay es un componente separado documentado.',
          'El naming es consistente: Modal/Tamaño/Tipo.',
        ],
        commonMistakes: [
          'Tres componentes separados (ModalConfirm, ModalForm, ModalAlert).',
          'Body con altura fija que no crece con el contenido.',
          'Botón de cierre como X de texto sin componente.',
          'Overlay integrado en el componente Modal (dificulta el apilamiento).',
          'Variantes sin naming consistente.',
        ],
        difficulty: 4,
        timeLimitMinutes: 65,
        skills: ['components', 'variants', 'ux-flows', 'design-systems'],
        rubric: [
          CRIT.componentes(true),
          CRIT.autolayout(true),
          CRIT.ux(true),
          CRIT.consistencia(),
          CRIT.capas(),
          CRIT.devready(),
        ],
      },
    ),
    lesson(
      'Mini UI kit',
      'Ensamblar todos los componentes en una librería publicable y documentada.',
      'Un UI kit no es una colección de frames bonitos. Es una librería organizada en páginas, con componentes nombrados de forma coherente, documentación inline y tokens de color y tipografía definidos. La diferencia entre un UI kit amateur y uno profesional está en si otro diseñador puede usarlo sin preguntarte nada.\n\nLa estructura de páginas recomendada: Cover (presentación), Tokens (colores, tipografía, espaciado), Componentes Base (botón, input, badge, icono), Componentes Compuestos (card, navbar, modal), Pantallas de Demo. Esta jerarquía guía al consumidor de la librería.\n\nNaming final de auditoría: abre el panel de Assets y revisa que todos los componentes aparecen en la carpeta correcta, sin nombres genéricos, sin duplicados. Usa la búsqueda para verificar: si buscas "button" y aparecen "Boton", "btn", "Button_v2" y "BUTTON", el kit tiene un problema de naming.\n\nEl dev-ready check es el último paso antes de publicar: ¿cada componente tiene descripción en el panel? ¿los tokens están conectados? ¿los estados interactivos están cubiertos? Un kit publicado en la librería de equipo de Figma es el entregable más profesional que puedes presentar en un portfolio.',
      ['Estructura de librería', 'Páginas de un UI kit', 'Auditoría de naming', 'Dev-ready checklist', 'Publicación de librería', 'Portfolio de componentes'],
      ['Design Systems', 'Dev Mode', 'Tokens', 'Components'],
      {
        title: 'Mini UI kit',
        brief:
          'Organiza todos los componentes de la fase (Button, Input, Card, Navbar, Modal) en un archivo de librería estructurado por páginas, con tokens definidos y naming auditado. El kit debe ser usable por otro diseñador sin explicación previa.',
        context:
          'El checkpoint final de la fase. Demuestra que sabes construir sistemas, no solo pantallas.',
        objective:
          'Librería publicable con componentes organizados, documentados y listos para desarrollo.',
        targetUser: 'Diseñador o desarrollador que consume la librería en otro proyecto.',
        restrictions: [
          'Estructura mínima de páginas: Cover / Tokens / Base Components / Compound Components / Demo.',
          'Todos los tokens de color y tipografía definidos en la página Tokens.',
          'Naming auditado: sin "Frame 1", sin duplicados, sin mezcla de idiomas en nombres.',
          'Cada componente tiene descripción en el panel de Figma (campo Description).',
          'Al menos una pantalla de demo en la página Demo usando únicamente instancias.',
          'No está permitido romper o rediseñar los componentes de lecciones anteriores; solo organizar y documentar.',
        ],
        deliverables: [
          'Archivo de librería con las 5 páginas estructuradas.',
          'Captura del panel de Assets mostrando todos los componentes organizados.',
          'Captura de la página Tokens.',
          'Captura de la página Demo.',
          'Link al archivo Figma.',
        ],
        checklist: [
          'La página Cover tiene título, descripción breve y autor.',
          'Los tokens de color cubren al menos primario, neutros, error y éxito.',
          'No hay ningún componente sin descripción en el panel.',
          'La búsqueda en Assets de "button" devuelve solo variantes de Button.',
          'La pantalla de Demo usa solo instancias (0 frames sueltos).',
          'Otro diseñador puede instanciar cualquier componente sin instrucciones.',
        ],
        commonMistakes: [
          'Juntar todo en una sola página sin estructura.',
          'Tokens definidos como estilos de color sueltos sin organización.',
          'Naming en inglés para algunos componentes y español para otros.',
          'Demo con frames copiados en lugar de instancias reales.',
          'Publicar la librería antes de auditar el naming.',
          'Omitir la descripción de los componentes (el campo más ignorado de Figma).',
        ],
        difficulty: 4,
        timeLimitMinutes: 75,
        skills: ['components', 'variants', 'design-systems', 'tokens', 'dev-mode', 'handoff', 'portfolio'],
        rubric: [
          CRIT.componentes(true),
          CRIT.consistencia(),
          CRIT.capas(),
          CRIT.devready(true),
          CRIT.profesionalidad(),
          { name: 'Estructura de librería', description: 'El kit tiene páginas claras y navegación intuitiva para cualquier consumidor.', isCritical: true },
          { name: 'Naming auditado', description: 'Todos los componentes siguen la misma convención y no hay nombres genéricos.' },
        ],
      },
    ),
  ],
};
