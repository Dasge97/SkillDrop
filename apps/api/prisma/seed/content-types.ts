// Tipos del contenido del curso (estructura de datos del seed).

export interface RubricCriterionSeed {
  name: string;
  description: string;
  weight?: number; // por defecto 1
  isCritical?: boolean; // por defecto false
}

export interface ChallengeSeed {
  title: string;
  brief: string;
  context: string;
  objective: string;
  targetUser: string;
  restrictions: string[];
  deliverables: string[];
  checklist: string[];
  commonMistakes: string[];
  difficulty: number; // 1-5
  timeLimitMinutes: number;
  skills: string[]; // slugs de skill
  rubric: RubricCriterionSeed[];
}

export interface LessonSeed {
  title: string;
  objective: string;
  theory: string;
  example?: string;
  concepts: string[];
  tools: string[];
  estimatedTimeMinutes: number;
  challenge?: ChallengeSeed;
}

export interface PhaseSeed {
  code: string; // "FASE 0", ...
  title: string;
  objective: string;
  unlockedSkills: string[]; // slugs
  projects: string[]; // descripción de proyectos asociados
  lessons: LessonSeed[];
}

// ---- Presets de criterios de rúbrica reutilizables (sección 6.5 del spec) ----
// Devuelven objetos nuevos para poder ajustarlos por reto.

export const CRIT = {
  jerarquia: (isCritical = false): RubricCriterionSeed => ({
    name: 'Jerarquía visual',
    description: 'Lo importante destaca; el ojo sabe dónde mirar primero.',
    isCritical,
  }),
  alineacion: (): RubricCriterionSeed => ({
    name: 'Alineación',
    description: 'Elementos alineados a una rejilla coherente, sin descuadres.',
  }),
  espaciado: (isCritical = false): RubricCriterionSeed => ({
    name: 'Espaciado',
    description: 'Uso de un sistema de spacing consistente (múltiplos claros).',
    isCritical,
  }),
  tipografia: (): RubricCriterionSeed => ({
    name: 'Tipografía',
    description: 'Escala tipográfica limitada y legible; pesos con intención.',
  }),
  color: (): RubricCriterionSeed => ({
    name: 'Color',
    description: 'Paleta controlada, buen contraste y uso intencional del color.',
  }),
  consistencia: (): RubricCriterionSeed => ({
    name: 'Consistencia',
    description: 'Mismos patrones para mismos problemas en toda la pieza.',
  }),
  autolayout: (isCritical = false): RubricCriterionSeed => ({
    name: 'Uso de Auto Layout',
    description: 'Auto Layout correcto: padding, gap, hug/fill bien aplicados.',
    isCritical,
  }),
  capas: (): RubricCriterionSeed => ({
    name: 'Organización de capas',
    description: 'Nombres claros, agrupación lógica, archivo navegable.',
  }),
  componentes: (isCritical = false): RubricCriterionSeed => ({
    name: 'Componentes',
    description: 'Componentes reutilizables, bien nombrados y con propiedades.',
    isCritical,
  }),
  responsive: (isCritical = false): RubricCriterionSeed => ({
    name: 'Responsive',
    description: 'La interfaz se adapta sin romperse a distintos tamaños.',
    isCritical,
  }),
  accesibilidad: (): RubricCriterionSeed => ({
    name: 'Accesibilidad',
    description: 'Contraste suficiente, tamaños táctiles y foco gestionado.',
  }),
  ux: (isCritical = false): RubricCriterionSeed => ({
    name: 'UX',
    description: 'Decisiones que reducen fricción y resuelven el problema real.',
    isCritical,
  }),
  flujo: (): RubricCriterionSeed => ({
    name: 'Claridad del flujo',
    description: 'El recorrido del usuario es comprensible y sin callejones.',
  }),
  profesionalidad: (): RubricCriterionSeed => ({
    name: 'Profesionalidad',
    description: 'Acabado de producto real, no de ejercicio de clase.',
  }),
  devready: (isCritical = false): RubricCriterionSeed => ({
    name: 'Preparación para desarrollo',
    description: 'Medidas, nombres y assets listos para que un dev lo implemente.',
    isCritical,
  }),
};
