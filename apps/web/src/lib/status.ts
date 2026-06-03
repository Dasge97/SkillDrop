import type {
  EvaluationStatus,
  PhaseProgressStatus,
  SubmissionStatus,
} from '@skilldrop/shared';

type Tone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';

export const phaseStatusMeta: Record<
  PhaseProgressStatus,
  { label: string; tone: Tone; icon: string }
> = {
  LOCKED: { label: 'Bloqueada', tone: 'muted', icon: '🔒' },
  AVAILABLE: { label: 'Disponible', tone: 'primary', icon: '▶️' },
  IN_PROGRESS: { label: 'En progreso', tone: 'warning', icon: '✏️' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning', icon: '⏳' },
  COMPLETED: { label: 'Completada', tone: 'success', icon: '✅' },
};

export const submissionStatusMeta: Record<
  SubmissionStatus,
  { label: string; tone: Tone }
> = {
  DRAFT: { label: 'Borrador', tone: 'muted' },
  SUBMITTED: { label: 'Enviada', tone: 'primary' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  APPROVED: { label: 'Aprobada', tone: 'success' },
  NEEDS_WORK: { label: 'Requiere mejoras', tone: 'warning' },
  REDO: { label: 'Rehacer', tone: 'danger' },
};

export const evaluationStatusMeta: Record<
  EvaluationStatus,
  { label: string; tone: Tone; mascot: 'success' | 'idea' | 'working' }
> = {
  APROBADO: { label: 'Aprobado', tone: 'success', mascot: 'success' },
  REQUIERE_MEJORAS: { label: 'Requiere mejoras', tone: 'warning', mascot: 'idea' },
  REHACER: { label: 'Rehacer', tone: 'danger', mascot: 'working' },
};
