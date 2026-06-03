import { CRIT, type PhaseSeed } from './content-types.js';

export const phase00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Preparación mental y entorno',
  objective: 'Preparar al usuario para aprender diseño de forma profesional.',
  unlockedSkills: ['frames', 'layers'],
  projects: [
    'Crear el archivo base del bootcamp en Figma con su estructura de páginas.',
  ],
  lessons: [
    {
      title: 'Mentalidad: diseño bonito vs diseño útil',
      objective:
        'Entender la diferencia entre decorar pantallas y diseñar producto.',
      theory:
        'No estás aprendiendo a decorar pantallas: estás aprendiendo a construir productos digitales claros, usables y escalables.\n\n' +
        'UI es cómo se ve. UX es cómo funciona. Product Design es decidir qué construir y por qué. Un diseño "bonito" que confunde al usuario es un mal diseño. Un diseño claro, consistente y predecible casi siempre gana.\n\n' +
        'En equipos reales, el diseñador no trabaja solo: colabora con producto y con desarrollo. Por eso el orden, los nombres y la consistencia importan tanto como la estética. Y por eso evitamos depender de plantillas: una plantilla resuelve una pantalla, pero no te enseña a pensar.',
      example:
        'Compara dos landing pages del mismo producto: una llena de degradados y sombras, otra limpia con buena jerarquía. ¿Cuál entiendes en 3 segundos?',
      concepts: [
        'UI vs UX vs Product Design',
        'Diseño útil > diseño decorativo',
        'Trabajo en equipo real',
        'No depender de plantillas',
      ],
      tools: ['Figma (cuenta)', 'Navegación del lienzo'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'Benchmark: 3 productos que admiras',
        brief:
          'Elige 3 productos digitales (apps o webs) que te parezcan bien diseñados y analiza POR QUÉ funcionan, no si te gustan.',
        context:
          'Antes de diseñar, un profesional sabe mirar. Entrenar el ojo crítico es el primer paso.',
        objective:
          'Desarrollar criterio: separar "me gusta" de "está bien resuelto".',
        targetUser: 'Tú mismo como futuro diseñador de producto.',
        restrictions: [
          'Máximo 1 página de Figma.',
          'Para cada producto: 3 aciertos concretos (no "es bonito").',
          'Sin copiar pantallas, solo notas y capturas.',
        ],
        deliverables: [
          'Una página "04 Referencias" con 3 bloques (uno por producto).',
          'Capturas + 3 notas de acierto por producto.',
        ],
        checklist: [
          'He explicado el porqué, no solo el qué.',
          'Mis notas hablan de jerarquía, claridad o consistencia.',
          'El archivo está ordenado.',
        ],
        commonMistakes: [
          'Decir "me gusta el color" sin justificar.',
          'Analizar solo estética y olvidar usabilidad.',
        ],
        difficulty: 1,
        timeLimitMinutes: 30,
        skills: ['hierarchy'],
        rubric: [
          {
            name: 'Criterio de análisis',
            description: 'Las observaciones explican por qué algo funciona.',
            isCritical: true,
          },
          CRIT.capas(),
          CRIT.profesionalidad(),
        ],
      },
    },
    {
      title: 'Tu primer archivo profesional en Figma',
      objective:
        'Aprender a moverse por Figma y organizar un archivo desde cero.',
      theory:
        'Antes de diseñar, un profesional organiza su espacio. Un archivo desordenado produce diseños desordenados.\n\n' +
        'Las páginas de Figma son como las carpetas de tu mente: separa exploración (Playground) de trabajo serio (Retos, Proyectos) y de tus piezas reutilizables (Componentes) y referencias.\n\n' +
        'Un frame no es un rectángulo cualquiera: es un contenedor con tamaño y reglas. Empieza a pensar en frames, no en formas sueltas.',
      example:
        'Estructura de páginas profesional: 00 Playground · 01 Fundamentos · 02 Retos · 03 Proyectos · 04 Componentes · 05 Referencias.',
      concepts: [
        'Páginas y organización',
        'Frames como contenedores',
        'Portada de archivo',
        'Reglas de trabajo propias',
      ],
      tools: ['Páginas', 'Frame tool (F)', 'Texto (T)', 'Alineación'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Tu primer archivo profesional en Figma',
        brief:
          'Crea desde cero el archivo base de tu bootcamp: una portada limpia y una estructura de páginas profesional.',
        context:
          'Este será tu espacio de trabajo durante todo el curso. Móntalo como lo haría un profesional el primer día.',
        objective:
          'Demostrar que sabes organizar un archivo y crear una portada clara.',
        targetUser: 'Tú, y cualquier mentor que abra tu archivo.',
        restrictions: [
          'No usar plantillas.',
          'No usar más de 2 colores.',
          'No usar más de 2 tamaños de texto.',
          'Mantener alineación limpia.',
        ],
        deliverables: [
          'Páginas: 00 Playground, 01 Fundamentos, 02 Retos, 03 Proyectos, 04 Componentes, 05 Referencias.',
          'Portada con nombre del curso y tu objetivo personal.',
          'Sección "Mis reglas de aprendizaje".',
          'Link de Figma + captura de la portada + nota explicando la organización.',
        ],
        checklist: [
          'Las 6 páginas existen y están bien nombradas.',
          'La portada usa ≤ 2 colores y ≤ 2 tamaños de texto.',
          'Todo está alineado a una rejilla mental.',
          'He añadido mi objetivo y mis reglas.',
        ],
        commonMistakes: [
          'Texto desalineado o centrado "a ojo".',
          'Demasiados tamaños o colores.',
          'Usar una plantilla en vez de construirla.',
        ],
        difficulty: 1,
        timeLimitMinutes: 45,
        skills: ['frames', 'layers', 'alignment'],
        rubric: [
          {
            name: 'Claridad y orden',
            description: 'Archivo navegable; la portada se entiende al instante.',
            isCritical: true,
          },
          CRIT.jerarquia(),
          CRIT.alineacion(),
          {
            name: 'Uso básico de frames',
            description: 'Portada construida con frames, no formas sueltas.',
          },
          CRIT.profesionalidad(),
        ],
      },
    },
  ],
};
