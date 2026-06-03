import { CRIT, type ChallengeSeed, type PhaseSeed } from './content-types.js';

// Rúbrica base UX reutilizada en los retos de la Fase 4.
const uxRubric = (): ChallengeSeed['rubric'] => [
  CRIT.ux(true),
  CRIT.flujo(),
  CRIT.jerarquia(),
  CRIT.accesibilidad(),
  CRIT.profesionalidad(),
];

export const phase04: PhaseSeed = {
  code: 'FASE 4',
  title: 'UX práctico',
  objective: 'Pensar en flujos, usuarios y decisiones.',
  unlockedSkills: ['ux-flows', 'forms', 'prototyping', 'mobile-ui', 'web-ui'],
  projects: [
    'Wireframe de app móvil',
    'Flujo de registro',
    'Flujo de compra',
    'Rediseño UX de una pantalla confusa',
    'App sencilla desde problema hasta prototipo',
  ],
  lessons: [
    {
      title: 'Wireframes que piensan, no que decoran',
      objective: 'Crear wireframes de baja fidelidad que resuelvan problemas reales.',
      theory:
        'Un wireframe no es un boceto bonito: es una hipótesis. Cada elemento que colocas responde a una pregunta: ¿qué necesita ver el usuario aquí? ¿Qué acción debe poder tomar? Si no puedes justificarlo, sobra.\n\n' +
        'En mobile, el espacio es escaso. Establece una jerarquía clara: lo más importante arriba del fold. Define la arquitectura de información antes de dibujar: ¿qué secciones existen? ¿cómo navega el usuario entre ellas?\n\n' +
        'Los colores y las fuentes bonitas son ruido en esta fase. Trabaja en grises y cajas. El objetivo es validar la estructura, no el estilo.',
      example:
        'App de seguimiento de hábitos: pantalla de inicio con lista de hábitos del día, barra de progreso global y botón flotante de añadir. Todo lo secundario, en un menú inferior.',
      concepts: [
        'Arquitectura de información',
        'Jerarquía de contenido',
        'Patrones de navegación móvil',
        'Priorización visual',
        'Wireframes de baja fidelidad',
      ],
      tools: ['Frames', 'Grids', 'Auto Layout', 'Capas'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Wireframe de app móvil',
        brief:
          'Diseña 3-4 pantallas de wireframe para una app móvil de tu elección (lista de tareas, diario, tienda, etc.). Usa grises y cajas, sin colores ni tipografías finales.',
        context:
          'Un cliente te encarga definir la estructura antes de gastar tiempo en el visual. Necesita ver que la información tiene orden y que el usuario puede moverse sin perderse.',
        objective:
          'Estructurar una app móvil con jerarquía de contenido clara y navegación coherente, justificando cada decisión de layout.',
        targetUser: 'Usuario que usa la app en movilidad, con una sola mano y tiempo limitado.',
        restrictions: [
          'Solo grises (sin paleta de color definitiva).',
          'Máximo 3 pantallas + 1 de navegación o estado vacío.',
          'Frame 390×844 (iPhone 14).',
          'Sin imágenes reales: usa placeholders.',
          'Añadir anotaciones explicando las decisiones clave.',
        ],
        deliverables: [
          '3-4 pantallas de wireframe en un frame.',
          'Al menos 3 anotaciones justificando decisiones de layout.',
          'Link de Figma + captura.',
        ],
        checklist: [
          'La información más importante está visible sin hacer scroll.',
          'La navegación entre pantallas es coherente.',
          'Los elementos tienen jerarquía clara (grande = importante).',
          'He justificado por qué cada elemento está donde está.',
          'El estado vacío está contemplado.',
        ],
        commonMistakes: [
          'Meter demasiado contenido en una pantalla.',
          'Olvidar el estado vacío o de carga.',
          'Copiar patrones sin entender por qué funcionan.',
          'No añadir anotaciones y entregar solo la imagen.',
          'Usar tamaños de texto iguales para todo.',
        ],
        difficulty: 3,
        timeLimitMinutes: 55,
        skills: ['ux-flows', 'mobile-ui', 'hierarchy', 'frames'],
        rubric: [
          CRIT.ux(true),
          CRIT.jerarquia(),
          CRIT.flujo(),
          CRIT.accesibilidad(),
          { name: 'Anotaciones y justificación', description: 'El diseño incluye notas que explican las decisiones de layout con razonamiento claro.', isCritical: true },
        ],
      },
    },
    {
      title: 'Flujos de registro: quitar fricción, no pasos',
      objective: 'Diseñar un flujo de registro que reduzca el abandono sin eliminar información necesaria.',
      theory:
        'El registro es el primer punto de abandono de cualquier producto. Cada campo extra que pides tiene un coste: usuarios que se van. La pregunta no es "¿qué información necesitamos?" sino "¿qué información necesitamos AHORA?"\n\n' +
        'Divide el flujo en pasos si tienes más de 5 campos. Muestra el progreso. Valida en tiempo real, no solo al enviar. Los mensajes de error deben decir qué hacer, no solo qué salió mal.\n\n' +
        'El microcopy importa: "Crea tu cuenta" genera más conversión que "Registro". "Tu email solo se usa para acceder" reduce la desconfianza. Cada línea de texto es UX.',
      example:
        'Paso 1: email y contraseña. Paso 2: nombre y avatar (opcional). Confirmación: bienvenida con siguiente acción clara. Sin pedir teléfono ni fecha de nacimiento hasta que sea necesario.',
      concepts: [
        'Fricción y abandono',
        'Formularios por pasos',
        'Validación en tiempo real',
        'Microcopy',
        'Progresión de registro',
        'Casos borde y errores',
      ],
      tools: ['Auto Layout', 'Frames', 'Prototyping', 'Componentes'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Flujo de registro',
        brief:
          'Diseña el flujo de registro de una app (mínimo 3 pantallas: datos de acceso, perfil básico y pantalla de bienvenida). Incluye al menos un estado de error y uno de validación correcta.',
        context:
          'El equipo de producto detectó un 60% de abandono en el registro actual. Te piden rediseñarlo priorizando la reducción de fricción.',
        objective:
          'Crear un flujo de registro claro, progresivo y con manejo de errores que justifique cada campo solicitado.',
        targetUser: 'Nuevo usuario que se registra desde móvil, escéptico sobre dar sus datos.',
        restrictions: [
          'Máximo 4 campos por paso.',
          'El primer paso solo pide lo esencial para acceder.',
          'Incluir indicador de progreso si hay más de 1 paso.',
          'Los mensajes de error deben ser específicos y accionables.',
          'Frame 390×844 (iPhone 14).',
        ],
        deliverables: [
          'Mínimo 3 pantallas del flujo (datos de acceso, perfil, bienvenida).',
          '1 pantalla con estado de error de validación.',
          'Anotación explicando por qué se pide cada campo.',
          'Link de Figma + captura.',
        ],
        checklist: [
          'El flujo avanza de menos a más información solicitada.',
          'Los errores dicen exactamente qué corregir.',
          'El microcopy es claro y no genérico.',
          'La pantalla de bienvenida da un siguiente paso concreto.',
          'He justificado por qué pedimos cada campo en ese momento.',
        ],
        commonMistakes: [
          'Pedir demasiados datos en el primer paso.',
          'Mensajes de error del tipo "Error en el formulario".',
          'Olvidar la pantalla de confirmación o bienvenida.',
          'No contemplar el estado "contraseña incorrecta".',
          'Usar "Registrarse" en el CTA cuando "Crear cuenta" convierte más.',
        ],
        difficulty: 3,
        timeLimitMinutes: 60,
        skills: ['ux-flows', 'forms', 'mobile-ui', 'prototyping'],
        rubric: [
          CRIT.ux(true),
          CRIT.flujo(),
          { name: 'Microcopy y mensajes', description: 'Los textos de la interfaz son claros, específicos y reducen la fricción activamente.', isCritical: false },
          CRIT.accesibilidad(),
          CRIT.consistencia(),
          { name: 'Manejo de errores', description: 'Los estados de error están contemplados y los mensajes indican exactamente qué hacer.', isCritical: true },
        ],
      },
    },
    {
      title: 'Flujos de compra: la confianza es el producto',
      objective: 'Diseñar un checkout que minimice el abandono de carrito con transparencia y claridad.',
      theory:
        'El 70% de los carritos se abandonan. Las causas principales son: costes inesperados al final, obligación de crear cuenta, proceso demasiado largo y falta de confianza en el pago.\n\n' +
        'Un buen flujo de compra es predecible: el usuario sabe en qué paso está, cuánto falta y cuánto va a pagar antes de llegar al último paso. Sin sorpresas. Muestra los costes totales desde el principio.\n\n' +
        'La pantalla de confirmación no es el final: es el inicio de la relación postventa. Da un número de pedido, el resumen, y el siguiente paso esperado (cuándo llega, qué pasa si algo falla).',
      example:
        'Carrito → Datos de envío → Pago (con logo de la pasarela y candado visible) → Confirmación con número de pedido y fecha estimada. Sin crear cuenta hasta después de comprar.',
      concepts: [
        'Abandono de carrito',
        'Transparencia de precios',
        'Indicadores de progreso',
        'Señales de confianza',
        'Confirmación y postventa',
        'Casos borde: pago fallido',
      ],
      tools: ['Auto Layout', 'Frames', 'Prototyping', 'Componentes'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Flujo de compra',
        brief:
          'Diseña el flujo de checkout de una tienda online: carrito, datos de envío, pago y confirmación. Incluye al menos una señal de confianza y el estado de pago fallido.',
        context:
          'Una tienda online con buen catálogo tiene un 68% de abandono en el checkout. Te piden rediseñarlo sin cambiar la tecnología de pago actual.',
        objective:
          'Diseñar un flujo de compra que genere confianza, sea transparente con los costes y gestione el error de pago correctamente.',
        targetUser: 'Comprador online moderadamente confiado que compra desde móvil.',
        restrictions: [
          'Mostrar el coste total (incluido envío) antes de la pantalla de pago.',
          'Incluir al menos una señal de confianza visible (candado, logo de pasarela, política de devolución).',
          'El flujo no puede obligar a crear cuenta para comprar.',
          'Frame 390×844 (iPhone 14).',
          'Incluir pantalla de error de pago con acción clara.',
        ],
        deliverables: [
          '4 pantallas del flujo: carrito, envío, pago, confirmación.',
          '1 pantalla de error de pago con mensaje accionable.',
          'Anotación explicando dónde y por qué se añade cada señal de confianza.',
          'Link de Figma + captura.',
        ],
        checklist: [
          'El precio final aparece antes de la pantalla de pago.',
          'El progreso es visible en todo momento.',
          'La señal de confianza está en la pantalla de pago.',
          'La confirmación incluye número de pedido y siguiente paso.',
          'El error de pago explica qué ocurrió y cómo solucionarlo.',
        ],
        commonMistakes: [
          'Mostrar el coste de envío solo en el último paso.',
          'Olvidar el estado de pago fallido.',
          'Pantalla de confirmación vacía o genérica.',
          'Ocultar la política de devolución (genera desconfianza).',
          'Pasos sin indicador de progreso.',
        ],
        difficulty: 4,
        timeLimitMinutes: 70,
        skills: ['ux-flows', 'forms', 'mobile-ui', 'prototyping'],
        rubric: [
          CRIT.ux(true),
          CRIT.flujo(),
          { name: 'Transparencia y confianza', description: 'El flujo muestra costes desde el principio e incluye señales de confianza en los momentos críticos.', isCritical: true },
          CRIT.accesibilidad(),
          { name: 'Manejo del error de pago', description: 'El estado de fallo de pago está diseñado con mensaje claro y acción de recuperación.', isCritical: false },
          CRIT.profesionalidad(),
        ],
      },
    },
    {
      title: 'Diagnosticar UX roto: ver antes de resolver',
      objective: 'Identificar y justificar problemas de UX en una pantalla existente antes de rediseñarla.',
      theory:
        'Rediseñar sin diagnosticar es decorar, no diseñar. Antes de abrir Figma, debes ser capaz de articular exactamente qué falla y por qué: ¿hay demasiada fricción? ¿la jerarquía no guía la acción principal? ¿el microcopy confunde?\n\n' +
        'Los problemas de UX más comunes son invisibles para quien los diseñó: demasiadas acciones en una pantalla, CTAs que compiten, ausencia de feedback visual, etiquetas ambiguas y flujos que no contemplan el error.\n\n' +
        'Un buen rediseño UX mantiene el mismo contenido y funcionalidad, pero reorganiza, clarifica y prioriza. Si tienes que eliminar contenido para que funcione, justifícalo. El cliente querrá saber por qué.',
      example:
        'Pantalla original: 7 botones de igual peso visual, formulario sin agrupar y mensaje de error en rojo sin explicación. Diagnóstico: sin jerarquía de acción, sin agrupación lógica, error no accionable. Rediseño: 1 CTA principal, campos agrupados por contexto, error con instrucción.',
      concepts: [
        'Diagnóstico de UX',
        'Priorización de acciones',
        'Claridad vs. complejidad',
        'Feedback visual',
        'Etiquetas y microcopy',
        'Jerarquía de pantalla',
      ],
      tools: ['Frames', 'Auto Layout', 'Anotaciones', 'Capas'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Rediseño UX de una pantalla confusa',
        brief:
          'Elige una pantalla real con problemas de UX (búscala o recréala), elabora un diagnóstico escrito de 3-5 problemas y diseña la versión mejorada manteniendo el contenido original.',
        context:
          'Un cliente tiene una pantalla de configuración de cuenta que genera muchas quejas. Te piden identificar los problemas y proponer una solución justificada.',
        objective:
          'Demostrar capacidad de diagnóstico UX y justificar cada decisión del rediseño con argumentos concretos.',
        targetUser: 'El mismo usuario de la pantalla original, que ahora tiene que completar una tarea sin asistencia.',
        restrictions: [
          'Mantener todo el contenido y funciones del original (sin eliminar nada sin justificación escrita).',
          'Elaborar un diagnóstico con mínimo 3 problemas identificados.',
          'Mostrar antes y después lado a lado.',
          'Cada cambio relevante debe tener una anotación.',
        ],
        deliverables: [
          'Pantalla original (recreada o en captura) + versión rediseñada lado a lado.',
          'Lista de 3-5 problemas UX identificados con descripción.',
          'Anotaciones en el rediseño explicando los cambios.',
          'Link de Figma + captura.',
        ],
        checklist: [
          'El diagnóstico nombra problemas concretos (no "está feo").',
          'Cada problema tiene una solución correspondiente en el rediseño.',
          'La acción principal de la pantalla es obvia en el rediseño.',
          'Los cambios están anotados y justificados.',
          'El contenido es el mismo (o la eliminación está justificada).',
        ],
        commonMistakes: [
          'Cambiar el estilo visual sin tocar la estructura.',
          'Diagnóstico vago: "el diseño no es intuitivo".',
          'Añadir elementos nuevos sin justificación.',
          'Olvidar las anotaciones en el rediseño.',
          'Mejorar la estética pero mantener la jerarquía rota.',
        ],
        difficulty: 4,
        timeLimitMinutes: 65,
        skills: ['ux-flows', 'hierarchy', 'forms', 'web-ui'],
        rubric: [
          CRIT.ux(true),
          { name: 'Diagnóstico previo', description: 'El diseñador articula los problemas UX identificados antes de proponer soluciones, con nombres concretos.', isCritical: true },
          CRIT.jerarquia(),
          CRIT.flujo(),
          CRIT.profesionalidad(),
        ],
      },
    },
    {
      title: 'De problema a prototipo: el proceso completo',
      objective: 'Recorrer el ciclo completo de UX desde la identificación del problema hasta un prototipo navegable.',
      theory:
        'El diseño UX no empieza en Figma. Empieza en una pregunta: ¿qué problema real tiene un usuario concreto? Sin esa respuesta, cualquier pantalla es ficción bien maquetada.\n\n' +
        'El proceso es: problema → usuario → flujo → wireframe → prototipo navegable. Cada paso valida el anterior. Si el flujo no tiene sentido en papel, no lo tendrá en Figma. Si el wireframe no guía al usuario, añadir color no lo arreglará.\n\n' +
        'Un prototipo no tiene que ser bonito: tiene que ser suficientemente real para que alguien pueda usarlo y darte feedback. Conecta las pantallas con los gestos y transiciones correctos. Lo que no puedes navegar, no puedes validar.',
      example:
        'Problema: los usuarios olvidan regar sus plantas. Usuario: persona de 25-35 con varias plantas en casa y agenda ocupada. Flujo: añadir planta → configurar frecuencia → recibir recordatorio → marcar como regada. Wireframe → prototipo navegable con 4 pantallas.',
      concepts: [
        'Definición de problema',
        'Usuario objetivo',
        'User flow',
        'Wireframe a prototipo',
        'Navegación en Figma',
        'Checkpoint de decisiones',
      ],
      tools: ['Frames', 'Auto Layout', 'Prototyping', 'Componentes', 'Conexiones de prototipo'],
      estimatedTimeMinutes: 60,
      challenge: {
        title: 'App sencilla desde problema hasta prototipo',
        brief:
          'Define un problema real de un usuario concreto y diseña una app móvil de 4-5 pantallas que lo resuelva. Entrega el flujo de usuario, los wireframes y el prototipo navegable conectado en Figma.',
        context:
          'Checkpoint de la fase. El cliente quiere ver el proceso completo: desde que defines el problema hasta que puede navegar la solución. Debe poder usarla alguien sin explicaciones tuyas.',
        objective:
          'Demostrar el ciclo completo de UX: definición, flujo, wireframe y prototipo navegable con decisiones justificadas en cada paso.',
        targetUser: 'Usuario definido por ti en el brief del reto (debes describirlo en las anotaciones).',
        restrictions: [
          'Definir el problema en una frase antes de abrir Figma.',
          'Describir al usuario objetivo (edad, contexto, necesidad).',
          'El flujo de usuario debe estar documentado (puede ser un diagrama simple o texto).',
          'Mínimo 4 pantallas conectadas como prototipo navegable.',
          'Frame 390×844 (iPhone 14).',
          'Añadir una anotación por pantalla explicando la decisión de diseño más importante.',
        ],
        deliverables: [
          'Definición del problema (1-2 frases) y descripción del usuario.',
          'Flujo de usuario (diagrama o lista de pasos).',
          '4-5 wireframes o pantallas de media fidelidad.',
          'Prototipo navegable en Figma (presentación o prototype mode).',
          'Anotaciones con justificación de una decisión clave por pantalla.',
          'Link de Figma + captura.',
        ],
        checklist: [
          'El problema está definido en una frase antes de cualquier pantalla.',
          'El usuario está descrito con suficiente detalle para guiar decisiones.',
          'El flujo cubre el camino principal y al menos un caso de error.',
          'Se puede navegar el prototipo sin instrucciones externas.',
          'Cada pantalla tiene su decisión de diseño más importante anotada.',
          'He podido justificar verbalmente cada elemento si me lo preguntan.',
        ],
        commonMistakes: [
          'Empezar en Figma sin definir el problema.',
          'Usuario demasiado genérico: "todo el mundo".',
          'Prototipo con pantallas desconectadas o sin flujo de vuelta.',
          'Saltarse el wireframe e ir directo al visual.',
          'Entregar sin anotaciones y esperar que el diseño se explique solo.',
          'Resolver el problema del diseñador, no el del usuario.',
        ],
        difficulty: 4,
        timeLimitMinutes: 75,
        skills: ['ux-flows', 'prototyping', 'mobile-ui', 'forms', 'hierarchy'],
        rubric: [
          CRIT.ux(true),
          CRIT.flujo(),
          { name: 'Definición de problema y usuario', description: 'El problema está articulado en una frase y el usuario está descrito con contexto suficiente para guiar las decisiones de diseño.', isCritical: true },
          CRIT.accesibilidad(),
          { name: 'Prototipo navegable', description: 'El prototipo se puede navegar de forma autónoma por alguien que no ha visto el diseño antes.', isCritical: false },
          CRIT.profesionalidad(),
        ],
      },
    },
  ],
};
