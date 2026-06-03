// Enumeraciones compartidas entre API y frontend.
// Se mantienen como objetos `as const` (en lugar de `enum` de TS) para que
// sean serializables y compatibles con Zod y Prisma.

export const Role = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const PhaseProgressStatus = {
  LOCKED: 'LOCKED',
  AVAILABLE: 'AVAILABLE',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  COMPLETED: 'COMPLETED',
} as const;
export type PhaseProgressStatus =
  (typeof PhaseProgressStatus)[keyof typeof PhaseProgressStatus];

export const SubmissionStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  NEEDS_WORK: 'NEEDS_WORK',
  REDO: 'REDO',
} as const;
export type SubmissionStatus =
  (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const EvaluationStatus = {
  APROBADO: 'APROBADO',
  REQUIERE_MEJORAS: 'REQUIERE_MEJORAS',
  REHACER: 'REHACER',
} as const;
export type EvaluationStatus =
  (typeof EvaluationStatus)[keyof typeof EvaluationStatus];

export const EstimatedLevel = {
  PRINCIPIANTE: 'PRINCIPIANTE',
  JUNIOR_BAJO: 'JUNIOR_BAJO',
  JUNIOR: 'JUNIOR',
  JUNIOR_SOLIDO: 'JUNIOR_SOLIDO',
  PROFESIONAL_INICIAL: 'PROFESIONAL_INICIAL',
} as const;
export type EstimatedLevel =
  (typeof EstimatedLevel)[keyof typeof EstimatedLevel];

// Etiquetas legibles (para UI). El backend solo guarda el código.
export const ESTIMATED_LEVEL_LABEL: Record<EstimatedLevel, string> = {
  PRINCIPIANTE: 'Principiante',
  JUNIOR_BAJO: 'Junior bajo',
  JUNIOR: 'Junior',
  JUNIOR_SOLIDO: 'Junior sólido',
  PROFESIONAL_INICIAL: 'Profesional inicial',
};

export const EVALUATION_STATUS_LABEL: Record<EvaluationStatus, string> = {
  APROBADO: 'Aprobado',
  REQUIERE_MEJORAS: 'Requiere mejoras',
  REHACER: 'Rehacer',
};

// Reglas de avance (sección 8 del spec).
export const PASS_THRESHOLD = 8; // nota media mínima para completar fase
export const CRITICAL_MIN = 7; // ningún criterio crítico por debajo de esto
export const APPROVE_SUBMISSION_MIN = 7; // nota media mínima para aprobar una entrega
