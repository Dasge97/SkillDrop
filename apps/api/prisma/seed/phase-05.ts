import { CRIT, type ChallengeSeed, type LessonSeed, type PhaseSeed } from './content-types.js';

// Rúbrica base para retos responsive de la Fase 5.
const responsiveRubric = (): ChallengeSeed['rubric'] => [
  CRIT.responsive(true),
  CRIT.autolayout(true),
  CRIT.alineacion(),
  CRIT.espaciado(true),
  CRIT.jerarquia(),
  CRIT.consistencia(),
];

// Helper para lecciones de la Fase 5.
function lesson(
  title: string,
  objective: string,
  theory: string,
  concepts: string[],
  tools: string[],
  challenge: LessonSeed['challenge'],
): LessonSeed {
  return { title, objective, theory, concepts, tools, estimatedTimeMinutes: 40, challenge };
}

export const phase05: PhaseSeed = {
  code: 'FASE 5',
  title: 'Responsive y diseño multiplataforma',
  objective: 'Diseñar interfaces que funcionen en diferentes tamaños.',
  unlockedSkills: ['responsive', 'grids', 'constraints', 'auto-layout', 'web-ui', 'mobile-ui'],
  projects: [
    'Landing responsive',
    'Dashboard responsive',
    'Ecommerce responsive',
    'Página SaaS responsive',
  ],
  lessons: [
    lesson(
      'Landing responsive: de desktop a mobile',
      'Adaptar una landing completa a tres breakpoints con auto layout y constraints.',
      'El diseño responsive no es "hacer la web más pequeña". Es repensar cómo el contenido se reorganiza según el espacio disponible. Los tres breakpoints clave son desktop (1440px), tablet (768px) y mobile (375px), y cada uno exige decisiones distintas de layout.\n\n' +
        'En Figma, la combinación de Auto Layout + constraints + layout grids es la base técnica del responsive. Los frames de breakpoint son independientes, pero deben compartir sistema de estilos y componentes. Cambiar un color o una tipografía en el sistema debe actualizarse en los tres.\n\n' +
        'La estrategia más común en proyectos reales es desktop-first: diseñas para 1440px y reduces. Mobile-first parte del 375px y escala hacia arriba. Ninguna es universalmente mejor; depende del producto y la audiencia. Lo crítico es elegir una y ser consistente.\n\n' +
        'Las landing pages son el mejor campo de entrenamiento responsive porque combinan todos los patrones: hero con imagen, secciones de features en grid, testimonios, y un footer. Cada sección tiene una adaptación distinta.',
      [
        'Breakpoints (1440 / 768 / 375)',
        'Desktop-first vs mobile-first',
        'Layout grids responsive',
        'Auto Layout fill + hug',
        'Constraints avanzados',
        'Adaptación de contenido',
      ],
      ['Layout grid', 'Auto Layout', 'Constraints', 'Frames por breakpoint', 'Estilos compartidos'],
      {
        title: 'Landing responsive',
        brief:
          'Diseña una landing de producto (tipo SaaS o app) con hero, sección de características, testimonios y footer. Entrégala adaptada a desktop (1440px), tablet (768px) y mobile (375px).',
        context:
          'El cliente necesita una landing que funcione en todos los dispositivos. El equipo de desarrollo pedirá las tres versiones para extraer los valores de layout de cada breakpoint.',
        objective:
          'Demostrar que sabes reorganizar el contenido de forma coherente entre breakpoints sin perder jerarquía ni consistencia visual.',
        targetUser: 'Visitante que puede llegar desde cualquier dispositivo.',
        restrictions: [
          'Tres frames obligatorios: 1440px, 768px y 375px.',
          'Usar layout grids en los tres breakpoints (12 col desktop, 8 col tablet, 4 col mobile).',
          'Auto Layout en todas las secciones; sin posicionamiento libre.',
          'Máximo 2 fuentes y un sistema de color definido.',
          'Los componentes (botones, cards) deben ser los mismos en los tres breakpoints.',
          'El hero debe ser diferente en mobile (imagen reordenada o reducida).',
        ],
        deliverables: [
          'Frame desktop 1440px con la landing completa.',
          'Frame tablet 768px con la landing adaptada.',
          'Frame mobile 375px con la landing adaptada.',
          'Link de Figma con los tres frames visibles.',
        ],
        checklist: [
          'Los tres breakpoints están completos (no parciales).',
          'La jerarquía es legible en mobile sin hacer zoom.',
          'Los grids de columnas son correctos en cada breakpoint.',
          'No hay texto cortado ni elementos desbordados.',
          'Los componentes son consistentes entre los tres.',
          'El hero es funcional en mobile.',
        ],
        commonMistakes: [
          'Copiar el desktop y solo reducir la escala en mobile.',
          'Texto demasiado pequeño en el frame de 375px.',
          'Grids de columnas distintos a los estándar sin justificación.',
          'Elementos con posición absoluta que no se adaptan al cambiar el ancho.',
          'No reorganizar el menú de navegación en mobile (hamburger o simplificado).',
        ],
        difficulty: 3,
        timeLimitMinutes: 70,
        skills: ['responsive', 'grids', 'auto-layout', 'web-ui', 'constraints'],
        rubric: [
          ...responsiveRubric(),
          CRIT.tipografia(),
          CRIT.profesionalidad(),
        ],
      },
    ),
    lesson(
      'Dashboard responsive: información densa, espacio variable',
      'Reorganizar un dashboard complejo manteniendo la legibilidad en todos los tamaños.',
      'Los dashboards son el caso más exigente del diseño responsive: mucha información, muchos elementos, y usuarios que los consultan tanto en pantallas grandes de escritorio como en tablets o incluso móvil. La solución no es meter todo en columnas más estrechas: es priorizar.\n\n' +
        'En desktop, un dashboard puede tener sidebar fijo + área principal con grid de widgets de 3-4 columnas. En tablet, el sidebar colapsa o se convierte en bottom nav, y los widgets pasan a 2 columnas. En mobile, todo va en 1 columna y algunos widgets secundarios se ocultan o se mueven al fondo.\n\n' +
        'El patrón de layout grids cambia: usa 12 columnas en desktop para calcular anchos de widgets, 8 en tablet y 4 en mobile. Los widgets deben construirse con Auto Layout para que el contenido interno fluya cuando el contenedor cambia de ancho.\n\n' +
        'En Figma, los dashboards se benefician enormemente de los componentes con variantes: un widget que tiene variante "compact" para mobile evita duplicar trabajo y mantiene coherencia.',
      [
        'Sidebar colapsable vs bottom nav',
        'Grids de widgets (3 col → 2 col → 1 col)',
        'Priorización de contenido en mobile',
        'Componentes con variantes responsive',
        'Ocultación de elementos secundarios',
      ],
      ['Layout grid', 'Auto Layout', 'Variants', 'Constraints', 'Frames por breakpoint'],
      {
        title: 'Dashboard responsive',
        brief:
          'Diseña un dashboard de analítica (métricas clave, gráficos, tabla de datos y sidebar de navegación) adaptado a desktop (1440px), tablet (768px) y mobile (375px).',
        context:
          'Un cliente de analytics necesita que su dashboard interno funcione también en tablet para los gerentes que lo consultan en reuniones y en mobile para el equipo de ventas en campo.',
        objective:
          'Reorganizar un layout complejo priorizando la información más importante según el tamaño de pantalla, sin perder funcionalidad crítica.',
        targetUser: 'Analista en escritorio, gerente en tablet, comercial en mobile.',
        restrictions: [
          'Tres frames: 1440px, 768px y 375px.',
          'Sidebar en desktop; en mobile usar bottom navigation o menú hamburguesa.',
          'Los widgets del dashboard deben ser componentes con Auto Layout.',
          'En mobile, máximo 3 métricas clave visibles sin scroll.',
          'La tabla de datos debe simplificarse o convertirse en lista en mobile.',
          'Sin posicionamiento libre; todo con Auto Layout y constraints.',
        ],
        deliverables: [
          'Frame desktop 1440px con sidebar + grid de widgets.',
          'Frame tablet 768px con navegación adaptada.',
          'Frame mobile 375px con priorización de contenido.',
          'Link de Figma con los tres frames visibles.',
        ],
        checklist: [
          'El sidebar desaparece en mobile y la navegación es accesible.',
          'Los widgets cambian de distribución entre breakpoints.',
          'La tabla o listado es legible en mobile.',
          'Las métricas clave son visibles sin scroll en mobile.',
          'Los componentes son consistentes entre breakpoints.',
        ],
        commonMistakes: [
          'Mantener el sidebar en mobile ocupando espacio valioso.',
          'Grid de 4 widgets en mobile (demasiado estrecho para leer).',
          'No simplificar la tabla: poner scroll horizontal en vez de rediseñar.',
          'Widgets con tamaños fijos que no se adaptan al ancho.',
          'Ignorar el estado vacío o de carga del dashboard.',
        ],
        difficulty: 4,
        timeLimitMinutes: 80,
        skills: ['responsive', 'grids', 'auto-layout', 'dashboards', 'components', 'variants'],
        rubric: [
          ...responsiveRubric(),
          CRIT.componentes(true),
          CRIT.ux(),
          CRIT.devready(),
        ],
      },
    ),
    lesson(
      'Ecommerce responsive: flujo de compra en cualquier pantalla',
      'Diseñar un catálogo y detalle de producto responsive priorizando la conversión.',
      'El ecommerce es uno de los casos donde el responsive afecta directamente al negocio: más del 60% de las compras online se inician en mobile. Un catálogo que no se lee bien en 375px pierde ventas. No es una mejora opcional, es un requisito de negocio.\n\n' +
        'El patrón de catálogo cambia drásticamente: en desktop puedes tener un grid de 4 columnas de producto con filtros en sidebar; en tablet, 2-3 columnas con filtros en panel lateral colapsable; en mobile, 1 o 2 columnas con filtros en un modal o panel superior. La card de producto debe adaptarse a estos anchos.\n\n' +
        'La página de detalle de producto en mobile reorganiza la imagen (ocupa todo el ancho), el precio y el CTA de compra se anclan al footer (sticky), y la información secundaria (descripción, reviews) baja en la jerarquía. Esta decisión de jerarquía es más importante que la estética.\n\n' +
        'En Figma, el patrón de cards responsive se construye con Auto Layout + fill container para que el grid de Auto Layout externo controle el ancho de cada card. Los filtros se construyen como componentes para facilitar las variantes de estado.',
      [
        'Grid de producto (4→2→1 col)',
        'Card de producto responsive',
        'Filtros: sidebar vs modal',
        'CTA sticky en mobile',
        'Jerarquía en la página de detalle',
        'Mobile-first para ecommerce',
      ],
      ['Auto Layout', 'Layout grid', 'Constraints', 'Variants', 'Prototype (sticky)'],
      {
        title: 'Ecommerce responsive',
        brief:
          'Diseña el catálogo de productos y la página de detalle de un producto de una tienda online, adaptados a desktop (1440px), tablet (768px) y mobile (375px).',
        context:
          'Una tienda de ropa online quiere rediseñar su catálogo. La mitad de sus clientes compran desde el móvil. El equipo de marketing insiste en que el botón de compra sea siempre visible en mobile.',
        objective:
          'Crear un flujo de catálogo → detalle que maximice la conversión en mobile sin sacrificar la experiencia en desktop.',
        targetUser: 'Comprador que navega y compra desde cualquier dispositivo.',
        restrictions: [
          'Tres frames por pantalla (catálogo y detalle): 1440px, 768px y 375px (6 frames en total).',
          'El CTA de compra debe ser sticky en el frame mobile del detalle.',
          'Los filtros del catálogo deben ser accesibles en mobile (no ocultos).',
          'Las cards de producto deben usar el mismo componente base en los tres breakpoints.',
          'Usar layout grids: 12 col desktop, 8 col tablet, 4 col mobile.',
          'Sin imágenes decorativas que no aporten; cada imagen tiene propósito.',
        ],
        deliverables: [
          'Frame catálogo desktop 1440px.',
          'Frame catálogo tablet 768px.',
          'Frame catálogo mobile 375px.',
          'Frame detalle de producto desktop 1440px.',
          'Frame detalle de producto tablet 768px.',
          'Frame detalle de producto mobile 375px (con CTA sticky).',
          'Link de Figma con los seis frames visibles.',
        ],
        checklist: [
          'El catálogo cambia de número de columnas entre breakpoints.',
          'Los filtros son accesibles en mobile.',
          'El CTA de compra es sticky en el frame mobile del detalle.',
          'La card de producto es el mismo componente adaptado.',
          'La imagen del producto ocupa el ancho completo en mobile.',
          'El precio y el CTA están en la parte superior del detalle mobile.',
        ],
        commonMistakes: [
          'Grid de 4 columnas en mobile (ilegible).',
          'Filtros completamente ocultos en mobile sin acceso alternativo.',
          'CTA de compra al final del scroll en mobile (tasa de conversión muy baja).',
          'Imágenes de producto deformadas al cambiar el ancho del contenedor.',
          'No adaptar la cantidad de información visible en la card para mobile.',
        ],
        difficulty: 4,
        timeLimitMinutes: 80,
        skills: ['responsive', 'grids', 'auto-layout', 'mobile-ui', 'web-ui', 'components'],
        rubric: [
          ...responsiveRubric(),
          CRIT.componentes(true),
          CRIT.ux(true),
          CRIT.flujo(),
          CRIT.profesionalidad(),
        ],
      },
    ),
    lesson(
      'SaaS responsive: producto complejo en múltiples pantallas',
      'Adaptar la web de marketing y el panel de una app SaaS a desktop, tablet y mobile.',
      'Las webs SaaS tienen un reto doble: la página de marketing (landing, precios, blog) debe ser impecable en mobile porque ahí llegan los potenciales clientes. El panel de la aplicación (dashboard, configuración, onboarding) debe funcionar en tablet porque muchos usuarios trabajan con ella fuera de la oficina.\n\n' +
        'El diseño de una SaaS responsive combina todos los patrones anteriores: secciones de landing (de la lección 1), widgets de dashboard (lección 2) y formularios de configuración (componente de fases anteriores). La coherencia entre todas las pantallas es más crítica aquí que en proyectos más simples.\n\n' +
        'Los patrones específicos de SaaS en mobile incluyen: navegación simplificada con pestañas inferiores para las secciones principales, tarjetas de configuración en lugar de formularios largos, y modales para acciones secundarias en vez de paneles laterales. El onboarding en mobile merece diseño propio.\n\n' +
        'En esta lección el foco está en la entrega de una interfaz completa y lista para desarrollo: nomenclatura de capas clara, componentes bien construidos y anotaciones de comportamiento responsive donde haga falta.',
      [
        'SaaS marketing vs app UI',
        'Navegación por pestañas en mobile',
        'Formularios de configuración responsive',
        'Onboarding mobile',
        'Anotaciones responsive para desarrollo',
        'Dev-ready: nomenclatura y handoff',
      ],
      ['Auto Layout', 'Layout grid', 'Variants', 'Dev Mode', 'Anotaciones'],
      {
        title: 'Página SaaS responsive',
        brief:
          'Diseña la página de precios de una SaaS y la pantalla principal del panel de usuario, ambas adaptadas a desktop (1440px), tablet (768px) y mobile (375px). Entrega lista para desarrollo con capas nombradas y anotaciones de comportamiento responsive.',
        context:
          'Una startup SaaS de gestión de proyectos necesita rediseñar su página de precios y su panel principal. El lead técnico pedirá el archivo con nombres de capa limpios y notas de comportamiento responsive para no tener que preguntar al diseñador cada ajuste.',
        objective:
          'Diseñar y documentar una interfaz SaaS responsive completa, lista para ser implementada sin ambigüedades por el equipo de desarrollo.',
        targetUser:
          'Decisor de compra en la página de precios; usuario activo en el panel de la app.',
        restrictions: [
          'Seis frames en total: precios y panel × tres breakpoints.',
          'Todas las capas nombradas en inglés (camelCase o kebab-case, consistente).',
          'Incluir al menos una anotación de comportamiento responsive por frame.',
          'La tabla de precios debe convertirse en cards apiladas en mobile.',
          'El panel en mobile usa navegación por pestañas en la parte inferior.',
          'Componentes reutilizables para botones, badges, cards y navegación.',
          'Sin efectos decorativos que no aporten a la funcionalidad.',
        ],
        deliverables: [
          'Frame página de precios desktop 1440px.',
          'Frame página de precios tablet 768px.',
          'Frame página de precios mobile 375px.',
          'Frame panel de usuario desktop 1440px.',
          'Frame panel de usuario tablet 768px.',
          'Frame panel de usuario mobile 375px.',
          'Link de Figma con los seis frames y anotaciones visibles.',
        ],
        checklist: [
          'La tabla de precios pasa a cards apiladas en mobile.',
          'El panel tiene bottom navigation en mobile.',
          'Todas las capas tienen nombre descriptivo (no "Frame 47").',
          'Hay al menos una anotación de comportamiento responsive por frame.',
          'Los componentes son los mismos en los seis frames.',
          'Ningún elemento desborda fuera del frame.',
          'El archivo está organizado y se navega sin confusión.',
        ],
        commonMistakes: [
          'Tabla de precios horizontal en mobile con scroll horizontal (experiencia pésima).',
          'Capas sin nombre que obligan al developer a investigar cada elemento.',
          'Olvidar la navegación mobile del panel (sin bottom tabs).',
          'Anotaciones vagas ("esto cambia en mobile") en vez de específicas.',
          'Componentes distintos entre la página de precios y el panel.',
          'Entrega parcial: solo desktop completo y los otros a medias.',
        ],
        difficulty: 4,
        timeLimitMinutes: 80,
        skills: ['responsive', 'grids', 'auto-layout', 'saas-ui', 'web-ui', 'dev-mode', 'handoff'],
        rubric: [
          ...responsiveRubric(),
          CRIT.componentes(true),
          CRIT.capas(),
          CRIT.devready(true),
          CRIT.profesionalidad(),
          CRIT.ux(),
        ],
      },
    ),
  ],
};
